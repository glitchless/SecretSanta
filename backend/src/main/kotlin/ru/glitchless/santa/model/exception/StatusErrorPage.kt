package ru.glitchless.santa.model.exception

import io.ktor.application.*
import io.ktor.features.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.util.*
import io.sentry.Sentry
import io.sentry.SentryEvent
import io.sentry.SentryLevel
import org.jetbrains.exposed.exceptions.ExposedSQLException
import ru.glitchless.santa.model.api.ErrorResponse
import ru.glitchless.santa.model.api.HttpError
import ru.glitchless.santa.model.exception.throwables.DeliveryInformationValidateParamsException
import ru.glitchless.santa.model.exception.throwables.HttpSupportException
import ru.glitchless.santa.model.exception.throwables.ValidateParamsException
import ru.glitchless.santa.utils.respondError
import ru.glitchless.santa.utils.tg.LogSantaBot
import java.net.ConnectException
import java.sql.SQLException

fun StatusPages.Configuration.statusErrorSetup() {
    exception<Throwable> {
        call.application.environment.log.error("Throwable", it)
        LogSantaBot.logInternalError(it)
        captureExceptionForCall(call, it)
        call.respondError(
            ErrorResponse(
                HttpError.INTERNAL, it.localizedMessage
                    ?: "Unknown error"
            ), HttpStatusCode.InternalServerError
        )
    }
    exception<HttpSupportException> {
        call.respondError(it.error, it.code)
    }
    exception<ConnectException> {
        call.respondError(ErrorResponse(HttpError.BADPARAMS), HttpStatusCode.BadGateway)
    }
    exception<ValidateParamsException> {
        call.respondError(
            ErrorResponse(HttpError.BADPARAMS, mapOf("errors" to it.paramsError)),
            HttpStatusCode.BadRequest
        )
    }
    exception<DeliveryInformationValidateParamsException> {
        call.respondError(
            ErrorResponse(HttpError.BADPARAMS, mapOf("errors" to it.paramsError)),
            HttpStatusCode.BadRequest
        )
    }
    status(HttpStatusCode.NotFound) {
        call.respondError(ErrorResponse(HttpError.NOTFOUND), HttpStatusCode.NotFound)
    }
}

fun captureExceptionForCall(call: ApplicationCall, exception: Throwable) {
    val headers = call.request.headers.toMap().map { entry ->
        entry.value.map { entry.key to it }
    }.flatten().toMap()
    val cookies = call.request.cookies.rawCookies
    val queryParams = call.request.queryParameters.toMap().map { entry ->
        entry.value.map { entry.key to it }
    }.flatten().toMap()
    val contexts = mapOf(
        "headers" to headers,
        "cookies" to cookies,
        "queryparams" to queryParams
    )

    val event = SentryEvent(exception)

    if (exception is SQLException) {
        event.setExtra("Sql Code", exception.errorCode)
    }

    if (exception is ExposedSQLException) {
        event.setExtra("Sql Query", exception.causedByQueries().joinToString { ";\n" })
    }
    event.contexts.putAll(contexts)
    event.level = SentryLevel.ERROR
    event.setTag("path", call.request.path())
    event.environment = System.getenv("APP_ENV") ?: "unknown"
    // event.serverName

    Sentry.captureEvent(event)
}
