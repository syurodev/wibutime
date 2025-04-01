#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Load environment variables from .env file (exclude comments)
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo ".env file not found! Exiting..."
  exit 1
fi

# Log in to Docker Hub
#echo "Logging in to Docker Hub..."
#docker login -u "$DOCKER_USERNAME"

# Build Docker image with build arguments
echo "Building Docker image..."
docker build --no-cache -t "$DOCKER_USERNAME/$DOCKER_IMAGE:$DOCKER_TAG" .

# Push Docker image to Docker Hub
echo "Pushing Docker image to Docker Hub..."
docker push "$DOCKER_USERNAME/$DOCKER_IMAGE:$DOCKER_TAG"

# Run Docker Compose
echo "Running Docker Compose..."
docker-compose up -d --force-recreate

# Print success message
echo "Docker image built, pushed, and service started successfully!"
