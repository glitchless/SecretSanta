package ru.glitchless.santa.repository

import org.junit.Rule
import org.junit.Test
import ru.glitchless.santa.rule.UseDatabaseRule

class DBTest {
    @get:Rule
    var rule = UseDatabaseRule()

    @Test
    fun testSimple() {
        println("yay")
    }
}
