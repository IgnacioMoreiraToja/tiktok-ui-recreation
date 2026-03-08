package org.example.utils

import model.Comment

class CommentsDTO(comment: Comment){
    val id      = comment.id
    val user    = SimpleUserDTO(comment.user)
    val post    = SimplePostDTO(comment.post)
    val text    = comment.text
}