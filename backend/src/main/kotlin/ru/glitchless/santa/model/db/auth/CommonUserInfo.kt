package ru.glitchless.santa.model.db.auth

import org.jetbrains.exposed.dao.id.LongIdTable
import ru.glitchless.santa.model.db.UserDao
import ru.glitchless.santa.routing.auth.AuthType

abstract class CommonUserInfo(authType: AuthType) : LongIdTable("userinfo" + authType.delegate.getKey()) {
    val santaUserId = reference("santa_user_id", UserDao).uniqueIndex()
    val raw = text("raw").nullable()
}

