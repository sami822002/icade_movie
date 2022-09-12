#!/bin/sh

docker-compose build
docker-compose up -d
docker-compose restart
Start-Sleep -Seconds 5
docker exec movie composer install
docker exec movie npm install
docker exec movie npm run dev
pause
