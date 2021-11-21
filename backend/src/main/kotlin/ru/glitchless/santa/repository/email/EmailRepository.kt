package ru.glitchless.santa.repository.email

import net.sargue.mailgun.Configuration
import net.sargue.mailgun.Mail
import org.jetbrains.exposed.sql.transactions.transaction
import org.slf4j.LoggerFactory
import ru.glitchless.santa.model.api.chat.CompanionType
import ru.glitchless.santa.model.db.User
import ru.glitchless.santa.utils.Config
import ru.glitchless.santa.utils.ConfigKey
import ru.glitchless.santa.utils.tg.LogSantaBot
import java.io.InputStreamReader

private val SEND_MESSAGE_TEMPLATE by lazy {
    EmailRepository::class.java.getResourceAsStream("/send_message_template.html").use {
        InputStreamReader(it).readText()
    }
}

object EmailRepository {
    private val logger = LoggerFactory.getLogger("EmailRepository")

    private val configuration = Configuration()
        .domain(Config.get(ConfigKey.MAIL_DOMAIN))
        .apiKey(Config.get(ConfigKey.MAIL_KEY))
        .from(Config.get(ConfigKey.MAIL_FROM_NAME), Config.get(ConfigKey.MAIL_FROM))

    private fun notifyAboutNewMessage(from: CompanionType, text: String, to: String) {
        logger.info("Send message to $to")
        val serverUrl = Config.get(ConfigKey.SERVER_URL)
        val toText = if (from == CompanionType.SENDER) {
            "санты"
        } else "получателя"
        val mailText = """
            Привет! У тебя новое сообщение от твоего $toText:
            
            $text
            
            Ответить и посмотреть подробнее можно на сайте: https://$serverUrl/. Хорошего времени суток :3
        """.trimIndent()
        val html = SEND_MESSAGE_TEMPLATE
            .replaceFirst("{%to_name%}", toText)
            .replaceFirst("{%message_text%}", text)
            .replaceFirst("{%server_url%}", serverUrl)

        val response = Mail.using(configuration)
            .to(to)
            .subject("Новое сообщение в Тайном Санте")
            .text(mailText)
            .html(html)
            .build().send()

        if (response.responseCode() != 200) {
            logger.error("Failed send email to $to")
            LogSantaBot.logInternalError(
                RuntimeException("Ошибка отправки уведомления о новом письме по адресу $to")
            )
            return
        }
        logger.info("Message to $to send sucs: ${response.responseType()}")
        LogSantaBot.logSentMessage(to)
    }

    fun notifyAboutNewMessage(from: CompanionType, text: String, to: Int) {
        val userEmail = transaction { User[to].email }
        if (userEmail == null) {
            logger.info("User $to hasn't email yet")
            return
        }
        notifyAboutNewMessage(from, text, userEmail)
    }
}
