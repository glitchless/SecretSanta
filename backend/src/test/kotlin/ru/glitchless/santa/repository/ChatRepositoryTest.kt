package ru.glitchless.santa.repository

import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.Assert
import org.junit.Rule
import org.junit.Test
import org.junit.jupiter.api.assertThrows
import ru.glitchless.santa.model.api.HttpError
import ru.glitchless.santa.model.api.chat.CompanionType
import ru.glitchless.santa.model.api.chat.MessageFromType
import ru.glitchless.santa.model.exception.throwables.HttpSupportException
import ru.glitchless.santa.repository.chat.ChatRepository
import ru.glitchless.santa.rule.UseDatabaseRule
import ru.glitchless.santa.utils.createTestUser

class ChatRepositoryTest {
    @get:Rule
    var rule = UseDatabaseRule()

    val underTest = ChatRepository

    @Test
    fun `test message send to receiver`() = transaction<Unit> {
        val text = "Проверка"
        val receiver = createTestUser()
        val testUser = createTestUser {
            pairUser = receiver.id.value
        }

        underTest.sendMessage(testUser.id.value, CompanionType.RECEIVER, text)
        val chat = underTest.getChat(testUser.id.value, CompanionType.RECEIVER)

        Assert.assertEquals(chat.count, 1)
        Assert.assertEquals(chat.countTotal, 1)
        Assert.assertEquals(chat.messages.first().text, text)
        Assert.assertEquals(chat.messages.first().from, MessageFromType.CURRENT)
    }


    @Test
    fun `test message send to sender`() = transaction<Unit> {
        val text = "Проверка"
        val receiver = createTestUser()
        val testUser = createTestUser {
            pairUser = receiver.id.value
        }

        underTest.sendMessage(receiver.id.value, CompanionType.SENDER, text)
        val chat = underTest.getChat(testUser.id.value, CompanionType.RECEIVER)

        Assert.assertEquals(chat.count, 1)
        Assert.assertEquals(chat.countTotal, 1)
        Assert.assertEquals(chat.messages.first().text, text)
        Assert.assertEquals(chat.messages.first().from, MessageFromType.COMPANION)
    }

    @Test
    fun `test exception on empty text`() = transaction<Unit> {
        val text = ""
        val receiver = createTestUser()
        val testUser = createTestUser {
            pairUser = receiver.id.value
        }

        var exception = assertThrows<HttpSupportException> {
            underTest.sendMessage(testUser.id.value, CompanionType.RECEIVER, text)
        }
        Assert.assertEquals(exception.error.status, HttpError.NOT_ALLOW_EMPTY_PARAM)
    }

    @Test
    fun `test exception on null text`() = transaction<Unit> {
        val receiver = createTestUser()
        val testUser = createTestUser {
            pairUser = receiver.id.value
        }

        val exception = assertThrows<HttpSupportException> {
            underTest.sendMessage(testUser.id.value, CompanionType.RECEIVER, null)
        }
        Assert.assertEquals(exception.error.status, HttpError.NOT_ALLOW_EMPTY_PARAM)
    }

    @Test
    fun `test that receiver user not found`() = transaction<Unit> {
        val text = "Проверка"
        val testUser = createTestUser()

        val exception = assertThrows<HttpSupportException> {
            underTest.sendMessage(testUser.id.value, CompanionType.RECEIVER, text)
        }
        Assert.assertEquals(exception.error.status, HttpError.NOT_FOUND_RECEIVER)
    }

    @Test
    fun `test that sender user not found`() = transaction<Unit> {
        val text = "Проверка"
        val testUser = createTestUser()

        val exception = assertThrows<HttpSupportException> {
            underTest.sendMessage(testUser.id.value, CompanionType.SENDER, text)
        }
        Assert.assertEquals(exception.error.status, HttpError.NOT_FOUND_SENDER)
    }
}
