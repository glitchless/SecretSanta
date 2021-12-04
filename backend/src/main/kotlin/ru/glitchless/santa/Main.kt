package ru.glitchless.santa


import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import io.ktor.application.*
import io.ktor.features.*
import io.ktor.gson.*
import io.ktor.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.sessions.*
import io.ktor.util.*
import io.sentry.Sentry
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.TransactionManager
import org.jetbrains.exposed.sql.transactions.transaction
import org.telegram.telegrambots.meta.TelegramBotsApi
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession
import ru.glitchless.santa.model.SantaSession
import ru.glitchless.santa.model.db.UserDao
import ru.glitchless.santa.model.db.auth.TpUserInfoDAO
import ru.glitchless.santa.model.db.auth.Vas3kUserInfoDAO
import ru.glitchless.santa.model.db.chat.MessageDao
import ru.glitchless.santa.model.exception.statusErrorSetup
import ru.glitchless.santa.routing.auth.AuthType
import ru.glitchless.santa.routing.auth.initRouteAuth
import ru.glitchless.santa.routing.chat.initRouteChat
import ru.glitchless.santa.routing.initRouteProfile
import ru.glitchless.santa.routing.initRouteStats
import ru.glitchless.santa.utils.Config
import ru.glitchless.santa.utils.ConfigKey
import ru.glitchless.santa.utils.SantaTimer
import ru.glitchless.santa.utils.tg.LogSantaBot
import java.io.File
import java.sql.Connection
import java.util.*

const val SESSION_KEY = "SESSION";
val sessionFolder = Config.get(ConfigKey.SERVER_SESSION_FOLDER)
val cache = directorySessionStorage(File(sessionFolder), cached = false)

@KtorExperimentalAPI
fun main() {
    TimeZone.setDefault(TimeZone.getTimeZone("MSK"))
    initTelegram()
    initExposed()
    initSentry()
    SantaTimer.start()
    val port = Config.get(ConfigKey.SERVER_PORT).toInt()
    embeddedServer(
        Netty,
        port = port,
        module = Application::server,
        configure = {
            responseWriteTimeoutSeconds = Int.MAX_VALUE
        }
    ).start(true)
}

@KtorExperimentalAPI
fun Application.server() {
    install(DefaultHeaders)
    install(ContentNegotiation) {
        gson {}
    }
    install(Sessions) {
        cookie<SantaSession>(SESSION_KEY, cache) {
            cookie.httpOnly = true
        }
    }
    install(StatusPages) {
        statusErrorSetup()
    }
    install(IgnoreTrailingSlash)
    routing {
        route("api") {
            route("stats") {
                initRouteStats()
            }
            route("auth") {
                initRouteAuth()
            }
            route("profile") {
                initRouteProfile()
            }
            route("chat") {
                initRouteChat()
            }
        }
    }
}

private fun connectToDb() {
    val host = Config.get(ConfigKey.SERVER_DATABASE_HOST)
    val db = Config.get(ConfigKey.SERVER_DATABASE_DB)
    val url = "jdbc:postgresql://$host/$db?characterEncoding=utf8&useUnicode=true"
    val user = Config.get(ConfigKey.SERVER_DATABASE_USER)
    val password = Config.get(ConfigKey.SERVER_DATABASE_PASSWORD)
    val connectionPoolSize = Config.get(ConfigKey.SERVER_DATABASE_POOLSIZE).toInt()

    val config = HikariConfig()
    config.driverClassName = "org.postgresql.Driver"
    config.jdbcUrl = url
    config.username = user
    config.password = password
    config.maximumPoolSize = connectionPoolSize

    Database.connect(HikariDataSource(config))
}

private fun initSentry() {
    Sentry.init(Config.get(ConfigKey.SERVER_SENTRY_DSN))
}

private fun initTelegram() {
    if (Config.get(ConfigKey.TG_TOKEN) == "SECRET") {
        return
    }
    val telegramBotsApi = TelegramBotsApi(DefaultBotSession::class.java)
    telegramBotsApi.registerBot(LogSantaBot)
}

private fun initExposed() {
    connectToDb()
    TransactionManager.manager.defaultIsolationLevel =
        Connection.TRANSACTION_SERIALIZABLE // Or Connection.TRANSACTION_READ_UNCOMMITTED
    transaction {
        SchemaUtils.createMissingTablesAndColumns(UserDao, MessageDao)
        when (AuthType.valueOf(Config.get(ConfigKey.AUTH_TYPE))) {
            AuthType.VAS3K -> SchemaUtils.createMissingTablesAndColumns(Vas3kUserInfoDAO)
            AuthType.TECHNO_PORTAL -> SchemaUtils.createMissingTablesAndColumns(TpUserInfoDAO)
        }
    }
}
