#!/bin/bash

# Test script for Spaced Repetition API with PostgreSQL persistence
# This script tests the complete flow of the spaced repetition API with database storage

BASE_URL="http://localhost:3001/api/spaced-repetition"

echo "==================================="
echo "Testing Spaced Repetition API (PostgreSQL)"
echo "==================================="
echo ""

# 1. Load topics
echo "1. Loading topics into the engine..."
curl -X POST $BASE_URL/topics \
  -H "Content-Type: application/json" \
  -d '{
    "topics": ["Redes", "AWS", "Docker", "Kubernetes", "PostgreSQL", "React", "Node.js"]
  }' | jq '.'
echo ""
echo ""

# 2. Save state to database
echo "2. Saving state to PostgreSQL database..."
curl -X POST $BASE_URL/save | jq '.'
echo ""
echo ""

# 3. Get recommendations
echo "3. Getting recommendations..."
curl -X GET $BASE_URL/recommendations | jq '.'
echo ""
echo ""

# 4. Get sugeridos for current session
echo "4. Getting sugeridos for current session (max 3)..."
curl -X GET "$BASE_URL/sugeridos?max=3" | jq '.'
echo ""
echo ""

# 5. Load state from database (simulate restart)
echo "5. Loading state from PostgreSQL database..."
curl -X POST $BASE_URL/load | jq '.'
echo ""
echo ""

# 6. Verify state was loaded correctly
echo "6. Verifying state - getting recommendations again..."
curl -X GET $BASE_URL/recommendations | jq '.estadoActual'
echo ""
echo ""

echo "==================================="
echo "Test completed!"
echo "==================================="
