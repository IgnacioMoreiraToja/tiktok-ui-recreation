package org.example.utils

import io.javalin.security.RouteRole

enum class Roles: RouteRole {
    PUBLIC,
    USER
}