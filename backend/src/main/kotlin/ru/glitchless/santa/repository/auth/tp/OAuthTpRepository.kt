package ru.glitchless.santa.repository.auth.tp

import io.ktor.client.*
import io.ktor.client.request.*
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.insertAndGetId
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update
import org.joda.time.DateTime
import org.slf4j.Logger
import ru.glitchless.santa.model.api.auth.tp.OAuthToken
import ru.glitchless.santa.model.api.auth.tp.TechnoparkContacts
import ru.glitchless.santa.model.api.auth.tp.TechnoparkExtraUser
import ru.glitchless.santa.model.api.auth.tp.TechoparkUser
import ru.glitchless.santa.model.db.User
import ru.glitchless.santa.model.db.UserDao
import ru.glitchless.santa.model.db.auth.TpUserInfo
import ru.glitchless.santa.model.db.auth.TpUserInfoDAO
import ru.glitchless.santa.model.exception.throwables.ExpiredException
import ru.glitchless.santa.utils.Config
import ru.glitchless.santa.utils.ConfigKey
import ru.glitchless.santa.utils.SantaDateHelper
import ru.glitchless.santa.utils.tg.LogSantaBot
import java.util.*

class OAuthTpRepository(private val client: HttpClient) {
    suspend fun oAuthTp(
        tpAuthSource: TPAuthSource,
        code: String,
        redirectUrl: String,
        log: Logger
    ) = coroutineScope {
        val baseUrl = tpAuthSource.baseUrl

        val token = client.post<OAuthToken>(
            "$baseUrl/token/?code=$code&grant_type=authorization_code&redirect_uri=$redirectUrl"
        ) {
            val auth =
                String.format(
                    "%s:%s",
                    Config.get(ConfigKey.AUTH_TP_CLIENT_ID),
                    Config.get(ConfigKey.AUTH_TP_CLIENT_SECRET)
                )
                    .base64()
            header("Authorization", "Basic $auth")
        }

        log.debug("Get token for $code: $token")

        val profileRequest = async {
            client.get<TechoparkUser>("$baseUrl/profile/main/") {
                header("Authorization", "${token.tokenType} ${token.accessToken}")
            }
        }
        val extraRequest = async {
            client.get<TechnoparkExtraUser>("$baseUrl/profile/extra/") {
                header("Authorization", "${token.tokenType} ${token.accessToken}")
            }
        }
        val contactsRequest = async {
            client.get<TechnoparkContacts>("$baseUrl/profile/contacts/") {
                header("Authorization", "${token.tokenType} ${token.accessToken}")
            }
        }

        val profileInfo = profileRequest.await()
        log.debug("Get profile info for $code: $profileInfo")
        val extraInfo = extraRequest.await()
        log.debug("Get extra info for $code: $extraInfo")
        val contactsInfo = contactsRequest.await()
        log.debug("Get extra info for $code: $contactsInfo")

        return@coroutineScope getUser(profileInfo, extraInfo, contactsInfo, tpAuthSource, token)
    }

    fun getUser(
        profileInfo: TechoparkUser,
        extraInfo: TechnoparkExtraUser,
        contactsInfo: TechnoparkContacts,
        tpAuthSource: TPAuthSource,
        token: OAuthToken
    ) = transaction {
        val tpUserInfo = TpUserInfo
            .find { (TpUserInfoDAO.tpId eq profileInfo.id) and (TpUserInfoDAO.authSource eq tpAuthSource) }
            .firstOrNull()
        var existUser: User? = null
        if (tpUserInfo != null) {
            existUser = User.findById(tpUserInfo.santaUser)
        }
        if (existUser != null) {
            TpUserInfoDAO.update({ TpUserInfoDAO.santaUserId eq existUser.id }) {
                it[tokenAccessToken] = token.accessToken
                it[tokenRefreshToken] = token.refreshToken
                it[tokenExpiredIn] = token.expiresIn
                it[tokenType] = token.tokenType
                it[tokenScope] = token.scope
                it[tokenCreatedAt] = DateTime.now()
                it[tpId] = profileInfo.id
            }
            if (contactsInfo.email != null) {
                UserDao.update({ UserDao.id eq existUser.id }) {
                    it[email] = contactsInfo.email
                }
            }
            existUser.refresh()
            return@transaction existUser
        }

        try {
            SantaDateHelper.checkExpired()
            LogSantaBot.logJoin("${profileInfo.firstName} ${profileInfo.lastName}", extraInfo.profileLink)
        } catch (ex: ExpiredException) {
            LogSantaBot.logFailedJoin("${profileInfo.firstName} ${profileInfo.lastName}", extraInfo.profileLink)
            throw ex
        }

        val userId = UserDao.insertAndGetId {
            it[fullName] = "${profileInfo.firstName} ${profileInfo.lastName}"
            it[profileUrl] = extraInfo.profileLink
            it[photoUrl] = extraInfo.photoUrl
            it[deliveryName] = "${profileInfo.firstName} ${profileInfo.lastName}"
            it[email] = contactsInfo.email
        }

        TpUserInfoDAO.insert {
            it[tokenAccessToken] = token.accessToken
            it[tokenRefreshToken] = token.refreshToken
            it[tokenExpiredIn] = token.expiresIn
            it[tokenType] = token.tokenType
            it[tokenScope] = token.scope
            it[tokenCreatedAt] = DateTime.now()
            it[santaUserId] = userId
            it[authSource] = tpAuthSource
            it[tpId] = profileInfo.id
        }

        return@transaction User[userId]
    }
}

private fun String.base64(): String {
    return String(Base64.getEncoder().encode(this.toByteArray()))
}
