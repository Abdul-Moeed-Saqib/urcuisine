package routes

import (
	"github.com/Abdul-Moeed-Saqib/urcuisine-backend/controllers"
	"github.com/gorilla/mux"
)

func AuthRoutes(router *mux.Router) {
	router.HandleFunc("/auth/signup", controllers.Signup).Methods("POST")
	router.HandleFunc("/auth/login", controllers.Login).Methods("POST")
	router.HandleFunc("/auth/logout", controllers.Logout).Methods("POST")
	router.HandleFunc("/auth/validate", controllers.ValidateToken).Methods("GET")
}
