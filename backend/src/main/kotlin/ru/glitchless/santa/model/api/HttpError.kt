package ru.glitchless.santa.model.api;

enum class HttpError(val id: String, val reason: String = "") {
    UNKNOWN("unknown"),
    EMPTY("empty"),
    INTERNAL("internal"),
    NOTFOUND("notfound", "Нету такого пути :("),
    NOT_FOUND_EVENT("notfoundevent", "Нет такого события под таким id"),
    BADPARAMS("badparams", "Этот метод надо использовать не так и передавать надо другие данные"),
    BADFORM("badform", "Этот метод надо использовать не так и передавать надо другие данные"),
    AUTHERROR("autherror", "Пользователь не авторизован. Пройдите регистрацию, пожалуйста"),
    NOT_FOUND_RECEIVER("not_found_receiver", "Еще не прошла жеребьевка или система не назначила вам получателя"),
    NOT_FOUND_SENDER("not_found_sender", "Вас еще никто не выбрал в качестве получателя"),
    NOT_ALLOW_EMPTY_PARAM("empty_param", "Пустой параметр не разрешен в данном методе"),
    POLLING_TIMEOUT("polling_timeout", "Истекло время ожидания"),
    USER_ALREADY_EXIST("user_exist", "Пользователь уже существует"),
    PASSWORD_NOT_EQUALS("password_not_equals", "Пароли не совпадают"),
    PASSWORD_NOT_CORRECT("password_not_correct", "Неправильный пароль"),
    USER_NOT_VERIFIED("user_not_verified", "Пожалуйста подтвердите почту"),
    NOT_FOUND_USER("not_found_user", "Пользователь с таким email не найден"),
    EXPIRED("expired", "Уже прошла жеребьевка. Теперь вы не можете это сделать :(");

    override fun toString() = id
}

data class ErrorResponse(val status: HttpError, val reason: Any = status.reason)
