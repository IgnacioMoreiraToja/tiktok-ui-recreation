package org.example.controllers

import drafts.*
import exceptions.*
import service.TiktokSystem
import io.javalin.http.*
import model.User
import org.example.utils.*
import kotlin.reflect.KFunction2
import org.example.utils.LoginBody



class TiktokController(val addToken: KFunction2<Context, User, Unit>, private val tiktok: TiktokSystem) {
    private val stringVerifier = StringVerifier()
    //GET /user
    fun getLoginUser(ctx: Context) {
        val probableUser   = ctx.attribute<User>("user")
        //Chequeamos si no se borro el usuario en el medio por alguna perdida.
        val user = this.chequearSiExiste(probableUser)
        ctx.json(UserDTO(user))

    }

    //GET /user/{id}
    fun getUserById(ctx: Context) {
        //Se pide id por medio de pathParam.
        val idUser = ctx.pathParam("id")
        try {
            // Buscamos el usuario por id. Si no lo encuentra tira UserException.
            val user = tiktok.getUser(idUser)
            ctx.json(UserDTO(user))
        } catch (u : UserException) {
            throw NotFoundResponse("User id was not found.")
        }
    }

    //PUT /user
    fun editUser(ctx: Context) {
        val probableUser   = ctx.attribute<User>("user")
        //Chequeamos si no se borro el usuario en el medio por alguna perdida.
        val user = this.chequearSiExiste(probableUser)
        //Validación de body. No campos vacíos. Email e image válidos. Que modifique alguna variable a las anteriores.
        val body = ctx.bodyValidator(EditUserBody::class.java)
            .check({ it.password.isNotBlank() }, "Password cannot be empty.")
            .check({ it.email.isNotBlank() }, "Mail cannot be empty.")
            .check({ it.image.isNotBlank() }, "Image cannot be empty.")
            .check({ stringVerifier.verificarImage(it.image) }, "Image needs to have a valid URL.")
            .check({stringVerifier.verificarEmail(it.email)}, "Email needs to be a valid mail.")
            .check({
                it.password != user.password || it.image != user.image || it.email != user.email }, "Nothing is modified.")
            .getOrThrow { BadRequestResponse("Not valid body.") }
        //Generar el DraftUser con nuevos datos.
        val editUser = DraftEditUser(body.email, body.password, body.image)

        //Ponemos un try catch por las dudas, pero en realidad no deberìa romper nunca, ya que está validado
        try {
            val userModified = tiktok.editUser(user.id, editUser)
            ctx.json(UserDTO(userModified))
        } catch (u: UserException) {
            throw NotFoundResponse("User id was not found.")
        }
    }
    //PUT /user/{id}/follow
    fun addRemoveFollow(ctx: Context) {
        val probableUser   = ctx.attribute<User>("user")
        //Chequeamos si no se borro el usuario en el medio por alguna perdida.
        val user = this.chequearSiExiste(probableUser)
        val idUser = ctx.pathParam("id")
        // Handleamos posibles excepciones de updateFollow.
        try {
            val userFollowed = tiktok.updateFollow(user.id, idUser)
            ctx.json(UserDTO(userFollowed))
        } catch (u: UserException) {
            throw NotFoundResponse("User id was not found.")
        } catch (f: FollowException) {
            throw BadRequestResponse("You can`t follow yourself.")
        }

    }

    //GET /user/timeline
    fun getTimeLine(ctx: Context) {
        val probableUser   = ctx.attribute<User>("user")
        //Chequeamos si no se borro el usuario en el medio por alguna perdida.
        val user = this.chequearSiExiste(probableUser)
        val lista = tiktok.getTimeline(user.id)
        //Chequeamos si la lista no esta vacia, para devolver algo mas lindo que una pantalla blanca.
        if (lista.isNotEmpty()){
            ctx.json(lista.map {SimplePostDTO(it)})
        } else {
            ctx.result("No posts in the timeline.")
        }
    }


    //POST /register
    fun registerUser(ctx: Context) {
        //Validación de body. No campos vacíos. Email e image válidos.
        val body = ctx.bodyValidator(RegisterBody::class.java)
            .check({ it.username.isNotBlank() }, "Username cannot be empty.")
            .check({ it.password.isNotBlank() }, "Password cannot be empty.")
            .check({ it.email.isNotBlank()    }, "Mail cannot be empty.")
            .check({ it.image.isNotBlank()    }, "Image cannot be empty.")
            .check({ stringVerifier.verificarEmail(it.email)}, "email was empty.")
            .check({ stringVerifier.verificarImage(it.image)}, "image wasn't valid.")
            .getOrThrow { BadRequestResponse("Not valid body.") }
        // Si el email del usuario ya se encuentra, addUser tira un UserException.
        try {
            val newUser = tiktok.addUser(DraftUser(body.username, body.email, body.password, body.image))
            //Muestro el usuario con UserDTO.
            ctx.json(UserDTO(newUser))
            addToken(ctx, newUser)
            ctx.status(201)
        } catch (u : UserException) {
            throw BadRequestResponse("User or email not valid.")
        }

    }

    //POST /login
    fun loginUser(ctx: Context) {
    //Validación de body. No campos vacíos.
        val body = ctx.bodyValidator(LoginBody::class.java)
            .check({ it.username.isNotBlank() }, "Username cannot be empty.")
            .check({ it.password.isNotBlank() }, "Password cannot be empty.")
            .getOrThrow { BadRequestResponse("Not valid body.") }
    //El login tira un UserException si no encuentra al usuario.
        try {
            val user = tiktok.login(body.username, body.password)
            addToken(ctx, user)
            ctx.json(UserDTO(user))
        } catch (u : UserException) {
            throw BadRequestResponse("User or email not correct.")
        }
    }

    //GET /recommendAccounts
    fun getInteresUsers(ctx: Context) {
        val probableUser   = ctx.attribute<User>("user")
        //Chequeamos si no se borro el usuario en el medio por alguna perdida.
        val user = this.chequearSiExiste(probableUser)
        //getRecommendAcounts tira excepcion si el userId no es encontrado.
        try {
            val lista = tiktok.getRecommendAccounts(user.id)
            //Chequeamos que la lista no este vacía.
            if (lista.isNotEmpty()) {
                ctx.json(lista.map { SimpleUserDTO(user) })
            } else {
                ctx.result("No recommended accounts.")
            }
        } catch (u : UserException){
            throw NotFoundResponse("User id was not found.")
        }

    }

    //POST /post
    fun addNewPost(ctx: Context) {
        val probableUser   = ctx.attribute<User>("user")
        //Chequeamos si no se borro el usuario en el medio por alguna perdida.
        val user = this.chequearSiExiste(probableUser)
        //Validación de body. No campos vacíos.
        val body = ctx.bodyValidator(PostBody::class.java)
            .check({ it.title.isNotBlank()       }, "Title cannot be empty.")
            .check({ it.description.isNotBlank() }, "Description cannot be empty.")
            .check({ it.video.isNotBlank()       }, "Video cannot be empty.")
            .getOrThrow { BadRequestResponse("Not valid body.") }
        //addPost tira un UserException si el userID no es encontrado.
        try {
            val post = tiktok.addPost(user.id, DraftPost(body.title, body.description, body.video))
            ctx.json(PostDTO(post))
        } catch (u : UserException){
            throw NotFoundResponse("User id was not found.")
        }
    }

    //GET /post/{id}
    fun getPostByID(ctx: Context) {
        //Se pide id por medio de pathParam.
        val idPost = ctx.pathParam("id")
        //login tira un UserException si no encuentra al usuario.
        try {
            val post = tiktok.getPost(idPost)
            ctx.json(PostDTO(post))
        } catch (p : PostException) {
            throw NotFoundResponse("Post does not exist.")
        }
    }

    //PUT /post/{id}
    fun updatePost(ctx: Context) {
        val probableUser   = ctx.attribute<User>("user")
        //Chequeamos si no se borro el usuario en el medio por alguna perdida.
        val user = this.chequearSiExiste(probableUser)
        val idPost = ctx.pathParam("id")
        //Validación de body. No campos vacíos.
        val body   = ctx.bodyValidator(PostBody::class.java)
            .check({ it.title.isNotBlank()       }, "Title cannot be empty.")
            .check({ it.description.isNotBlank() }, "Description cannot be empty.")
            .check({ it.video.isNotBlank()       }, "Video cannot be empty.")
            .getOrThrow { BadRequestResponse("Not valid body.") }
        try {
            // getPost tira postException si no se encuentra el idPost. Primer rama del catch.
            // editPost tira userException si no se encuentra el userID. Segunda rama del catch.
            val postByID = tiktok.getPost(idPost)
            val draftPost = DraftPost(body.title, body.description, body.video)
            // Chequeamos que sea propio del user el post.
            if (postByID.user != user) {
                throw BadRequestResponse("This post doesn't belong to you.")
            } else {
                val postEdited = tiktok.editPost(idPost, user.id, draftPost)
                ctx.json(PostDTO(postEdited))
            }
        } catch (p : PostException) {
            throw NotFoundResponse("Post was not found.")
        } catch (u : UserException) {
            throw NotFoundResponse("User id was not found.")
        }

    }

    //PUT /post/{id}/like
    fun addRemoveLike(ctx: Context) {
        val probableUser   = ctx.attribute<User>("user")
        //Chequeamos si no se borro el usuario en el medio por alguna perdida.
        val user = this.chequearSiExiste(probableUser)
        val idPost = ctx.pathParam("id")
       //updateLike tira userException si el userID no es encontrado.
        //updateLike tira postException si el postID no es encontrado.
        try {
            val postUpdated = tiktok.updateLike(user.id, idPost)
            ctx.json(PostDTO(postUpdated))
        } catch (p : PostException) {
            throw NotFoundResponse("Post was not found.")
        } catch (u : UserException) {
            throw NotFoundResponse("User id was not found.")
        }
    }

    //POST /post/{id}/comment
    fun addComment(ctx: Context) {
        val probableUser     = ctx.attribute<User>("user")
        //Chequeamos si no se borro el usuario en el medio por alguna perdida.
        val user = this.chequearSiExiste(probableUser)
        val idPost = ctx.pathParam("id")
        //Validación de body. No campos vacíos.
        val body   = ctx.bodyValidator(CommentBody::class.java)
            .check({it.text.isNotBlank()}, "The comment was empty.")
            .getOrThrow { BadRequestResponse("The comment was empty.") }
        //addComent tira userException si el userID no es encontrado.
        //addComent tira postException si el postID no es encontrado.
        try {
            val comment = DraftComment(body.text)
            val postUpdated = tiktok.addComment(user.id, idPost, comment)
            ctx.json(PostDTO(postUpdated))
        } catch (p : PostException) {
            throw NotFoundResponse("Post was not found.")
        } catch (u : UserException) {
            throw NotFoundResponse("User id was not found.")
        }
    }

    //GET /latestPosts
    fun getLast10Posts(ctx: Context) {
        val lista = tiktok.getLatestPosts()
        //Chequeamos que la lista no sea vacia para no devolver pantalla blanca.
        if (lista.isNotEmpty()) {
            ctx.json(lista.map { SimplePostDTO(it) })
        } else {
            ctx.result("No post for now.")
        }
    }

    //GET /search
    fun searchUsersOrPosts(ctx: Context) {
        val textSearched = ctx.queryParam(key = "query")
        //Chequeo de query null.
        if (textSearched.isNullOrBlank()) {
            ctx.json("Search term was empty.")
            return
        }
        val found = tiktok.search(textSearched.toString())
        //Chequeo de existencia de post/users con ese Q.
        if (found.users.isEmpty() && found.posts.isEmpty()) {
            ctx.result("No users or posts found with that filter.")
        } else {
            ctx.json(SearchResultDTO(found))
        }
    }

    //GET /trends
    fun getTop10Trends(ctx: Context) {
        // Pedimos la lista de top Trends
        val listaTrends = tiktok.getTopTrends()
        // No deberia estar nunca vacia, pero en caso que lo este devolver un mensaje mas lindo que la lista vacia.
        if (listaTrends.isNotEmpty()) {
            ctx.json(listaTrends)
        } else {
            ctx.result("There are no trends in Top 10 right now.")
        }
    }

    //GET /trends/{name}
    fun getPostByTrend(ctx: Context) {
        val name   = ctx.pathParam("name")
        val trends = tiktok.getTrend(name)
        //Chequeo si el trend existe en el sistema para no devolver pantalla blanca.
        if (trends.isEmpty()) {
            throw NotFoundResponse("Trend does not exist.")
        } else {
            // Sino, devolver la lista de Post como PostDTO
            ctx.json(trends.map { PostDTO(it)})
        }
    }

    @Throws(NotFoundResponse::class)
    private fun chequearSiExiste(user: User?): User {
        if (user != null) {
            return user
        } else {
            throw NotFoundResponse("User was not found.")
        }
    }
}