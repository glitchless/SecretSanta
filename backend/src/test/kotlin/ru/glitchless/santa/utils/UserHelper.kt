package ru.glitchless.santa.utils

import org.jetbrains.exposed.sql.Transaction
import ru.glitchless.santa.model.db.User
import kotlin.random.Random

fun Transaction.createTestUser(block: User.() -> Unit = {}): User {
    val testString = "Тест${Random.Default.nextInt()}"
    return User.new {
        fullName = "Тест Тестович $testString"
        deliveryName = "Доставка Доставочник $testString"
        block.invoke(this)
    }
}
