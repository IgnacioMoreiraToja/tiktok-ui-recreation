package org.example.utils

import io.javalin.http.Context
import model.User

class UserDTO(user: User){
    val id        = user.id
    val username  = user.username
    val email     = user.email
    val image     = user.image
    val posts     = user.posts.map { SimplePostDTO(it) }
    val following = user.following.map { SimpleUserDTO(it) }
    val followers = user.followers.map { SimpleUserDTO(it) }
}

class SimpleUserDTO(user: User){
    val id        = user.id
    val username  = user.username
    val image     = user.image
}