package ru.glitchless.santa.utils

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTVerificationException
import java.security.KeyFactory
import java.security.interfaces.RSAPublicKey
import java.security.spec.X509EncodedKeySpec
import java.util.*


class JWTHelper() {
    private val publicKey: RSAPublicKey by lazy {
        initPublicKey()
    }

    @Throws(JWTVerificationException::class)
    fun decodeAndValidate(jwt: String): String {
        val algorithm = Algorithm.RSA256(publicKey, null)

        val decodedJWT = JWT.decode(jwt)

        val verifier = JWT.require(algorithm).build()
        verifier.verify(decodedJWT)

        val base64Decoded = Base64.getDecoder().decode(decodedJWT.payload)
        return String(base64Decoded)
    }

    private fun initPublicKey(): RSAPublicKey {
        val keyFile = Config.get(ConfigKey.AUTH_VAS3K_PUBLIC_KEY)
        val clearKey = keyFile
            .substringAfter("-----BEGIN PUBLIC KEY-----")
            .substringBefore("-----END PUBLIC KEY-----").trim()
        val bytesKey = Base64.getDecoder().decode(clearKey.replace("\n", ""))
        return KeyFactory.getInstance("RSA").generatePublic(
            X509EncodedKeySpec(bytesKey)
        ) as RSAPublicKey
    }
}
