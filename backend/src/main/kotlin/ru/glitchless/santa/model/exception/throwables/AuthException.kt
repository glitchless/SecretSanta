package ru.glitchless.santa.model.exception.throwables

import io.ktor.http.*
import ru.glitchless.santa.model.api.HttpError

class AuthException() : HttpSupportException(HttpError.AUTHERROR, HttpStatusCode.Forbidden)
