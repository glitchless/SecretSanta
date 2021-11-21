package ru.glitchless.santa.model.db.auth.simple

import org.jetbrains.exposed.dao.LongEntity
import org.jetbrains.exposed.dao.LongEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import ru.glitchless.santa.model.db.auth.CommonUserInfo
import ru.glitchless.santa.routing.auth.AuthType

object SimpleUserInfoDAO : CommonUserInfo(AuthType.LOGINPASSWORD) {
    val email = text("email").uniqueIndex()
    val passwordBCrypt = text("password")
    val verified = bool("verified").default(false)
}

class SimpleUserInfo(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<SimpleUserInfo>(SimpleUserInfoDAO)

    var email by SimpleUserInfoDAO.email
    var password by SimpleUserInfoDAO.passwordBCrypt
    var verified by SimpleUserInfoDAO.verified
    val santaUser by SimpleUserInfoDAO.santaUserId
}
