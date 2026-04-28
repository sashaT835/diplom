#!/bin/sh
set -e

echo "🔄 Waiting for database to be ready..."
sleep 5

echo "📊 Checking database connection..."
npx prisma db execute --stdin <<EOF
SELECT 1;
EOF

echo "🚀 Running database migrations..."
if npx prisma migrate deploy; then
  echo "✅ Migrations completed successfully"
else
  echo "⚠️  Migration failed, retrying..."
  sleep 3
  npx prisma migrate deploy
fi

echo "🌱 Running database seed..."
if npx prisma db seed; then
  echo "✅ Seed completed successfully"
else
  echo "⚠️  Seed failed or already executed"
fi

echo "🎯 Starting NestJS application..."
exec node dist/src/main.js
