package ru.glitchless.santa.routing.auth.tp

import io.ktor.application.*
import io.ktor.client.*
import io.ktor.client.engine.apache.*
import io.ktor.client.features.*
import io.ktor.client.features.json.*
import io.ktor.http.*
import io.ktor.routing.*
import ru.glitchless.santa.model.api.ApiResponse
import ru.glitchless.santa.model.api.HttpError
import ru.glitchless.santa.model.api.auth.tp.TPOauthCode
import ru.glitchless.santa.model.exception.throwables.AuthException
import ru.glitchless.santa.model.exception.throwables.HttpSupportException
import ru.glitchless.santa.model.exception.throwables.receiveOrThrow
import ru.glitchless.santa.repository.auth.tp.OAuthTpRepository
import ru.glitchless.santa.routing.auth.IAuthType
import ru.glitchless.santa.routing.toFullApiObject
import ru.glitchless.santa.utils.createSession
import ru.glitchless.santa.utils.respondWithCode


val client = HttpClient(Apache) {
    install(JsonFeature) {
        serializer = GsonSerializer()
    }
}

object TechnoPortalAuth : IAuthType {
    private val oAuthTpRepository = OAuthTpRepository(client)
    override fun getKey() = "tp"

    override fun initRoutes(route: Route) = route.invoke {
        post {
            val code = call.receiveOrThrow<TPOauthCode>()
            val authSource = code.authSource
                ?: throw HttpSupportException(HttpError.BADPARAMS, HttpStatusCode.BadRequest)
            try {
                val user = oAuthTpRepository.oAuthTp(
                    authSource,
                    code.code,
                    code.redirectUrl,
                    call.application.log
                )

                call.createSession().userId = user.id.value

                call.respondWithCode(ApiResponse(user.toFullApiObject()))
            } catch (ex: ClientRequestException) {
                throw AuthException()
            }
        }
    }
}

