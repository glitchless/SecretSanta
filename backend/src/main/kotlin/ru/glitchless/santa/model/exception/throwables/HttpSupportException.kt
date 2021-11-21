package ru.glitchless.santa.model.exception.throwables

import io.ktor.http.*
import ru.glitchless.santa.model.api.ErrorResponse
import ru.glitchless.santa.model.api.HttpError

open class HttpSupportException(val error: ErrorResponse, val code: HttpStatusCode, val e: Throwable? = null) :
    RuntimeException("$error + $code", e) {
    constructor(httpError: HttpError, code: HttpStatusCode = HttpStatusCode.BadRequest, e: Throwable? = null) :
            this(ErrorResponse(httpError), code, e)
}
