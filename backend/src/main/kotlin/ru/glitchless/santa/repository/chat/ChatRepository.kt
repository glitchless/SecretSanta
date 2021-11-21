package ru.glitchless.santa.repository.chat

import kotlinx.coroutines.TimeoutCancellationException
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.SqlExpressionBuilder.greater
import org.jetbrains.exposed.sql.SqlExpressionBuilder.less
import org.jetbrains.exposed.sql.transactions.transaction
import ru.glitchless.santa.model.api.HttpError
import ru.glitchless.santa.model.api.chat.*
import ru.glitchless.santa.model.db.User
import ru.glitchless.santa.model.db.UserDao
import ru.glitchless.santa.model.db.chat.Message
import ru.glitchless.santa.model.db.chat.MessageDao
import ru.glitchless.santa.model.exception.throwables.HttpSupportException
import ru.glitchless.santa.repository.email.EmailRepository
import ru.glitchless.santa.utils.suspendCoroutineWithTimeout
import java.util.concurrent.TimeUnit
import kotlin.coroutines.resume

typealias IMessageListener = (MessageApi) -> Unit

object ChatRepository {
    private val messageListener = hashMapOf<Pair<Int, CompanionType>, IMessageListener>()

    fun getChat(
        id: Int, with: CompanionType,
        limit: Int = 50,
        offsetId: Int = Int.MAX_VALUE,
        offsetLessThan: Boolean = true
    ) = transaction {
        val receiver = getPairUser(id, with)
        return@transaction getChatBetweenUser(id, receiver, limit, offsetId, offsetLessThan)
    }

    fun sendMessage(id: Int, to: CompanionType, text: String?) = transaction {
        val pairUser = getPairUser(id, to)
        if (text.isNullOrEmpty()) {
            throw HttpSupportException(HttpError.NOT_ALLOW_EMPTY_PARAM)
        }
        val messageId = MessageDao.insertAndGetId {
            it[MessageDao.text] = text
            it[MessageDao.from] = id
            it[MessageDao.to] = pairUser
        }
        EmailRepository.notifyAboutNewMessage(to.reverse(), text, pairUser)
        val listener = messageListener[pairUser to to.reverse()]
            ?: return@transaction
        val msg = Message[messageId]
        listener.invoke(
            MessageApi(
                text = msg.text,
                id = msg.id.value,
                timestamp = msg.timestamp.millis,
                from = MessageFromType.COMPANION
            )
        )
    }

    /**
     * @param timeout in seconds
     */
    suspend fun waitMessage(id: Int, with: CompanionType, timeout: Long): MessageApi {
        return try {
            suspendCoroutineWithTimeout<MessageApi>(timeout, TimeUnit.SECONDS) { cont ->
                messageListener[id to with] = { messageApi ->
                    cont.resume(messageApi)
                }
            }
        } catch (e: TimeoutCancellationException) {
            throw HttpSupportException(HttpError.POLLING_TIMEOUT)
        } finally {
            messageListener.remove(id to with)
        }
    }

    private fun Transaction.getChatBetweenUser(
        currentUser: Int,
        companionUser: Int,
        limit: Int,
        offsetId: Int,
        offsetLessThan: Boolean = true
    ): ChatApi {
        val selectExpression = ((MessageDao.from eq currentUser) and (MessageDao.to eq companionUser)) or
                ((MessageDao.from eq companionUser) and (MessageDao.to eq currentUser))
        val messageTotalCount = MessageDao.select { selectExpression }.count()
        var offsetExpression: Op<Boolean> = (MessageDao.id less offsetId)
        if (!offsetLessThan) {
            offsetExpression = (MessageDao.id greater offsetId)
        }
        val messages = MessageDao.select {
            selectExpression and offsetExpression
        }.orderBy(MessageDao.timestamp, SortOrder.DESC).limit(limit).map {
            MessageApi(
                text = it[MessageDao.text],
                id = it[MessageDao.id].value,
                timestamp = it[MessageDao.timestamp].millis,
                from = when (it[MessageDao.from].value) {
                    currentUser -> MessageFromType.CURRENT
                    companionUser -> MessageFromType.COMPANION
                    else -> error("WTF??")
                }
            )
        }

        return ChatApi(
            count = messages.size.toLong(),
            countTotal = messageTotalCount,
            messages = messages
        )
    }

    private fun Transaction.getPairUser(id: Int, companionType: CompanionType): Int {
        return when (companionType) {
            CompanionType.RECEIVER -> User[id].pairUser ?: throw HttpSupportException(HttpError.NOT_FOUND_RECEIVER)
            CompanionType.SENDER -> UserDao.select { UserDao.pairUser eq id }
                .map { it[UserDao.id].value }
                .firstOrNull() ?: throw HttpSupportException(HttpError.NOT_FOUND_SENDER)
        }
    }
}
