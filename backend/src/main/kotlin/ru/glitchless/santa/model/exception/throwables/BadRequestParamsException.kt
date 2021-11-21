package ru.glitchless.santa.model.exception.throwables

import com.google.gson.JsonParseException
import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import ru.glitchless.santa.model.api.HttpError

class BadRequestParamsException(e: Throwable? = null) :
    HttpSupportException(HttpError.BADPARAMS, HttpStatusCode.BadRequest, e)

suspend inline fun <reified T : Any> ApplicationCall.receiveOrThrow(): T {
    try {
        return receive()
    } catch (e: JsonParseException) {
        throw BadRequestParamsException(e)
    }
}

fun String?.toIntOrThrow(): Int? {
    try {
        return this?.toInt()
    } catch (e: NumberFormatException) {
        throw BadRequestParamsException(e)
    }
}

fun String?.toLongOrThrow(): Long? {
    try {
        return this?.toLong()
    } catch (e: NumberFormatException) {
        throw BadRequestParamsException(e)
    }
}
