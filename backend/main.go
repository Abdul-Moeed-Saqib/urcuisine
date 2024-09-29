package main

import (
	"log"
	"net/http"

	"github.com/Abdul-Moeed-Saqib/urcuisine-backend/config"
	"github.com/Abdul-Moeed-Saqib/urcuisine-backend/middlewares"

	"github.com/Abdul-Moeed-Saqib/urcuisine-backend/routes"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Couldn't load the env file")
	}

	config.ConnectDB() // connecting to the database

	router := mux.NewRouter()

	routes.AuthRoutes(router)
	routes.PostRoutes(router)

	corsRouter := middlewares.CORS(router)

	log.Println("Server is running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", corsRouter))
}
