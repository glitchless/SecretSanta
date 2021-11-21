package ru.glitchless.santa.routing.chat

import com.google.gson.GsonBuilder
import io.ktor.application.*
import io.ktor.routing.*
import ru.glitchless.santa.model.api.ApiResponse
import ru.glitchless.santa.model.api.HttpError
import ru.glitchless.santa.model.api.chat.CompanionType
import ru.glitchless.santa.model.api.chat.MessageSendObject
import ru.glitchless.santa.model.exception.throwables.HttpSupportException
import ru.glitchless.santa.model.exception.throwables.receiveOrThrow
import ru.glitchless.santa.repository.chat.ChatRepository
import ru.glitchless.santa.utils.getSession
import ru.glitchless.santa.utils.respondWithCode
import java.lang.Integer.min

val gson = GsonBuilder().create()

fun Route.initRouteChat() {
    get {
        val with = call.request.queryParameters["with"] ?: throw HttpSupportException(HttpError.NOT_ALLOW_EMPTY_PARAM)
        val limit = call.request.queryParameters["limit"]?.toInt() ?: 50
        val offset_id = call.request.queryParameters["offset_id"]?.toInt() ?: Int.MAX_VALUE
        val type = gson.fromJson(with, CompanionType::class.java)

        val real_limit = min(limit, 50)

        val userId = call.getSession().userId

        val chat = ChatRepository.getChat(userId, type, real_limit, offset_id)
        call.respondWithCode(ApiResponse(chat))
    }
    post {
        val messageSendObject = call.receiveOrThrow<MessageSendObject>()

        val userId = call.getSession().userId

        ChatRepository.sendMessage(userId, messageSendObject.to, messageSendObject.text)

        call.respondWithCode(ApiResponse(null))
    }
    get("wait_new") {
        val with = call.request.queryParameters["with"] ?: throw HttpSupportException(HttpError.NOT_ALLOW_EMPTY_PARAM)
        val last_id = call.request.queryParameters["last_id"]?.toInt() ?: Int.MAX_VALUE
        val timeout = call.request.queryParameters["timeout"]?.toLong() ?: 120
        val type = gson.fromJson(with, CompanionType::class.java)

        val userId = call.getSession().userId

        val chat = ChatRepository.getChat(userId, type, 50, last_id, false)

        if (chat.count != 0L) {
            call.respondWithCode(ApiResponse(chat))
            return@get
        }

        val message = ChatRepository.waitMessage(userId, type, timeout)
        chat.countTotal++
        chat.count = 1
        chat.messages = listOf(message)
        call.respondWithCode(ApiResponse(chat))
    }
}
