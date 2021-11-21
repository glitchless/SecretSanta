package ru.glitchless.santa.repository.auth.test

import org.jetbrains.exposed.sql.transactions.transaction
import ru.glitchless.santa.model.db.User
import kotlin.random.Random

object TestAuthRepository {
    suspend fun registerTestUser(
        pairUserId: Int?,
        isActive: Boolean
    ): User = transaction {
        User.new {
            fullName = "Тест Тестович ${Random.Default.nextInt(0, 100)}"
            deliveryName = "Доставка Доставочник ${Random.Default.nextInt(0, 100)}"
            pairUser = pairUserId
            this.isActive = isActive
        }
    }
}
