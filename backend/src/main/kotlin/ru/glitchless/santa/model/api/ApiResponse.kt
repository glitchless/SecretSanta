package ru.glitchless.santa.model.api

import io.ktor.http.*

data class ApiResponse<T>(
    var message: T?,
    var code: Int = HttpStatusCode.OK.value,
    var status: String = HttpStatusCode.OK.description
) {
}
