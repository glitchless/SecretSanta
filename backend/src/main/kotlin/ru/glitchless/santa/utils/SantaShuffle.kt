package ru.glitchless.santa.utils

import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update
import ru.glitchless.santa.model.db.UserDao
import ru.glitchless.santa.utils.tg.LogSantaBot
import java.util.concurrent.atomic.AtomicBoolean

object SantaShuffle : Thread() {
    private val started = AtomicBoolean(false)
    private val forceReshuffle = Config.get(ConfigKey.SANTA_FORCE_RESHUFFLE).toBoolean()

    fun startIfNot() {
        if (!started.getAndSet(true)) {
            println("Start shuffle")
            start()
        }
    }

    override fun run() {
        super.run()
        try {
            var isFill = false
            transaction {
                isFill = UserDao.select { UserDao.pairUser.isNotNull() }.count() > 0
            }
            if (isFill && !forceReshuffle) {
                return
            }
            shuffle()
        } catch (ex: Exception) {
            ex.printStackTrace()
        }
    }

    private fun shuffle() {
        LogSantaBot.logShuffle()
        var userIds: List<Int>? = null
        transaction {
            userIds = UserDao.select { UserDao.isActive eq true }.map { it[UserDao.id].value }
        }
        if (userIds.isNullOrEmpty()) {
            throw RuntimeException("Not found shuffle item")
        }
        if (userIds!!.size <= 2) {
            throw RuntimeException("Not allowed one active user")
        }

        val pairs = shuffleIds(userIds!!)

        println(pairs)
        transaction {
            pairs.forEach { pair ->
                println("Pair ${pair.first} ${pair.second}")
                UserDao.update({ UserDao.id eq pair.first }) {
                    it[pairUser] = pair.second
                }
            }
        }
    }

    private fun shuffleIds(userIds: List<Int>): List<Pair<Int, Int>> {
        val pairUser = ArrayList(userIds)

        while (!isDiffUnique(userIds, pairUser)) {
            println("Try shuffle")
            pairUser.shuffle()
        }

        val userPairs = ArrayList<Pair<Int, Int>>()
        userIds.forEachIndexed { index, item ->
            userPairs.add(Pair(item, pairUser[index]))
        }
        return userPairs
    }

    private fun isDiffUnique(listOne: List<Int>, listTwo: List<Int>): Boolean {
        assert(listOne.size == listTwo.size)
        val existPairs = HashSet<Pair<Int, Int>>()
        listOne.forEachIndexed { index, item ->
            existPairs.add(item to listTwo[index])
            if (listTwo[index] == item) {
                return false
            }
        }
        listOne.forEachIndexed { index, item ->
            if (existPairs.contains(listTwo[index] to item)) {
                return false
            }
        }
        return true
    }

}
