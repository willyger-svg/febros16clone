# =============================================================================
# FEBROS16 Backend Multi-Stage Dockerfile (Optimized for Render Deployment)
# =============================================================================

# Step 1: Build the Go binary
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Install git and ca-certificates
RUN apk add --no-cache git ca-certificates

# Cache dependencies
COPY go.mod ./
RUN go mod download || true

# Copy source code
COPY . .

# Compile binary with optimizations
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o febros16-server main.go

# Step 2: Minimal runtime image
FROM alpine:latest

WORKDIR /app

RUN apk --no-cache add ca-certificates tzdata

# Copy compiled binary from builder
COPY --from=builder /app/febros16-server .
COPY --from=builder /app/migrations ./migrations

# Expose port (Render automatically overrides via PORT env variable)
EXPOSE 8080

CMD ["./febros16-server"]
