package ru.glitchless.santa.model.db

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import ru.glitchless.santa.utils.Config
import ru.glitchless.santa.utils.ConfigKey

object UserDao : IntIdTable("users") {
    val fullName = text("fullname")
    val isActive = bool("is_active").default(false).index()
    val isSent = bool("is_sent").default(false)
    val isReceived = bool("is_received").default(false)
    val pairUser = (integer("pair_user").references(UserDao.id)).nullable().uniqueIndex()
    val deliveryName = text("delivery_name")
    val deliveryComment = text("delivery_comment").default(Config.get(ConfigKey.USER_DEFAULT_COMMENT))
    val deliveryAddress = text("delivery_address").default(Config.get(ConfigKey.USER_DEFAULT_ADDRESS))
    val deliveryIndex = text("delivery_index").default("000000")
    val photoUrl = text("photo_url").nullable()
    val profileUrl = text("profile_url").nullable()
    val email = text("email").nullable()
}

class User(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<User>(UserDao)

    var fullName by UserDao.fullName
    var isActive by UserDao.isActive
    var isSent by UserDao.isSent
    var isReceived by UserDao.isReceived
    var pairUser by UserDao.pairUser
    var deliveryName by UserDao.deliveryName
    var deliveryComment by UserDao.deliveryComment
    var deliveryAddress by UserDao.deliveryAddress
    var deliveryIndex by UserDao.deliveryIndex
    var photoUrl by UserDao.photoUrl
    var profileUrl by UserDao.profileUrl
    val email by UserDao.email
}
