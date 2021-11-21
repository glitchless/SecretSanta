package ru.glitchless.santa.repository

import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.mockk.*
import kotlinx.coroutines.runBlocking
import org.junit.*
import ru.glitchless.santa.model.api.auth.tp.OAuthToken
import ru.glitchless.santa.repository.auth.tp.OAuthTpRepository
import ru.glitchless.santa.repository.auth.tp.TPAuthSource
import ru.glitchless.santa.rule.UseDatabaseRule
import ru.glitchless.santa.utils.Config
import ru.glitchless.santa.utils.ConfigKey

@Ignore
class OAuthRepositoryTest {
    @get:Rule
    var rule = UseDatabaseRule()

    private lateinit var underTest: OAuthTpRepository
    private lateinit var clientMock: HttpClient
    private lateinit var httpRequestBuilder: HttpRequestBuilder

    companion object {
        const val base64Auth = "em5QR2pEbmFXT2dYQ200dXloWVVqbVRxb0JwRlE4WnJtWTRiZXYxVTpTRUNSRVQ="

        @BeforeClass
        @JvmStatic
        fun prepareConfig() {
            Config.set(ConfigKey.AUTH_TP_CLIENT_ID, "testclientid")
            Config.set(ConfigKey.AUTH_TP_CLIENT_SECRET, "testsecret")
        }
    }

    @Before
    @Ignore
    fun setUp() {
        mockkStatic("io.ktor.client.request.buildersKt")
        httpRequestBuilder = mockk()
        clientMock = mockk()
        underTest = OAuthTpRepository(clientMock)

        coEvery {
            clientMock.post<OAuthToken>(any<Url>(), any())
        } answers {
            val lambda = this.args[1] as (HttpRequestBuilder.() -> Unit)
            lambda.invoke(httpRequestBuilder)
            OAuthToken(
                "testToken",
                "testTokenType",
                10,
                "testRefreshToken",
                "testScope"
            )
        }
    }

    @Test
    fun `test base auth from tp`() = runBlocking {
        val testUrl = "testurl/token/?code=someCode&grant_type=authorization_code&redirect_uri=testredirect"

        underTest.oAuthTp(TPAuthSource.TECHNOPARK, "someCode", mockk(), mockk())

        coVerify { clientMock.post<OAuthToken>(testUrl, block = any()) }
        verify { httpRequestBuilder.header("Authorization", "Basic $base64Auth") }
        return@runBlocking
    }

    @After
    fun clean() {
        unmockkAll()
    }
}
