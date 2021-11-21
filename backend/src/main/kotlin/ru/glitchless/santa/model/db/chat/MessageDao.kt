package ru.glitchless.santa.model.db.chat

import org.jetbrains.exposed.dao.LongEntity
import org.jetbrains.exposed.dao.LongEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.LongIdTable
import org.jetbrains.exposed.sql.jodatime.datetime
import org.joda.time.DateTime
import ru.glitchless.santa.model.db.UserDao

object MessageDao : LongIdTable("messages") {
    val text = text("text")
    val from = reference("from", UserDao)
    val to = reference("to", UserDao)
    val timestamp = datetime("timestamp").clientDefault { DateTime.now() }

    init {
        index(isUnique = false, to, from)
        index(isUnique = false, from, to)
    }
}

class Message(id: EntityID<Long>) : LongEntity(id) {
    companion object : LongEntityClass<Message>(MessageDao)

    var text by MessageDao.text
    var from by MessageDao.from
    var to by MessageDao.to
    var timestamp by MessageDao.timestamp
}
