#!/bin/bash

echo "Configuring Kong for the Record Label API..."

KONG_ADMIN_URL="http://localhost:8001"

echo "Creating service..."
curl -i -X POST "$KONG_ADMIN_URL/services" \
  --data "name=record-label-service" \
  --data "url=http://artist-api-service:8080"

echo
echo "Creating route..."
curl -i -X POST "$KONG_ADMIN_URL/services/record-label-service/routes" \
  --data "name=artists-route" \
  --data "paths[]=/artists" \
  --data "strip_path=false"

echo
echo "Enabling Basic Authentication..."
curl -i -X POST "$KONG_ADMIN_URL/services/record-label-service/plugins" \
  --data "name=basic-auth" \
  --data "config.hide_credentials=true"

echo
echo "Applying rate limiting (5 requests per minute)..."
curl -i -X POST "$KONG_ADMIN_URL/services/record-label-service/plugins" \
  --data "name=rate-limiting" \
  --data "config.minute=5" \
  --data "config.policy=local" \
  --data "config.limit_by=consumer"

echo
echo "Applying request size limiting (1 MB)..."
curl -i -X POST "$KONG_ADMIN_URL/services/record-label-service/plugins" \
  --data "name=request-size-limiting" \
  --data "config.allowed_payload_size=1"

echo
echo "Creating consumer..."
curl -i -X POST "$KONG_ADMIN_URL/consumers" \
  --data "username=record-label-client"

echo
echo "Creating Basic Auth credentials..."
curl -i -X POST "$KONG_ADMIN_URL/consumers/record-label-client/basic-auth" \
  --data "username=apiuser" \
  --data "password=apipassword123"

echo
echo "Kong setup complete."
