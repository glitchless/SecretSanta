package ru.glitchless.santa.repository.auth.vas3k

import com.auth0.jwt.exceptions.JWTVerificationException
import com.google.gson.GsonBuilder
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.insertAndGetId
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update
import ru.glitchless.santa.model.api.auth.vas3k.Vas3kUser
import ru.glitchless.santa.model.db.User
import ru.glitchless.santa.model.db.UserDao
import ru.glitchless.santa.model.db.auth.Vas3kUserInfo
import ru.glitchless.santa.model.db.auth.Vas3kUserInfoDAO
import ru.glitchless.santa.model.exception.throwables.AuthException
import ru.glitchless.santa.model.exception.throwables.ExpiredException
import ru.glitchless.santa.utils.Config
import ru.glitchless.santa.utils.ConfigKey
import ru.glitchless.santa.utils.JWTHelper
import ru.glitchless.santa.utils.SantaDateHelper
import ru.glitchless.santa.utils.tg.LogSantaBot

private val jwtHelper = JWTHelper()
private val gson = GsonBuilder().create()

fun finishAuthVas3k(jwt: String): User {
    val json = try {
        jwtHelper.decodeAndValidate(jwt)
    } catch (ex: JWTVerificationException) {
        throw AuthException()
    }
    val vas3kUser = gson.fromJson(json, Vas3kUser::class.java)

    return transaction {
        val existUser = Vas3kUserInfo.find { Vas3kUserInfoDAO.slug eq vas3kUser.slug }
            .firstOrNull()

        if (existUser != null) {
            Vas3kUserInfoDAO.update({ Vas3kUserInfoDAO.slug eq existUser.slug }) {
                it[fullName] = existUser.fullName
                it[raw] = json
            }
            if (existUser.santaUserName.email == null) {
                UserDao.update({ UserDao.id eq existUser.santaUserName.id }) {
                    it[email] = vas3kUser.email
                }
            }
            return@transaction existUser.santaUserName
        }

        val profileUrl = "https://vas3k.club/user/${vas3kUser.slug}/"

        try {
            SantaDateHelper.checkExpired()
            LogSantaBot.logJoin("${vas3kUser.name}", profileUrl)
        } catch (ex: ExpiredException) {
            LogSantaBot.logFailedJoin("${vas3kUser.name}", profileUrl)
            throw ex
        }

        val userId = UserDao.insertAndGetId {
            it[fullName] = vas3kUser.name ?: Config.get(ConfigKey.SANTA_UNKNOWN_NAME)
            it[UserDao.profileUrl] = profileUrl
            it[email] = vas3kUser.email
            it[deliveryName] = vas3kUser.name ?: Config.get(ConfigKey.SANTA_UNKNOWN_NAME)
        }

        Vas3kUserInfoDAO.insert {
            it[slug] = vas3kUser.slug
            it[fullName] = vas3kUser.name
            it[santaUserId] = userId
            it[raw] = json
        }

        return@transaction User[userId]
    }
}
