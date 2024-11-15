package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/Abdul-Moeed-Saqib/urcuisine-backend/config"
	"github.com/Abdul-Moeed-Saqib/urcuisine-backend/models"
	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func getUserIDFromToken(r *http.Request) (string, error) {
	cookie, err := r.Cookie("token")
	if err != nil {
		return "", fmt.Errorf("could not find token in cookies")
	}

	token, _, err := new(jwt.Parser).ParseUnverified(cookie.Value, jwt.MapClaims{})
	if err != nil {
		return "", fmt.Errorf("error decoding token: %v", err)
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		if userID, ok := claims["userID"].(string); ok {
			return userID, nil
		}
	}

	return "", fmt.Errorf("user ID not found in token claims")
}

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
	post.CreatedAt = time.Now().Unix()

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

	pipeline := mongo.Pipeline{
		{{"$match", bson.M{"likes": bson.M{"$gt": 0}}}},
		{{"$sample", bson.M{"size": 10}}},
	}

	cursor, err := postCollection.Aggregate(context.Background(), pipeline)
	if err != nil {
		http.Error(w, "Could not fetch posts", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var post models.Post
		if err := cursor.Decode(&post); err != nil {
			http.Error(w, "Error decoding post", http.StatusInternalServerError)
			return
		}
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

	userID, err := getUserIDFromToken(r)
	if err == nil {
		enduserID, _ := primitive.ObjectIDFromHex(userID)
		userCollection := config.DB.Collection("users")

		var user models.User
		err := userCollection.FindOne(context.Background(), bson.M{"_id": enduserID}).Decode(&user)
		if err == nil {
			response := struct {
				Post        models.Post          `json:"post"`
				LikesList   []primitive.ObjectID `json:"likesList"`
				DislikeList []primitive.ObjectID `json:"dislikeList"`
			}{
				Post:        post,
				LikesList:   user.LikesList,
				DislikeList: user.DislikeList,
			}

			json.NewEncoder(w).Encode(response)
			return
		}
	}

	json.NewEncoder(w).Encode(post)
}

func GetPostsByCountry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	country := mux.Vars(r)["country"]

	postCollection := config.DB.Collection("posts")
	userCollection := config.DB.Collection("users")

	cursor, err := postCollection.Find(context.Background(), bson.M{"country": country})
	if err != nil {
		http.Error(w, "Could not fetch posts", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	var postsWithUserInfo []map[string]interface{}

	for cursor.Next(context.Background()) {
		var post models.Post
		if err := cursor.Decode(&post); err != nil {
			http.Error(w, "Error decoding post", http.StatusInternalServerError)
			return
		}

		var user models.User
		err := userCollection.FindOne(context.Background(), bson.M{"_id": post.UserID}).Decode(&user)
		if err != nil {
			http.Error(w, "Could not fetch user details", http.StatusInternalServerError)
			return
		}

		postWithUser := map[string]interface{}{
			"ID":        post.ID,
			"Title":     post.Title,
			"UserName":  user.Name,
			"Country":   post.Country,
			"CreatedAt": post.CreatedAt,
		}
		postsWithUserInfo = append(postsWithUserInfo, postWithUser)
	}

	json.NewEncoder(w).Encode(postsWithUserInfo)
}

// handles fetching related dishes based on the post's country
func GetRelatedPosts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	postID := mux.Vars(r)["id"] // post ID from the URL parameters

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
		"_id":     bson.M{"$ne": post.ID}, // this removes the current post
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

	userID, ok := r.Context().Value("userID").(string)
	if !ok {
		http.Error(w, "User not authenticated", http.StatusUnauthorized)
		return
	}

	enduserID, _ := primitive.ObjectIDFromHex(userID)

	var user models.User
	userCollection := config.DB.Collection("users")
	err := userCollection.FindOne(context.Background(), bson.M{"_id": enduserID}).Decode(&user)
	if err != nil {
		http.Error(w, "User not found", http.StatusInternalServerError)
		return
	}

	comment.ID = primitive.NewObjectID()
	comment.UserID = enduserID
	comment.Name = user.Name
	comment.Created = time.Now().Unix()

	postID, _ := primitive.ObjectIDFromHex(mux.Vars(r)["id"])
	filter := bson.M{"_id": postID}
	update := bson.M{"$push": bson.M{"comments": comment}}

	postCollection := config.DB.Collection("posts")
	_, err = postCollection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		http.Error(w, "Could not add comment", http.StatusInternalServerError)
		return
	}

	// commentResponse := map[string]interface{}{
	// 	"id":      comment.ID,
	// 	"userID":  comment.UserID,
	// 	"Text":    comment.Text,
	// 	"Created": comment.Created,
	// 	"Name":    user.Name,
	// }

	json.NewEncoder(w).Encode(comment)
}

func LikePost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userID, ok := r.Context().Value("userID").(string)
	if !ok {
		http.Error(w, "User not authenticated", http.StatusUnauthorized)
		return
	}
	enduserID, _ := primitive.ObjectIDFromHex(userID)

	postID := mux.Vars(r)["id"]
	objectID, err := primitive.ObjectIDFromHex(postID)
	if err != nil {
		http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return
	}

	postCollection := config.DB.Collection("posts")
	userCollection := config.DB.Collection("users")

	// Check if the user has already liked the post
	userFilter := bson.M{"_id": enduserID, "likesList": objectID}
	var existingUser models.User
	err = userCollection.FindOne(context.Background(), userFilter).Decode(&existingUser)

	if err == nil {
		_, _ = userCollection.UpdateOne(context.Background(), bson.M{"_id": enduserID}, bson.M{
			"$pull": bson.M{"likesList": objectID},
		})
		_, _ = postCollection.UpdateOne(context.Background(), bson.M{"_id": objectID}, bson.M{
			"$inc": bson.M{"likes": -1},
		})
	} else {
		userDislikeFilter := bson.M{"_id": enduserID, "dislikeList": objectID}
		err := userCollection.FindOne(context.Background(), userDislikeFilter).Decode(&existingUser)
		if err == nil {
			_, _ = postCollection.UpdateOne(context.Background(), bson.M{"_id": objectID}, bson.M{
				"$inc": bson.M{"dislikes": -1},
			})
		}

		_, _ = userCollection.UpdateOne(context.Background(), bson.M{"_id": enduserID}, bson.M{
			"$addToSet": bson.M{"likesList": objectID},
			"$pull":     bson.M{"dislikeList": objectID},
		})

		_, _ = postCollection.UpdateOne(context.Background(), bson.M{"_id": objectID}, bson.M{
			"$inc": bson.M{"likes": 1},
		})
	}

	var post models.Post
	err = postCollection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&post)
	if err != nil {
		http.Error(w, "Failed to retrieve post", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"likes":    post.Likes,
		"dislikes": post.Dislikes,
	}

	json.NewEncoder(w).Encode(response)
}

func DislikePost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userID, ok := r.Context().Value("userID").(string)
	if !ok {
		http.Error(w, "User not authenticated", http.StatusUnauthorized)
		return
	}
	enduserID, _ := primitive.ObjectIDFromHex(userID)

	postID := mux.Vars(r)["id"]
	objectID, err := primitive.ObjectIDFromHex(postID)
	if err != nil {
		http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return
	}

	postCollection := config.DB.Collection("posts")
	userCollection := config.DB.Collection("users")

	// Check if the user has already disliked the post
	userFilter := bson.M{"_id": enduserID, "dislikeList": objectID}
	var existingUser models.User
	err = userCollection.FindOne(context.Background(), userFilter).Decode(&existingUser)

	if err == nil {
		_, _ = userCollection.UpdateOne(context.Background(), bson.M{"_id": enduserID}, bson.M{
			"$pull": bson.M{"dislikeList": objectID},
		})
		_, _ = postCollection.UpdateOne(context.Background(), bson.M{"_id": objectID}, bson.M{
			"$inc": bson.M{"dislikes": -1},
		})
	} else {
		userLikeFilter := bson.M{"_id": enduserID, "likesList": objectID}
		err := userCollection.FindOne(context.Background(), userLikeFilter).Decode(&existingUser)
		if err == nil {
			_, _ = postCollection.UpdateOne(context.Background(), bson.M{"_id": objectID}, bson.M{
				"$inc": bson.M{"likes": -1},
			})
		}

		_, _ = userCollection.UpdateOne(context.Background(), bson.M{"_id": enduserID}, bson.M{
			"$addToSet": bson.M{"dislikeList": objectID},
			"$pull":     bson.M{"likesList": objectID},
		})

		_, _ = postCollection.UpdateOne(context.Background(), bson.M{"_id": objectID}, bson.M{
			"$inc": bson.M{"dislikes": 1},
		})
	}

	var post models.Post
	err = postCollection.FindOne(context.Background(), bson.M{"_id": objectID}).Decode(&post)
	if err != nil {
		http.Error(w, "Failed to retrieve post", http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"likes":    post.Likes,
		"dislikes": post.Dislikes,
	}

	json.NewEncoder(w).Encode(response)
}
