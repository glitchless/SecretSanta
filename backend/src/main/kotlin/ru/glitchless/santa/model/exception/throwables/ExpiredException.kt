package ru.glitchless.santa.model.exception.throwables

import io.ktor.http.*
import ru.glitchless.santa.model.api.HttpError

class ExpiredException : HttpSupportException(HttpError.EXPIRED, HttpStatusCode.BadRequest)
