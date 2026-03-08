package org.example.controllers
import com.auth0.jwt.*
import com.auth0.jwt.algorithms.Algorithm
import exceptions.UserException
import io.javalin.http.*
import javalinjwt.JWTGenerator
import javalinjwt.JWTProvider
import org.example.utils.Roles
import model.User
import org.example.utils.UserGenerator
import service.TiktokSystem

val HEADER = "Authorization"

class TokenController(val tiktok: TiktokSystem) {

    private val algorithm = Algorithm.HMAC256("very_secret")
    private val verifier = JWT.require(algorithm).build()
    private val generator = UserGenerator()
    private val provider = JWTProvider(algorithm, generator, verifier)


    fun addToken(ctx: Context, user: User) {
        val token = provider.generateToken(user)
        ctx.header(HEADER, token)
    }

    private fun tokenToUser(header: String): User {
        val validateToken = provider.validateToken(header)
        if (validateToken.isPresent) {
            val userId = validateToken.get().getClaim("id").asString()
            try {
                return tiktok.getUser(userId)
            } catch (error: UserException) {
                throw UnauthorizedResponse("The user doesn't exist.")
            }
        }
        throw UnauthorizedResponse("Token not valid")
    }

    fun validate(ctx: Context) {
        val header = ctx.header(HEADER)
        when {
            ctx.routeRoles().contains(Roles.PUBLIC) -> return
            header == null -> {
                throw UnauthorizedResponse("Invalid token")
            }
            else -> {
                val user = tokenToUser(header)
                ctx.attribute("user", user)
                return
            }
        }
    }
}