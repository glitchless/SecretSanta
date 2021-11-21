package ru.glitchless.santa.routing.auth

import io.ktor.application.*
import io.ktor.routing.*
import ru.glitchless.santa.model.api.ApiResponse
import ru.glitchless.santa.routing.auth.simple.LoginPasswordAuth
import ru.glitchless.santa.routing.auth.test.TestAuth
import ru.glitchless.santa.routing.auth.tp.TechnoPortalAuth
import ru.glitchless.santa.routing.auth.vas3k.Vas3kAuth
import ru.glitchless.santa.utils.Config
import ru.glitchless.santa.utils.ConfigKey
import ru.glitchless.santa.utils.clearSession
import ru.glitchless.santa.utils.respondWithCode

private val authType = AuthType.valueOf(Config.get(ConfigKey.AUTH_TYPE)).delegate

enum class AuthType(val delegate: IAuthType) {
    TECHNO_PORTAL(TechnoPortalAuth),
    VAS3K(Vas3kAuth),
    LOGINPASSWORD(LoginPasswordAuth)
}

interface IAuthType {
    fun getKey(): String
    fun initRoutes(route: Route)
}

fun Route.initRouteAuth() {
    route(authType.getKey()) {
        authType.initRoutes(this)
    }
    if (Config.get(ConfigKey.ENVIRONMENT_DEBUG).toBoolean()) {
        route("test") {
            TestAuth().initRoutes(this)
        }
    }
    post("logout") {
        call.clearSession()
        call.respondWithCode(ApiResponse("OK"))
    }
}

