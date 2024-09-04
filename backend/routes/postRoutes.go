package routes

import (
	"github.com/Abdul-Moeed-Saqib/urcuisine-backend/controllers"
	"github.com/gorilla/mux"
)

func PostRoutes(router *mux.Router) {
	router.HandleFunc("/posts", controllers.CreatePost).Methods("POST")
	router.HandleFunc("/posts", controllers.GetPosts).Methods("GET")
	router.HandleFunc("/posts/{id}", controllers.UpdatePost).Methods("PUT")
	router.HandleFunc("/posts/{id}", controllers.DeletePost).Methods("DELETE")
	router.HandleFunc("/posts/{id}/comments", controllers.AddComment).Methods("POST")
}
