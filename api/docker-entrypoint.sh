#!/usr/bin/env sh
set -e

echo "Running database migrations..."
npm run db:migrate

echo "Starting API server..."
exec npm start
