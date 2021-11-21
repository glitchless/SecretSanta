package ru.glitchless.santa.model.db.auth

import org.jetbrains.exposed.dao.LongEntity
import org.jetbrains.exposed.dao.LongEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.sql.jodatime.datetime
import org.joda.time.DateTime
import ru.glitchless.santa.repository.auth.tp.TPAuthSource
import ru.glitchless.santa.routing.auth.AuthType

object TpUserInfoDAO : CommonUserInfo(AuthType.TECHNO_PORTAL) {
    val tokenAccessToken = text("token_access").nullable()
    val tokenRefreshToken = text("token_refresh").nullable()
    val tokenExpiredIn = long("expires_in").nullable()
    val tokenType = text("type").nullable()
    val tokenScope = text("scope").nullable()
    val tokenCreatedAt = datetime("created_at").clientDefault { DateTime.now() }
    val tpId = integer("tp_id")
    val authSource = enumerationByName("auth_source", 256, TPAuthSource::class)
}

class TpUserInfo(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<TpUserInfo>(TpUserInfoDAO)

    var accessToken by TpUserInfoDAO.tokenAccessToken
    var refreshToken by TpUserInfoDAO.tokenRefreshToken
    var expiredIn by TpUserInfoDAO.tokenExpiredIn
    var type by TpUserInfoDAO.tokenType
    var scope by TpUserInfoDAO.tokenScope
    var createdAt by TpUserInfoDAO.tokenCreatedAt
    var authSource by TpUserInfoDAO.authSource
    var santaUser by TpUserInfoDAO.santaUserId
}
