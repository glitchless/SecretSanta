package ru.glitchless.santa.utils

import ru.glitchless.santa.model.exception.throwables.ExpiredException
import java.text.ParseException
import java.text.SimpleDateFormat
import java.util.*

object SantaDateHelper {
    private val shuffleDate = Config.get(ConfigKey.SANTA_SHUFFLEDATE).toDate()

    fun isExpired(): Boolean {
        val expired = shuffleDate.before(Date())
        if (expired) {
            SantaShuffle.startIfNot()
        }
        return expired
    }

    fun checkExpired() {
        if (isExpired()) {
            throw ExpiredException()
        }
    }

    fun getUnixTime(): Long {
        return shuffleDate.time
    }
}

public object SantaTimer : Thread() {
    override fun run() {
        super.run()
        while (!SantaDateHelper.isExpired()) {
            try {
                val time = SantaDateHelper.getUnixTime()
                sleep(time)
            } catch (e: InterruptedException) {
                e.printStackTrace()
            }
        }
    }
}

@Throws(ParseException::class)
fun String.toDate(): Date {
//NOTE: SimpleDateFormat uses GMT[-+]hh:mm for the TZ which breaks
//things a bit.  Before we go on we have to repair this.
    var input = this
    val df = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssz")
    //this is zero time so we need to add that TZ indicator for
    input = if (input.endsWith("Z")) {
        input.substring(0, input.length - 1) + "GMT-00:00"
    } else {
        val inset = 6
        val s0 = input.substring(0, input.length - inset)
        val s1 = input.substring(input.length - inset, input.length)
        s0 + "GMT" + s1
    }
    return df.parse(input)
}
