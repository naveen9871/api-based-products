#!/bin/bash

# Kong API Gateway Setup Script
# This script demonstrates both declarative and imperative approaches

echo "=== Kong API Gateway Setup for Record Label API ==="

# Method 1: Using decK (Declarative)
echo "Method 1: Applying configuration using decK..."
deck sync -s kong-config.yaml

# Method 2: Using Admin API (Imperative)
echo -e "\nMethod 2: Manual setup using Admin API commands"

KONG_ADMIN_URL="http://localhost:8001"

# Create service
echo "Creating service..."
curl -i -X POST $KONG_ADMIN_URL/services \
  --data "name=record-label-service" \
  --data "url=http://artist-api-service:8080"

# Create route
echo -e "\nCreating route..."
curl -i -X POST $KONG_ADMIN_URL/services/record-label-service/routes \
  --data "name=artist-route" \
  --data "paths[]=/artists" \
  --data "strip_path=false"

# Apply rate limiting plugin
echo -e "\nApplying rate limiting plugin (5 requests per minute)..."
curl -i -X POST $KONG_ADMIN_URL/services/record-label-service/plugins \
  --data "name=rate-limiting" \
  --data "config.minute=5" \
  --data "config.hour=100" \
  --data "config.policy=local" \
  --data "config.limit_by=consumer"

# Apply request size limiting plugin
echo -e "\nApplying request size limiting plugin (1MB limit)..."
curl -i -X POST $KONG_ADMIN_URL/services/record-label-service/plugins \
  --data "name=request-size-limiting" \
  --data "config.allowed_payload_size=1"

# Apply CORS plugin
echo -e "\nApplying CORS plugin..."
curl -i -X POST $KONG_ADMIN_URL/services/record-label-service/plugins \
  --data "name=cors" \
  --data "config.origins=*" \
  --data "config.methods=GET" \
  --data "config.methods=POST" \
  --data "config.methods=PUT" \
  --data "config.methods=DELETE"

# Create consumer with basic auth
echo -e "\nCreating consumer..."
curl -i -X POST $KONG_ADMIN_URL/consumers \
  --data "username=api-consumer"

echo -e "\nSetting up basic authentication for consumer..."
curl -i -X POST $KONG_ADMIN_URL/consumers/api-consumer/basic-auth \
  --data "username=recordlabel_client" \
  --data "password=secure_password_123"

# Verify configuration
echo -e "\n\n=== Verification ==="
echo "Listing all services:"
curl -s $KONG_ADMIN_URL/services | jq '.data[].name'

echo -e "\nListing plugins for record-label-service:"
curl -s $KONG_ADMIN_URL/services/record-label-service/plugins | jq '.data[].name'

echo -e "\n=== Setup Complete ==="
echo "Rate Limit: 5 requests per minute"
echo "Request Size Limit: 1MB"
echo "CORS: Enabled"
echo "Basic Auth: Configured"
