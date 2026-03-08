package org.example.utils

import model.Post

class PostDTO(post: Post){
    val id              = post.id
    val user            = SimpleUserDTO(post.user)
    val title           = post.title
    val description     = post.description
    val video           = post.video
    val comments        = post.comments.map { CommentsDTO(it) }
    val likes           = post.likes.map { SimpleUserDTO(it) }
}

class SimplePostDTO(post: Post){
    val id              = post.id
    val user            = SimpleUserDTO(post.user)
    val title           = post.title
    val description     = post.description
    val video           = post.video
    val likes           = post.likes.map { SimpleUserDTO(it) }
    val commentsAmount  = post.comments.size
}