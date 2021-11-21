package ru.glitchless.santa.routing.auth.simple

import io.ktor.routing.*
import ru.glitchless.santa.routing.auth.IAuthType

object LoginPasswordAuth : IAuthType {
    override fun getKey(): String {
        TODO("Not yet implemented")
    }

    override fun initRoutes(route: Route) {
        TODO("Not yet implemented")
    }
}
