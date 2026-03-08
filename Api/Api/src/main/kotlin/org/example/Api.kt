package org.example.api

import bootstrap.Bootstrap
import io.javalin.Javalin

import io.javalin.apibuilder.ApiBuilder.*
import org.example.controllers.TiktokController
import org.example.controllers.TokenController
import org.example.utils.Roles

class Api {
    private val app: Javalin
    private val tiktok = Bootstrap().getSystem()
    private val tokenController  = TokenController(tiktok)
    private val tiktokController = TiktokController(tokenController::addToken, tiktok)

    init {
        app = Javalin.create { config ->
            config.http.defaultContentType = "application/json"
            config.bundledPlugins.enableCors { cors ->
                cors.addRule {
                    it.anyHost()
                    it.exposeHeader("Authorization")
                }
            }
            config.router.apiBuilder {
                path("/user") {
                    get(tiktokController::getLoginUser, Roles.USER)
                    put(tiktokController::editUser, Roles.USER)
                    path("/timeline") {
                        get(tiktokController::getTimeLine, Roles.USER)
                    }
                    path("/{id}") {
                        get(tiktokController::getUserById, Roles.PUBLIC)
                        path("/follow") {
                            put(tiktokController::addRemoveFollow, Roles.USER)
                        }
                    }
                }
                path("/recommendAccounts") {
                    get(tiktokController::getInteresUsers, Roles.USER)
                }
                path("/register") {
                    post(tiktokController::registerUser, Roles.PUBLIC)
                }
                path("/login") {
                    post(tiktokController::loginUser, Roles.PUBLIC)
                }
                path("/post") {
                    post(tiktokController::addNewPost, Roles.USER)
                    path("/{id}"){
                        get(tiktokController::getPostByID, Roles.PUBLIC)
                        put(tiktokController::updatePost, Roles.USER)
                        path("/like"){
                            put(tiktokController::addRemoveLike, Roles.USER)
                        }
                        path("/comment"){
                            post(tiktokController::addComment, Roles.USER)
                        }
                    }
                }
                path("/latestPosts"){
                    get(tiktokController::getLast10Posts, Roles.PUBLIC)
                }
                path("/search"){
                    get(tiktokController::searchUsersOrPosts, Roles.PUBLIC)
                }
                path("/trends"){
                    get(tiktokController::getTop10Trends, Roles.PUBLIC)
                    path("/{name}"){
                        get(tiktokController::getPostByTrend, Roles.PUBLIC)
                    }
                }
            }
        }
    }

    fun start(port: Int = 7070) {
        app.beforeMatched(tokenController::validate)
        app.start(port)
    }
}

fun main() {
    Api().start()
}