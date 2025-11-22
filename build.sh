#!/bin/bash
set -e

echo "Rebuilding Docker images without cache..."
docker compose build --no-cache

echo "Starting containers..."
docker compose up -d

echo "✅ Build and startup complete!"