package ru.glitchless.santa.utils.tg

import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.async
import org.telegram.telegrambots.bots.TelegramLongPollingBot
import org.telegram.telegrambots.meta.api.methods.BotApiMethod
import org.telegram.telegrambots.meta.api.methods.send.SendMessage
import org.telegram.telegrambots.meta.api.objects.Update
import ru.glitchless.santa.utils.Config
import ru.glitchless.santa.utils.ConfigKey
import java.io.PrintWriter
import java.io.Serializable
import java.io.StringWriter


object LogSantaBot : TelegramLongPollingBot() {
    private val prefix = Config.get(ConfigKey.TG_PREFIX)
    private val channelId = Config.get(ConfigKey.TG_CHATID)
    override fun getBotToken() = Config.get(ConfigKey.TG_TOKEN)
    override fun getBotUsername() = Config.get(ConfigKey.TG_USERNAME)

    override fun onUpdateReceived(update: Update?) {
        println(update)
    }

    fun logJoin(name: String, link: String?) {
        sendText("Приветствуем [$name]($link) в АДМ")
    }

    fun logFailedJoin(name: String, link: String?) {
        sendText("[$name]($link) захотел зарегистрироваться, но срок уже истек.")
    }

    fun logActive(
        name: String,
        link: String?,
        comment: String,
        deliveryName: String,
        deliveryAddress: String,
        deliveryIndex: String
    ) {
        sendText("[$name]($link)зарегистрировался на участие в Тайном Санте")
    }

    fun logInactive(name: String, link: String?) {
        sendText("[$name]($link) передумал участвовать в АДМ")
    }

    fun logSent(nameFrom: String, nameTo: String?) {
        sendText("*$nameFrom* отправил подарок *$nameTo*")
    }

    fun logSentMessage(to: String) {
        sendText("Сообщение на адрес *$to* успешно отправлено")
    }

    fun logReceive(nameFrom: String?, nameTo: String) {
        sendText("*$nameTo* получил подарок от *$nameFrom*")
    }

    fun logShuffle() {
        sendText("Пермешиваем!")
    }

    fun logInternalError(ex: Throwable) {
        val sw = StringWriter()
        val pw = PrintWriter(sw)
        ex.printStackTrace(pw)
        sendText("Какая-то ошибка:\n```${sw.toString().take(4000)}```")
    }


    private fun sendText(text: String) {
        val msg = SendMessage()
        msg.chatId = channelId
        msg.enableMarkdown(true)
        msg.disableWebPagePreview()
        msg.text = "$prefix $text"
        asyncSend(msg)
    }

    private fun <T : Serializable?, Method : BotApiMethod<T>?> asyncSend(method: Method) {
        GlobalScope.async {
            try {
                sendApiMethod(method)
            } catch (ex: Exception) {
                ex.printStackTrace()
            }
        }
    }
}
