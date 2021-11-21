package ru.glitchless.santa.utils

enum class ConfigKey(val defaultValue: String) {
    USER_DEFAULT_ADDRESS("Великий Устюг, улица Хороших IT-шников, дом с красной крышей"),
    USER_DEFAULT_COMMENT("Мне очень нравятся гаджеты и сладости"),
    SERVER_PORT("8000"),
    SERVER_URL("santa.vas3k.club"),
    SERVER_SESSION_FOLDER("/app/.sessions"),
    SERVER_SENTRY_DSN("https://991d97dc250e43a0a3eac6740a98da72@sentry.team.glitchless.ru/19"),
    SERVER_DATABASE_HOST("postgresdb:5432"),
    SERVER_DATABASE_DB("postgres"),
    SERVER_DATABASE_USER("postgres"),
    SERVER_DATABASE_PASSWORD("123456"),
    SERVER_DATABASE_POOLSIZE("10"),
    SANTA_SHUFFLEDATE("2099-12-01T00:00:00+03:00"),
    SANTA_STARTDATE("2099-11-01T00:00:00+03:00"),
    SANTA_ENDDATE("2099-01-30T00:00:00+03:00"),
    SANTA_FORCE_RESHUFFLE("false"),
    SANTA_UNKNOWN_NAME("Неопознанный эльф"),
    ENVIRONMENT_DEBUG("false"),
    AUTH_TP_CLIENT_ID("znPGjDnaWOgXCm4uyhYUjmTqoBpFQ8ZrmY4bev1U"),
    AUTH_TP_CLIENT_SECRET("SECRET"),
    SANTA_DELIVERY_NAME_MAX_LENGTH("25"),
    SANTA_DELIVERY_COMMENT_MAX_LENGTH("256"),
    SANTA_DELIVERY_ADDRESS_MAX_LENGTH("256"),
    SANTA_DELIVERY_INDEX_MAX_LENGTH("16"),
    TG_USERNAME("ktsstudio_bot"),
    TG_TOKEN("SECRET"),
    TG_CHATID("-1001497073450"),
    TG_PREFIX("[UNNAMED]"),
    AUTH_TYPE("TECHNO_PORTAL"),
    AUTH_VAS3K_PUBLIC_KEY(DEFAULT_AUTH_VAS3K_PUBLIC_KEY),
    MAIL_DOMAIN("santa.glitchless.ru"),
    MAIL_FROM("noreply@santa.glitchless.ru"),
    MAIL_FROM_NAME("Тайный Санта"),
    MAIL_KEY("SECRET")
}

object Config {
    private val configMap = HashMap<ConfigKey, String>()

    fun get(key: ConfigKey): String {
        return configMap[key] ?: System.getenv(key.name) ?: key.defaultValue
    }

    fun set(key: ConfigKey, value: String) {
        configMap[key] = value
    }
}

private const val DEFAULT_AUTH_VAS3K_PUBLIC_KEY = """
-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAvEDEGKL0b+okI6QBBMiu
3GOHOG/Ml4KJ13tWyPnl5yGswf9rUGOLo0T0dXxSwxp/6g1ZeYqDR7jckuP6A3Rv
DPdKYc44eG3YB/bO2Yeq57Kx1rxvFvWZap2jTyu2wbALmmeg0ne3wkXPExTy/EQ4
LDft8nraSJuW7c+qrah+F94qKGVNvilf20V5S186iGpft2j/UAl9s81kzZKBwk7M
B+u4jSH8E3KHZVb28CVNOpnYYcLBNLsjGwZk6qbiuq1PEq4AZ5TN3EdoVP9nbIGY
BZAMwoNxP4YQN+mDRa6BU2Mhy+c9ea+fuCKRxNi3+nYjF00D28fErFFcA+BEe4A1
Hhq25PsVfUgOYvpv1F/ImPJBl8q728DEzDcj1QzL0flbPUMBV6Bsq+l2X3OdrVtQ
GXiwJfJRWIVRVDuJzdH+Te2bvuxk2d0Sq/H3uzXYd/IQU5Jw0ZZRTKs+Rzdpb8ui
eoDmq2uz6Q2WH2gPwyuVlRfatJOHCUDjd6dE93lA0ibyJmzxo/G35ns8sZoZaJrW
rVdFROm3nmAIATC/ui9Ex+tfuOkScYJ5OV1H1qXBckzRVwfOHF0IiJQP4EblLlvv
6CEL2VBz0D2+gE4K4sez6YSn3yTg9TkWGhXWCJ7vomfwIfHIdZsItqay156jMPaV
c+Ha7cw3U+n6KI4idHLiwa0CAwEAAQ==
-----END PUBLIC KEY-----
"""
