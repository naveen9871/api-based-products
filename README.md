# API-Based Products Assignment (S2-25_SEZG504)

This repository contains the completed Assignment 1 for the **API-Based Products** course. The assignment is divided into three comprehensive parts, covering API design, API gateway management, and multi-paradigm service implementation.

---

## Table of Contents
1. [Part 1: Record Label API (OpenAPI 3.1.1)](#part-1-record-label-api-openapi-311)
2. [Part 2: Kong API Gateway Management](#part-2-kong-api-gateway-management)
3. [Part 3: Multi-Paradigm Book Info Service](#part-3-multi-paradigm-book-info-service)
4. [How to Use This Repository](#how-to-use-this-repository)

---

## Part 1: Record Label API (OpenAPI 3.1.1)
**Goal**: Design a secure and scalable API for a record label using the latest OpenAPI 3.1.1 specification.

### Key Features:
- **Security**: Secured using **Basic Authentication** to ensure only authorized users can access artist data.
- **Artist Schema**: Defined in the `components/schemas` section with the following fields:
  - `name`: Artist's full name.
  - `genre`: Musical genre.
  - `albumsPublished`: Number of albums under the label.
  - `username`: Unique identifier for the artist.
- **Endpoints**:
  - `GET /artists`: Retrieves a list of artists with **pagination** support (`offset` and `limit`).
  - `POST /artists`: Allows adding a new artist to the database.
  - `GET /artists/{artistname}`: Retrieves specific information for an artist using a path parameter.
- **Status Codes**: Implemented standard HTTP status codes:
  - `200 OK`: Successful retrieval.
  - `201 Created`: Successful artist creation.
  - `401 Unauthorized`: Authentication failure.
  - `404 Not Found`: Artist not found.

**File Location**: [`part1/artist-api-spec.yaml`](./part1/artist-api-spec.yaml)

---

## Part 2: Kong API Gateway Management
**Goal**: Implement traffic control and security policies using Kong API Gateway.

### Implemented Plugins:
1. **Rate Limiting**:
   - Configured to limit requests to **5 per minute** per client.
   - Prevents abuse and ensures fair usage of the API resources.
2. **Request Size Limiting**:
   - Configured to block any request body exceeding **1MB**.
   - Protects the backend from large, potentially malicious payloads.

### Deliverables:
- **Declarative Config**: [`part2/kong-config.yaml`](./part2/kong-config.yaml) for use with decK.
- **Setup Guide**: [`part2/instructions.md`](./part2/instructions.md) with step-by-step commands for Admin API integration.

---

## Part 3: Multi-Paradigm Book Info Service
**Goal**: Demonstrate the differences and implementation details of REST, RPC, and GraphQL paradigms for the same domain.

### Implementations:
- **REST**: Uses standard resource-based routing (`/books`, `/books/{id}`).
- **RPC**: Implements action-oriented procedures (`/getBook`, `/createBook`) via POST requests.
- **GraphQL**: Provides a single flexible endpoint (`/graphql`) with a strongly typed schema for granular data fetching.

### Deliverables:
- **Implementation**: [`part3/server.js`](./part3/server.js) (Node.js/Express).
- **Comparison Analysis**: [`part3/comparison.md`](./part3/comparison.md) providing a deep dive into the pros/cons of each paradigm based on flexibility, efficiency, and caching.

---

## How to Use This Repository

### 1. View OpenAPI Spec
You can import `part1/artist-api-spec.yaml` into [Swagger Editor](https://editor.swagger.io/) or any OpenAPI compatible tool to view the interactive documentation.

### 2. Run the Multi-Paradigm Server
Navigate to the `part3` directory and run:
```bash
npm install
npm start
```
- REST: `http://localhost:3000/books`
- RPC: `http://localhost:3000/getBook`
- GraphQL: `http://localhost:3000/graphql`

### 3. Apply Kong Policies
Use the provided `part2/kong-config.yaml` with the Kong Gateway:
```bash
deck sync -s part2/kong-config.yaml
```

---
**Author**: naveen9871
**Course**: API-Based Products (S2-25_SEZG504)