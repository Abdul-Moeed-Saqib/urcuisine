package routes

import (
	"github.com/Abdul-Moeed-Saqib/urcuisine-backend/controllers"
	"github.com/Abdul-Moeed-Saqib/urcuisine-backend/middlewares"
	"github.com/gorilla/mux"
)

func PostRoutes(router *mux.Router) {

	router.HandleFunc("/posts", controllers.GetPosts).Methods("GET")

	authRequired := router.PathPrefix("/posts").Subrouter()
	authRequired.Use(middlewares.AuthMiddleware)

	authRequired.HandleFunc("", controllers.CreatePost).Methods("POST")
	authRequired.HandleFunc("/{id}", controllers.UpdatePost).Methods("PUT")
	authRequired.HandleFunc("/{id}", controllers.DeletePost).Methods("DELETE")
	authRequired.HandleFunc("/{id}/comments", controllers.AddComment).Methods("POST")
}
