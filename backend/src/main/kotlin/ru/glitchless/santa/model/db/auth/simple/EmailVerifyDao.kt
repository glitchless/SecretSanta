package ru.glitchless.santa.model.db.auth.simple

import org.jetbrains.exposed.dao.LongEntity
import org.jetbrains.exposed.dao.LongEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.LongIdTable

const val TOKEN_LENGTH = 64

object EmailVerifyDao : LongIdTable("email_verify") {
    val loginPasswordId = reference("login_password_id", SimpleUserInfoDAO)
    val token = varchar("token", TOKEN_LENGTH).uniqueIndex()
}

class EmailVerify(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<EmailVerify>(EmailVerifyDao)

    val loginPasswordId by EmailVerifyDao.loginPasswordId
    val token by EmailVerifyDao.token
}
