Write-Host "Rebuilding Docker images without cache..."
docker compose build --no-cache

Write-Host "Starting containers..."
docker compose up -d

Write-Host "Build and startup complete!"