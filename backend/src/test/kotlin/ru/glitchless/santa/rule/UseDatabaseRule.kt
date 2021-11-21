package ru.glitchless.santa.rule

import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.rules.TestRule
import org.junit.runner.Description
import org.junit.runners.model.Statement
import org.testcontainers.containers.PostgreSQLContainerProvider
import ru.glitchless.santa.model.db.UserDao
import ru.glitchless.santa.model.db.auth.TpUserInfoDAO
import ru.glitchless.santa.model.db.auth.Vas3kUserInfoDAO
import ru.glitchless.santa.model.db.chat.MessageDao

class UseDatabaseRule(reuse: Boolean = false) : TestRule {
    private val postgresContainer = PostgreSQLContainerProvider()
        .newInstance("13")
        .withUrlParam("characterEncoding", "utf8")
        .withUrlParam("useUnicode", "true")
        .withReuse(reuse)

    override fun apply(base: Statement?, description: Description?) = object : Statement() {
        override fun evaluate() {
            postgresContainer.start()
            connectToDB()
            createDB()

            try {
                base?.evaluate()
            } finally {
                postgresContainer.stop()
            }
        }
    }

    fun connectToDB() {
        val url = postgresContainer.jdbcUrl
        val user = postgresContainer.username
        val password = postgresContainer.password

        Database.connect(url = url, user = user, password = password)
    }

    fun createDB() {
        transaction {
            SchemaUtils.create(UserDao, Vas3kUserInfoDAO, TpUserInfoDAO, MessageDao)
        }
    }
}
