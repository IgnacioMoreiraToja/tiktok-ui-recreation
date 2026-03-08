package org.example.utils

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTCreator
import com.auth0.jwt.algorithms.Algorithm
import javalinjwt.JWTGenerator
import model.User

class UserGenerator : JWTGenerator<User> {
    override fun generate(user: User, alg: Algorithm?): String {
        val token: JWTCreator.Builder = JWT.create()
            .withClaim("id", user.id)
        return token.sign(alg)
    }
}