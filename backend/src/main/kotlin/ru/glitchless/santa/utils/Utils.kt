package ru.glitchless.santa.utils

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.response.*
import io.ktor.sessions.*
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withTimeout
import ru.glitchless.santa.SESSION_KEY
import ru.glitchless.santa.model.SantaSession
import ru.glitchless.santa.model.api.ApiResponse
import ru.glitchless.santa.model.api.ErrorResponse
import ru.glitchless.santa.model.exception.throwables.AuthException
import java.util.concurrent.TimeUnit
import kotlin.coroutines.Continuation

fun nextToken(length: Int = 64): String {
    val allowedChars = ('A'..'Z') + ('a'..'z') + ('0'..'9')
    return (1..length)
        .map { allowedChars.random() }
        .joinToString("")
}

fun ApplicationCall.getSession(): SantaSession {
    var session: SantaSession? = null
    try {
        session = sessions.get(SESSION_KEY) as? SantaSession
    } catch (e: Exception) {
        sessions.clear(SESSION_KEY)
        e.printStackTrace()
    }
    if (session == null) {
        throw AuthException()
    }
    return session
}

fun ApplicationCall.createSession(): SantaSession {
    sessions.clear(SESSION_KEY)
    val session = SantaSession()
    sessions.set(SESSION_KEY, session)
    return session
}

fun ApplicationCall.clearSession() {
    sessions.clear(SESSION_KEY)
}

suspend inline fun ApplicationCall.respondWithCode(
    response: ApiResponse<*>,
    status: HttpStatusCode = HttpStatusCode.OK
) {
    response.code = status.value
    response.status = status.description
    this.respond(status, response)
}


suspend inline fun ApplicationCall.respondError(response: ErrorResponse, status: HttpStatusCode = HttpStatusCode.OK) {
    this.respond(status, ApiResponse(response.reason, status.value, response.status.id))
}

suspend inline fun <T> suspendCoroutineWithTimeout(
    timeout: Long, unit: TimeUnit = TimeUnit.MILLISECONDS,
    crossinline block: (Continuation<T>) -> Unit
) = withTimeout(unit.toMillis(timeout)) {
    suspendCancellableCoroutine(block = block)
}
