package controllers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/Abdul-Moeed-Saqib/urcuisine-backend/config"
	"github.com/Abdul-Moeed-Saqib/urcuisine-backend/models"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// handles creating a new post
func CreatePost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userID, ok := r.Context().Value("userID").(string)

	if !ok {
		http.Error(w, "User not authenticated", http.StatusUnauthorized)
		return
	}

	var post models.Post

	if err := json.NewDecoder(r.Body).Decode(&post); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	post.ID = primitive.NewObjectID()
	post.UserID, _ = primitive.ObjectIDFromHex(userID)
	post.Likes = 0
	post.Dislikes = 0
	post.Comments = []models.Comment{}

	postCollection := config.DB.Collection("posts")

	_, err := postCollection.InsertOne(context.Background(), post)
	if err != nil {
		http.Error(w, "Could not create post", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(post)
}

// handles fetching all posts
func GetPosts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var posts []models.Post
	postCollection := config.DB.Collection("posts")

	opts := options.Find().SetSort(bson.D{{"likes", -1}}).SetLimit(20)
	cursor, err := postCollection.Find(context.Background(), bson.M{}, opts)
	if err != nil {
		http.Error(w, "Could not fetch posts", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var post models.Post
		cursor.Decode(&post)
		posts = append(posts, post)
	}

	json.NewEncoder(w).Encode(posts)
}

func GetPost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Get the post ID from the URL parameters
	postID := mux.Vars(r)["id"]

	objectID, err := primitive.ObjectIDFromHex(postID)
	if err != nil {
		http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return
	}

	postCollection := config.DB.Collection("posts")

	var post models.Post
	err = postCollection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&post)
	if err != nil {
		http.Error(w, "Post not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(post)
}

// handles fetching related dishes based on the post country
func GetRelatedPosts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	postID := mux.Vars(r)["id"]

	objectID, err := primitive.ObjectIDFromHex(postID)
	if err != nil {
		http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return
	}

	postCollection := config.DB.Collection("posts")
	var post models.Post
	err = postCollection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&post)
	if err != nil {
		http.Error(w, "Post not found", http.StatusNotFound)
		return
	}

	var relatedPosts []models.Post
	cursor, err := postCollection.Find(context.Background(), bson.M{
		"country": post.Country,
		"_id":     bson.M{"$ne": post.ID},
	})
	if err != nil {
		http.Error(w, "Could not fetch related posts", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var relatedPost models.Post
		cursor.Decode(&relatedPost)
		relatedPosts = append(relatedPosts, relatedPost)
	}

	json.NewEncoder(w).Encode(relatedPosts)
}

func GetPostsByCountry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	country := r.URL.Query().Get("country")
	if country == "" {
		http.Error(w, "Country not specified", http.StatusBadRequest)
		return
	}

	var posts []models.Post
	postCollection := config.DB.Collection("posts")

	filter := bson.M{"country": country}
	cursor, err := postCollection.Find(context.Background(), filter)
	if err != nil {
		http.Error(w, "Could not fetch posts", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var post models.Post
		cursor.Decode(&post)
		posts = append(posts, post)
	}

	json.NewEncoder(w).Encode(posts)
}

// handles updating a specific post
func UpdatePost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userID, ok := r.Context().Value("userID").(string)

	if !ok {
		http.Error(w, "User not authenticated", http.StatusUnauthorized)
		return
	}

	var updateData models.Post
	_ = json.NewDecoder(r.Body).Decode(&updateData)

	objectID, _ := primitive.ObjectIDFromHex(userID)
	updateData.UserID = objectID
	filter := bson.M{"_id": updateData.ID, "userID": objectID}
	update := bson.M{
		"$set": bson.M{
			"title":       updateData.Title,
			"description": updateData.Description,
			"recipe":      updateData.Recipe,
			"updatedAt":   time.Now().Unix(),
		},
	}

	postCollection := config.DB.Collection("posts")

	_, err := postCollection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		http.Error(w, "Could not update post", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(updateData)
}

// handles deleting a specific post
func DeletePost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userID, ok := r.Context().Value("userID").(string)

	if !ok {
		http.Error(w, "User not authenticated", http.StatusUnauthorized)
		return
	}

	postID, _ := primitive.ObjectIDFromHex(mux.Vars(r)["id"])

	objectID, _ := primitive.ObjectIDFromHex(userID)
	filter := bson.M{"_id": postID, "userID": objectID}

	postCollection := config.DB.Collection("posts")

	_, err := postCollection.DeleteOne(context.Background(), filter)
	if err != nil {
		http.Error(w, "Could not delete post", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(bson.M{"message": "Post deleted successfully"})
}

// handles adding a comment to a specific post
func AddComment(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var comment models.Comment

	if err := json.NewDecoder(r.Body).Decode(&comment); err != nil {
		http.Error(w, "Invalid comment data", http.StatusBadRequest)
		return
	}

	userID, ok := r.Context().Value("userID").(primitive.ObjectID)

	if !ok {
		http.Error(w, "User not authenticated", http.StatusUnauthorized)
		return
	}

	comment.ID = primitive.NewObjectID()
	comment.UserID = userID
	comment.Created = time.Now().Unix()

	postID, _ := primitive.ObjectIDFromHex(mux.Vars(r)["id"])

	filter := bson.M{"_id": postID}
	update := bson.M{"$push": bson.M{"comments": comment}}

	postCollection := config.DB.Collection("posts")

	_, err := postCollection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		http.Error(w, "Could not add comment", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(comment)
}
