package ru.glitchless.santa.routing

import io.ktor.application.*
import io.ktor.routing.*
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import ru.glitchless.santa.model.api.ApiResponse
import ru.glitchless.santa.model.api.Stats
import ru.glitchless.santa.model.api.UsersStats
import ru.glitchless.santa.model.db.UserDao
import ru.glitchless.santa.utils.*

fun Route.initRouteStats() {
    get {
        val stats = Stats(
            getUsersStats(),
            SantaDateHelper.getUnixTime(),
            Config.get(ConfigKey.SANTA_STARTDATE).toDate().time,
            Config.get(ConfigKey.SANTA_ENDDATE).toDate().time,
            SantaDateHelper.isExpired()
        )

        call.respondWithCode(ApiResponse(stats))
    }
}

private fun getUsersStats(): UsersStats {
    val stats = UsersStats()
    transaction {
        stats.activeUser = UserDao.select { UserDao.isActive eq true }.count()
        stats.receivedUser = UserDao.select { UserDao.isReceived eq true }.count()
        stats.sentUser = UserDao.select { UserDao.isSent eq true }.count()
    }
    return stats
}
