package ru.glitchless.santa.model.exception.throwables

import io.ktor.http.*
import ru.glitchless.santa.model.api.HttpError

class DeliveryInformationValidateParamsException(val paramsError: Map<String, Map<String, String>>) :
    HttpSupportException(HttpError.BADFORM, HttpStatusCode.Processing)

class ValidateParamsException(val paramsError: Map<String, String>) :
    HttpSupportException(HttpError.BADFORM, HttpStatusCode.Processing)
