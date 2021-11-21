package ru.glitchless.santa.routing

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.routing.*
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update
import ru.glitchless.santa.model.api.*
import ru.glitchless.santa.model.api.auth.UserApi
import ru.glitchless.santa.model.db.User
import ru.glitchless.santa.model.db.UserDao
import ru.glitchless.santa.model.exception.throwables.AuthException
import ru.glitchless.santa.model.exception.throwables.DeliveryInformationValidateParamsException
import ru.glitchless.santa.model.exception.throwables.HttpSupportException
import ru.glitchless.santa.model.exception.throwables.receiveOrThrow
import ru.glitchless.santa.utils.*
import ru.glitchless.santa.utils.tg.LogSantaBot

fun Route.initRouteProfile() {
    get {
        val session = call.getSession()

        call.respondWithCode(ApiResponse(getProfile(session.userId)))
    }
    post {
        val changeUser = call.receiveOrThrow<ChangeUserApi>()
        val profile = changeProfile(call.getSession().userId, changeUser)
        call.respondWithCode(ApiResponse(profile))
    }
    get("drop") {
        if (!Config.get(ConfigKey.ENVIRONMENT_DEBUG).toBoolean()) {
            throw AuthException()
        }
        transaction {
            UserDao.update({ UserDao.id eq call.getSession().userId }) {
                it[isActive] = false
                it[isSent] = false
                it[isReceived] = false
            }
        }
        call.respondWithCode(ApiResponse(getProfile(call.getSession().userId)))
    }
}

fun getProfile(id: Int): UserApi {
    var user: User? = null
    transaction {
        user = User.findById(id) ?: throw AuthException()
    }
    return user!!.toFullApiObject()
}

fun User.toApi(): UserApi {
    return UserApi(
        id.value,
        fullName,
        email ?: "example@glitchless.ru",
        isActive,
        isSent,
        isReceived,
        DeliveryInformation(
            deliveryName,
            deliveryComment,
            deliveryAddress,
            deliveryIndex
        ),
        photoUrl,
        profileUrl
    )
}

fun User.toFullApiObject(): UserApi {
    var userApi: UserApi? = null
    val user = this
    transaction {
        val pairUserSent = UserDao.select { UserDao.pairUser eq user.id.value }
            .map { it[UserDao.isSent] }.firstOrNull() ?: false
        var pairUserObject: UserApi? = null
        if (user.pairUser != null) {
            val pairUser = User.findById(user.pairUser!!)
            if (pairUser != null) {
                pairUserObject = pairUser.toApi()
                pairUserObject.email = ""
            }
        }

        userApi = toApi()
        userApi!!.pairUser = pairUserObject
        userApi!!.pairUserSent = pairUserSent
    }
    return userApi!!
}

//TODO сделать validator
fun changeProfile(id: Int, changeUser: ChangeUserApi): UserApi {
    changeUser.deliveryInformation?.let { updateDeliveryInfo(id, it) }

    val profile = getProfile(id)

    transaction {
        if (changeUser.isActive != null) {
            SantaDateHelper.checkExpired()
            if (changeUser.isActive!!) {
                LogSantaBot.logActive(
                    profile.fullName,
                    profile.profileUrl,
                    profile.deliveryInformation.comment,
                    profile.deliveryInformation.name,
                    profile.deliveryInformation.address,
                    profile.deliveryInformation.index
                )
            } else {
                LogSantaBot.logInactive(
                    profile.fullName,
                    profile.profileUrl
                )
            }
            profile.isActive = changeUser.isActive!!
            UserDao.update({ UserDao.id eq id }) {
                it[isActive] = changeUser.isActive!!
            }
        }

        if (changeUser.isReceived != null) {
            if (profile.isReceived) {
                throw HttpSupportException(
                    ErrorResponse(
                        HttpError.BADPARAMS,
                        "Вы не можете отказаться от факта получения посылки. Напишите в поддержку если что-то не так"
                    ),
                    HttpStatusCode.BadRequest
                )
            }
            val from = UserDao.select { UserDao.pairUser eq id }.map {
                it[UserDao.fullName]
            }.firstOrNull()
            LogSantaBot.logReceive(from, profile.fullName)
            profile.isReceived = changeUser.isReceived!!
            UserDao.update({ UserDao.id eq id }) {
                it[isReceived] = changeUser.isReceived!!
            }
        }

        if (changeUser.isSent != null) {
            if (profile.isSent) {
                throw HttpSupportException(
                    ErrorResponse(
                        HttpError.BADPARAMS,
                        "Вы не можете отказаться от факта отправки посылки. Напишите в поддержку если что-то не так"
                    ),
                    HttpStatusCode.BadRequest
                )
            }
            LogSantaBot.logSent(profile.fullName, profile.pairUser?.fullName)
            profile.isSent = changeUser.isSent!!
            UserDao.update({ UserDao.id eq id }) {
                it[isSent] = changeUser.isSent!!
            }
        }
        /*
        if (changeUser.email != null) {
            SantaDateHelper.checkExpired()
            val email = changeUser.email!!.trim()

            if (!email.contains("@")) {
                throw ValidateParamsException(mapOf("email" to "Это не выглядит как email"))
            }

            UserDao.update({ UserDao.id eq id }) {
                it[UserDao.email] = email
            }
        }*/
    }
    return profile
}

fun updateDeliveryInfo(id: Int, deliveryInformation: DeliveryInformation) {
    SantaDateHelper.checkExpired()

    val maxCommentLen = Config.get(ConfigKey.SANTA_DELIVERY_COMMENT_MAX_LENGTH).toInt()
    val maxNameLen = Config.get(ConfigKey.SANTA_DELIVERY_NAME_MAX_LENGTH).toInt()
    val maxAddressLen = Config.get(ConfigKey.SANTA_DELIVERY_ADDRESS_MAX_LENGTH).toInt()
    val maxIndexLen = Config.get(ConfigKey.SANTA_DELIVERY_INDEX_MAX_LENGTH).toInt()

    val errorMap = HashMap<String, String>()
    val address = deliveryInformation.address.trim()
    val comment = deliveryInformation.comment.trim()
    val name = deliveryInformation.name.trim()
    val index = deliveryInformation.index.trim()

    if (comment.length > maxCommentLen) {
        errorMap["comment"] = "Поле комментарии не должно быть больше ${maxCommentLen}-и символов"
    }

    if (name.length > maxNameLen) {
        errorMap["name"] = "Поле с именем не должно быть больше ${maxNameLen}-и символов"
    } else if (!name.matches("^[а-яёА-Яa-zA-Z,\\s]+\$".toRegex())) {
        errorMap["name"] = "Это не похоже на имя"
    }

    if (address.length > maxAddressLen) {
        errorMap["address"] = "Поле с адресом не должно быть больше ${maxAddressLen}-и символов"
    }

    if (index.length > maxIndexLen) {
        errorMap["index"] = "Поле с индексом не должно быть больше ${maxIndexLen}-и символов"
    } else if (!index.matches("^[а-яёА-Яa-zA-Z0-9-\\s]+\$".toRegex())) {
        errorMap["index"] =
            "Это не похоже на индекс. Если вы считаете иначе, напишите, пожалуйста, на support@glitchless.ru"
    }

    if (errorMap.isNotEmpty()) {
        throw DeliveryInformationValidateParamsException(mapOf("delivery_information" to errorMap))
    }

    transaction {
        UserDao.update({ UserDao.id eq id }) {
            it[deliveryAddress] = address
            it[deliveryComment] = comment
            it[deliveryIndex] = index
            it[deliveryName] = name
        }
    }
}
