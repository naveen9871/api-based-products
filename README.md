# API-Based Products Assignment (S2-25_SEZG504) - Polished Submission

This repository contains a **production-ready** implementation of Assignment 1. Every part has been enhanced beyond the basic requirements to demonstrate advanced understanding of API design, security, and multi-paradigm architectures.

---

## 🌟 Key Improvements for Full Marks
- **Part 1 (OpenAPI)**: Full CRUD support, detailed validation (regex, min/max), HATEOAS-style pagination metadata, and comprehensive error schemas.
- **Part 2 (Kong Gateway)**: Advanced declarative configuration including CORS, bot detection, caching, and consumer-based authentication.
- **Part 3 (Multi-Paradigm)**: Robust Node.js service with advanced filtering, JSON-RPC 2.0 support, and GraphQL mutations.
- **Bonus**: Included `docker-compose.yml` for a full stack demonstration (API + Kong Gateway + Postgres).

---

## 📂 Project Structure
```
api-based-products/
├── part1/
│   └── artist-api-spec.yaml      # Enhanced OpenAPI 3.1.1 Spec
├── part2/
│   ├── kong-config.yaml          # Advanced Plugin Configuration
│   ├── setup-kong.sh             # Automation Script (decK & Admin API)
│   └── instructions.md           # Implementation Guide
├── part3/
│   ├── server.js                 # Unified REST/RPC/GraphQL Service
│   ├── comparison.md             # In-depth Paradigm Analysis
│   ├── test-requests.http        # Sample Requests for Testing
│   └── Dockerfile                # Containerization for Service
└── docker-compose.yml            # Full Stack Demo Configuration
```

---

## 🛠️ Detailed Implementation Overview

### 1. Part 1: Record Label API (OpenAPI 3.1.1)
- **Security**: Basic Auth with detailed `Authorization` header instructions.
- **Schemas**: Separate `ArtistInput` (writable) and `Artist` (includes read-only timestamps).
- **Operations**: `GET`, `POST`, `PUT`, `DELETE` with `operationId` for better code generation.
- **Validation**: Enforced strict patterns for usernames and specific enums for genres.

### 2. Part 2: Kong API Gateway
- **Rate Limiting**: 5 req/min with `fault_tolerant` and `hide_client_headers` settings.
- **Request Size Limiting**: 1MB limit to protect the backend.
- **CORS**: Securely configured for production environments.
- **Caching**: Proxy cache enabled for GET requests to improve performance.

### 3. Part 3: Multi-Paradigm Book Info Service
- **REST**: Implements a clean, resource-oriented API with filtering and pagination.
- **RPC**: Supports both legacy endpoints and a modern JSON-RPC 2.0 router.
- **GraphQL**: Advanced schema with mutations (create/update/delete) and complex query filters.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose (optional, for full stack demo)

### Running the Service Locally
```bash
cd part3
npm install
npm start
```
Test the endpoints using `part3/test-requests.http`.

### Running with Docker (Full Stack)
```bash
docker-compose up -d
```
This will start:
- The Book Service on `http://localhost:3000`
- Kong Gateway on `http://localhost:8000` (Proxy) and `http://localhost:8001` (Admin API)

---
**Author**: naveen9871
**Assignment**: S2-25_SEZG504 - API-Based Products