package ru.glitchless.santa.repository.auth.simple

import io.ktor.http.*
import org.jetbrains.exposed.sql.Transaction
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.insertAndGetId
import org.jetbrains.exposed.sql.transactions.transaction
import org.mindrot.jbcrypt.BCrypt
import ru.glitchless.santa.model.api.HttpError
import ru.glitchless.santa.model.api.auth.simple.SimpleLogin
import ru.glitchless.santa.model.api.auth.simple.SimpleRegister
import ru.glitchless.santa.model.db.User
import ru.glitchless.santa.model.db.UserDao
import ru.glitchless.santa.model.db.auth.simple.*
import ru.glitchless.santa.model.exception.throwables.HttpSupportException
import ru.glitchless.santa.utils.nextToken

object LoginPasswordAuthRepository {
    fun register(register: SimpleRegister) = transaction {
        val user = SimpleUserInfo.find { SimpleUserInfoDAO.email eq register.email }.firstOrNull()
        if (user != null) {
            throw HttpSupportException(HttpError.USER_ALREADY_EXIST, HttpStatusCode.BadRequest)
        }
        //TODO: Add resend email

        if (register.password != register.repeatPassword) {
            throw HttpSupportException(HttpError.PASSWORD_NOT_EQUALS, HttpStatusCode.BadRequest)
        }

        val userId = UserDao.insertAndGetId {
            it[fullName] = register.fullname
            it[deliveryName] = register.fullname
            it[email] = register.email
        }

        SimpleUserInfoDAO.insert {
            it[email] = register.email
            it[passwordBCrypt] = hashPassword(register.password)
            it[santaUserId] = userId
            it[verified] = true //TODO verify email
        }
    }

    fun verify() {

    }

    fun login(login: SimpleLogin): User = transaction {
        val user = SimpleUserInfo.find { SimpleUserInfoDAO.email eq login.email }.firstOrNull()
            ?: throw HttpSupportException(HttpError.NOT_FOUND_USER, HttpStatusCode.BadRequest)

        if (!checkPassword(login.password, user.password)) {
            throw HttpSupportException(HttpError.PASSWORD_NOT_CORRECT, HttpStatusCode.Forbidden)
        }

        if (!user.verified) {
            throw HttpSupportException(HttpError.USER_NOT_VERIFIED, HttpStatusCode.Forbidden)
        }

        return@transaction User.findById(user.santaUser)
            ?: throw HttpSupportException(HttpError.USER_NOT_VERIFIED, HttpStatusCode.Forbidden)
    }

    private fun Transaction.findEmptyToken(): String {
        var token = nextToken(TOKEN_LENGTH)
        while (!EmailVerify.find { EmailVerifyDao.token eq token }.empty()) {
            token = nextToken(TOKEN_LENGTH)
        }
        return token
    }

    private fun hashPassword(password: String): String {
        return BCrypt.hashpw(password, BCrypt.gensalt())
    }

    private fun checkPassword(password: String, hash: String): Boolean {
        return BCrypt.checkpw(password, hash)
    }
}
