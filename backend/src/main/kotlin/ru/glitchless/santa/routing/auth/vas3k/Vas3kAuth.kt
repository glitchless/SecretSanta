package ru.glitchless.santa.routing.auth.vas3k

import io.ktor.application.*
import io.ktor.routing.*
import ru.glitchless.santa.model.api.ApiResponse
import ru.glitchless.santa.model.api.auth.vas3k.Vas3kAuthCode
import ru.glitchless.santa.model.exception.throwables.receiveOrThrow
import ru.glitchless.santa.repository.auth.vas3k.finishAuthVas3k
import ru.glitchless.santa.routing.auth.IAuthType
import ru.glitchless.santa.routing.toFullApiObject
import ru.glitchless.santa.utils.createSession
import ru.glitchless.santa.utils.respondWithCode

object Vas3kAuth : IAuthType {
    override fun getKey() = "vas3k"

    override fun initRoutes(route: Route) = route.invoke {
        post {
            val jwt = call.receiveOrThrow<Vas3kAuthCode>().jwt

            val user = finishAuthVas3k(jwt)
            call.createSession().userId = user.id.value

            call.respondWithCode(ApiResponse(user.toFullApiObject()))
        }
    }
}
