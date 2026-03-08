package org.example.utils



class RegisterBody(val username: String, val email: String, var password: String, var image: String)

class LoginBody(val username: String, val password: String)

class EditUserBody(val email: String, var password: String, var image: String)

class PostBody(var title: String, var description: String, var video: String )

class CommentBody(var text: String)