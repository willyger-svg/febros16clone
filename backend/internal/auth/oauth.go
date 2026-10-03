package auth

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

// GoogleUserInfo holds user data returned by Google OAuth2 UserInfo endpoint
type GoogleUserInfo struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	VerifiedEmail bool   `json:"verified_email"`
	Name          string `json:"name"`
	GivenName     string `json:"given_name"`
	Picture       string `json:"picture"`
}

// OAuthService manages authentication logic with database/sql and JWT
type OAuthService struct {
	DB          *sql.DB
	Config      *oauth2.Config
	JWTSecret   []byte
	FrontendURL string
}

// NewOAuthService initializes an OAuthService instance with environment variables
func NewOAuthService(db *sql.DB) *OAuthService {
	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:3000" // Default for Next.js frontend
	}

	return &OAuthService{
		DB: db,
		Config: &oauth2.Config{
			ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
			ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
			RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
			Scopes: []string{
				"https://www.googleapis.com/auth/userinfo.email",
				"https://www.googleapis.com/auth/userinfo.profile",
			},
			Endpoint: google.Endpoint,
		},
		JWTSecret:   []byte(os.Getenv("JWT_SECRET")),
		FrontendURL: frontendURL,
	}
}

// generateRandomState creates a cryptographically secure random string to prevent CSRF attacks
func generateRandomState() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

// =========================================================================
// 1. HandleGoogleLogin: Generates OAuth state & redirects user to Google Auth
// =========================================================================
func (s *OAuthService) HandleGoogleLogin(w http.ResponseWriter, r *http.Request) {
	state, err := generateRandomState()
	if err != nil {
		http.Error(w, "Hitilafu katika kutengeneza token ya usalama", http.StatusInternalServerError)
		return
	}

	// Store state in an HttpOnly cookie for 10 minutes to validate the callback
	http.SetCookie(w, &http.Cookie{
		Name:     "oauth_state",
		Value:    state,
		Expires:  time.Now().Add(10 * time.Minute),
		HttpOnly: true,
		Secure:   r.TLS != nil || os.Getenv("ENV") == "production",
		SameSite: http.SameSiteLaxMode,
		Path:     "/",
	})

	// Redirect to Google Consent Screen
	url := s.Config.AuthCodeURL(state, oauth2.AccessTypeOffline)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

// =========================================================================
// 2. HandleGoogleCallback: Exchanges code, fetches profile, upserts user, issues JWT
// =========================================================================
func (s *OAuthService) HandleGoogleCallback(w http.ResponseWriter, r *http.Request) {
	// A. Validate CSRF state
	stateCookie, err := r.Cookie("oauth_state")
	if err != nil || stateCookie.Value != r.URL.Query().Get("state") {
		http.Error(w, "Usalama: State token haioani (Invalid CSRF State)", http.StatusBadRequest)
		return
	}

	// Invalidate state cookie immediately after validation
	http.SetCookie(w, &http.Cookie{
		Name:     "oauth_state",
		Value:    "",
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
		Path:     "/",
	})

	// B. Exchange code for Google Access Token
	code := r.URL.Query().Get("code")
	if code == "" {
		http.Error(w, "Kodi ya uthibitisho haijapatikana kutoka Google", http.StatusBadRequest)
		return
	}

	token, err := s.Config.Exchange(r.Context(), code)
	if err != nil {
		http.Error(w, fmt.Sprintf("Imeshindikana kubadilisha code: %v", err), http.StatusInternalServerError)
		return
	}

	// C. Fetch User Profile from Google UserInfo API
	client := s.Config.Client(r.Context(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		http.Error(w, "Imeshindikana kupata taarifa za mtumiaji kutoka Google", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		http.Error(w, "Google API imerudisha hitilafu wakati wa kupata taarifa", http.StatusBadRequest)
		return
	}

	var googleUser GoogleUserInfo
	if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
		http.Error(w, "Hitilafu katika kusoma taarifa za mtumiaji", http.StatusInternalServerError)
		return
	}

	// D. Check and register user in PostgreSQL Database (standard database/sql)
	userID, err := s.upsertGoogleUser(r.Context(), googleUser)
	if err != nil {
		http.Error(w, fmt.Sprintf("Hitilafu kwenye Database: %v", err), http.StatusInternalServerError)
		return
	}

	// E. Generate system JWT token
	jwtToken, err := s.generateSystemJWT(userID, googleUser.Email)
	if err != nil {
		http.Error(w, "Imeshindikana kutengeneza token ya mfumo", http.StatusInternalServerError)
		return
	}

	// F. Redirect user to Next.js Frontend Dashboard with token
	redirectTarget := fmt.Sprintf("%s/auth/callback?token=%s", s.FrontendURL, jwtToken)
	http.Redirect(w, r, redirectTarget, http.StatusTemporaryRedirect)
}

// upsertGoogleUser checks if user exists by google_id or email, updates or inserts accordingly
func (s *OAuthService) upsertGoogleUser(ctx context.Context, gu GoogleUserInfo) (int64, error) {
	var userID int64

	// 1. Query by google_id
	queryByGoogleID := `SELECT id FROM users WHERE google_id = $1 LIMIT 1`
	err := s.DB.QueryRowContext(ctx, queryByGoogleID, gu.ID).Scan(&userID)
	if err == nil {
		// User already exists, update avatar_url if provided
		updateAvatarQuery := `UPDATE users SET avatar_url = $1, updated_at = NOW() WHERE id = $2`
		_, _ = s.DB.ExecContext(ctx, updateAvatarQuery, gu.Picture, userID)
		return userID, nil
	}

	if !errors.Is(err, sql.ErrNoRows) {
		return 0, err
	}

	// 2. Query by email (existing account created via credentials or other method)
	queryByEmail := `SELECT id FROM users WHERE email = $1 LIMIT 1`
	err = s.DB.QueryRowContext(ctx, queryByEmail, gu.Email).Scan(&userID)
	if err == nil {
		// Link Google ID to existing user account
		linkQuery := `UPDATE users SET google_id = $1, avatar_url = COALESCE(avatar_url, $2), updated_at = NOW() WHERE id = $3`
		_, err = s.DB.ExecContext(ctx, linkQuery, gu.ID, gu.Picture, userID)
		if err != nil {
			return 0, err
		}
		return userID, nil
	}

	if !errors.Is(err, sql.ErrNoRows) {
		return 0, err
	}

	// 3. New user: insert into database
	insertQuery := `
		INSERT INTO users (name, email, google_id, avatar_url, created_at, updated_at)
		VALUES ($1, $2, $3, $4, NOW(), NOW())
		RETURNING id
	`
	err = s.DB.QueryRowContext(ctx, insertQuery, gu.Name, gu.Email, gu.ID, gu.Picture).Scan(&userID)
	if err != nil {
		return 0, err
	}

	return userID, nil
}

// generateSystemJWT signs a 7-day valid HMAC-SHA256 JWT
func (s *OAuthService) generateSystemJWT(userID int64, email string) (string, error) {
	claims := jwt.MapClaims{
		"sub":   userID,
		"email": email,
		"iss":   "febros16-api",
		"iat":   time.Now().Unix(),
		"exp":   time.Now().Add(7 * 24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(s.JWTSecret)
}
