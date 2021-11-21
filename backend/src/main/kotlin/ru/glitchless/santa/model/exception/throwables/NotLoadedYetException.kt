package ru.glitchless.santa.model.exception.throwables

import io.ktor.http.*
import ru.glitchless.santa.model.api.HttpError

class NotLoadedYetException : HttpSupportException(HttpError.NOT_FOUND_EVENT, HttpStatusCode.Processing)
