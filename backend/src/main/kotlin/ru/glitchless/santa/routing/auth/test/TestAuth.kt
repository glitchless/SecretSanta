package ru.glitchless.santa.routing.auth.test

import io.ktor.application.*
import io.ktor.routing.*
import ru.glitchless.santa.model.api.ApiResponse
import ru.glitchless.santa.model.exception.throwables.AuthException
import ru.glitchless.santa.repository.auth.test.TestAuthRepository
import ru.glitchless.santa.routing.auth.IAuthType
import ru.glitchless.santa.routing.toFullApiObject
import ru.glitchless.santa.utils.Config
import ru.glitchless.santa.utils.ConfigKey
import ru.glitchless.santa.utils.createSession
import ru.glitchless.santa.utils.respondWithCode

class TestAuth : IAuthType {
    override fun getKey() = "test"

    override fun initRoutes(route: Route) = route.invoke {
        get {
            if (!Config.get(ConfigKey.ENVIRONMENT_DEBUG).toBoolean()) {
                throw AuthException()
            }

            val pairUserId = call.request.queryParameters["pair_user"]?.toInt()
            val isActive = call.request.queryParameters["is_active"]?.toBoolean() ?: false
            var id = call.request.queryParameters["id"]?.toInt()
            if (id != null) {
                call.createSession().userId = id
                return@get
            }

            val user = TestAuthRepository.registerTestUser(pairUserId, isActive)

            call.createSession().userId = user.id.value

            call.respondWithCode(ApiResponse(user.toFullApiObject()))
        }
    }
}
