package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Post struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	UserID      primitive.ObjectID `bson:"userID,omitempty"`
	Title       string             `bson:"title,omitempty"`
	Description string             `bson:"description,omitempty"`
	VideoURL    string             `json:"video_url" bson:"video_url"`
	Recipe      string             `bson:"recipe,omitempty"`
	Country     string             `bson:"country,omitempty"`
	Likes       int                `bson:"likes,omitempty"`
	Dislikes    int                `bson:"dislikes,omitempty"`
	Comments    []Comment          `bson:"comments,omitempty"`
	CreatedAt   int64              `bson:"createdAt,omitempty"`
}

type Comment struct {
	ID      primitive.ObjectID `bson:"_id,omitempty"`
	UserID  primitive.ObjectID `bson:"userID,omitempty"`
	Name    string             `bson:"name,omitempty"`
	Text    string             `bson:"text,omitempty"`
	Created int64              `bson:"created,omitempty"`
}
