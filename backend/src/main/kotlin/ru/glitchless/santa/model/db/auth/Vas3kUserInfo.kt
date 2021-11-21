package ru.glitchless.santa.model.db.auth

import org.jetbrains.exposed.dao.LongEntity
import org.jetbrains.exposed.dao.LongEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import ru.glitchless.santa.model.db.User
import ru.glitchless.santa.routing.auth.AuthType

object Vas3kUserInfoDAO : CommonUserInfo(AuthType.VAS3K) {
    val slug = text("slug").uniqueIndex()
    val fullName = text("full_name").nullable()
}

class Vas3kUserInfo(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<Vas3kUserInfo>(Vas3kUserInfoDAO)

    var santaUserName by User referencedOn Vas3kUserInfoDAO.santaUserId
    var slug by Vas3kUserInfoDAO.slug
    var fullName by Vas3kUserInfoDAO.fullName
    var raw by Vas3kUserInfoDAO.raw
}
