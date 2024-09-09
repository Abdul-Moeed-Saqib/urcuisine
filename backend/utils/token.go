package utils

import (
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var JwtSecretKey = []byte(os.Getenv("JWT_SECRET"))

// generates a new JWT token for authenticated users
func GenerateJWT(userID string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"userID": userID,
		"exp":    time.Now().Add(time.Hour * 72).Unix(), // in 3 days it will expire
	})

	tokenString, err := token.SignedString(JwtSecretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
