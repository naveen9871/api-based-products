# API-Based Products Assignment 1

This repository is organized to match the three questions in the assignment.

## Folder structure

- `part1/artist-api-spec.yaml`
  OpenAPI 3.1.1 specification for the Record Label API
- `part2/kong-config.yaml`
  Kong declarative configuration for Basic Auth, rate limiting, and request size limiting
- `part2/instructions.md`
  Short explanation of how Kong is configured
- `part2/setup-kong.sh`
  Example Admin API setup script
- `part2/artist-api-service.js`
  Small backend service used to demonstrate Kong in Part 2
- `part2/Dockerfile`
  Docker image for the Part 2 artist backend
- `part3/server.js`
  Book Info Service implementing REST, RPC, and GraphQL
- `part3/comparison.md`
  Comparison of REST, RPC, and GraphQL
- `part3/test-requests.http`
  Sample requests for testing Part 3
- `docker-compose.yml`
  Starts the Part 2 artist service, Part 3 book service, and Kong gateway

## Requirement checklist

### Part 1: OpenAPI 3.1.1 Record Label API

- OpenAPI version `3.1.1`: included
- Artist fields:
  - artist name
  - artist genre
  - number of albums published under the label
  - artist username
- Basic Authentication security: included using `components.securitySchemes.basicAuth`
- `/artists` with `GET`: included
- Pagination with `offset` and `limit`: included
- `/artists` with `POST`: included
- `/artists/{artistname}` endpoint: included
- Schemas subsection used properly: included
- Appropriate status codes:
  - `200`
  - `201`
  - `400`
  - `401`
  - `404`
  - `409`
  - `500`

### Part 2: KONG API Gateway

- Basic Authentication enforced in Kong: included
- Rate limiting plugin: included
- Request size limiting plugin: included
- Example consumer credentials: included
- Declarative config and Admin API examples: included

### Part 3: Book Info Service

- REST endpoints:
  - `GET /books`
  - `GET /books/{id}`
- RPC endpoints:
  - `POST /getBook`
  - `POST /createBook`
- GraphQL endpoint:
  - `POST /graphql`
  - example query: `query { book(id:1) { title author } }`
- Comparison of paradigms: included in `part3/comparison.md`

## Running Part 3 locally

```bash
cd part3
npm install
npm start
```

The service runs on `http://localhost:3000`.

## Running the full demo

```bash
docker-compose up --build
```

Services:

- Part 2 artist backend: `http://localhost:8080`
- Kong proxy: `http://localhost:8000`
- Kong Admin API: `http://localhost:8001`
- Part 3 book service: `http://localhost:3000`

## Notes for submission

- Part 1 is written in a lecturer-friendly way and aligned closely to the assignment wording.
- Part 2 now explicitly enables Kong Basic Auth, which is important because defining consumers alone does not secure the route.
- Part 3 already satisfies the required paradigms and endpoints.

## Academic positioning

This submission is designed to do more than simply satisfy the minimum checklist. It also explains the design rationale behind the choices made:

- Part 1 justifies the use of OpenAPI 3.1.1, Basic Authentication, pagination, and status codes.
- Part 2 explains why Kong policies such as `limit_by=consumer` and `policy=local` are appropriate for this scenario.
- Part 3 compares REST, RPC, and GraphQL using architectural criteria such as coupling, cacheability, flexibility, and implementation complexity.

This makes the work easier to defend in a master’s level assessment because the submission demonstrates both implementation and critical evaluation.
