# API-Based Products Assignment
**Name:** Naveen Mupparaju  
**ID Number:** 2024TM93514  
**Repository:** [github.com/naveen9871/api-based-products](https://github.com/naveen9871/api-based-products)

---

## 🏛️ Architecture Overview
This project demonstrates a production-ready API architecture organized into three logical layers:

1.  **API Specification Layer**: Using OpenAPI 3.1.1 to define strict contracts before implementation.
2.  **API Gateway Layer**: Utilizing Kong Gateway to centralize security (Basic Auth), traffic control (Rate Limiting), and protection (Size Limiting).
3.  **Application Layer**: Multi-paradigm backend services (REST, RPC, GraphQL) built with Node.js.

---

## ✅ Section 1: Design-First Approach (OpenAPI 3.1.1)
This project follows a **contract-first methodology**. The API specification in `part1/artist-api-spec.yaml` was authored before any code was written.

*   **Contract Enforcement**: The backend implementation in `part2/artist-api-service.js` strictly adheres to the schemas and status codes defined in the YAML.
*   **Pagination Design**: Implemented `offset` and `limit` to ensure scalability for the Record Label's artist database.
*   **Security**: Defined a global Basic Authentication requirement to protect sensitive artist data.

---

## ✅ Section 2: Kong API Gateway Enforcement
The Kong Gateway (`part2/kong-config.yaml`) acts as the security and traffic enforcement layer for the Artist API.

*   **Rate Limiting**: Configured to 5 requests per minute per consumer to prevent API abuse.
*   **Request Size Limiting**: Restricted to 1MB to protect against payload-based DoS attacks.
*   **Authentication**: Enforced via the `basic-auth` plugin, mapping credentials to the `record-label-client` consumer.

---

## ✅ Section 3: Multi-Paradigm Book Info Service
Goal: Implement REST, RPC, and GraphQL for the same domain to compare their architectural trade-offs.

### **Proof of Identical Responses (Validation)**
To ensure the evaluator sees that all three paradigms return the same data for the same entity (`id: 1`), see the validation results below:

#### **REST Response** (`GET /books/1`)
```json
{
  "data": {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald"
  }
}
```

#### **RPC Response** (`POST /getBook`)
```json
{
  "result": {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald"
  }
}
```

#### **GraphQL Response** (`POST /graphql`)
```json
{
  "data": {
    "book": {
      "id": 1,
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald"
    }
  }
}
```

✅ **Observation**: All paradigms return semantically identical data. REST and GraphQL use a `data` envelope, while RPC uses a JSON-RPC `result` envelope.

---

## 📊 In-Depth Comparison of API Paradigms

| Feature | REST | RPC | GraphQL |
| :--- | :--- | :--- | :--- |
| **Design Style** | Resource-oriented | Procedure-oriented | Query-driven |
| **Endpoint Structure** | Multiple endpoints | Few endpoints | Single endpoint |
| **Data Fetching** | Fixed structure | Fixed structure | Client-defined |
| **Over-fetching** | Common | Common | **Eliminated** |
| **Under-fetching** | Common | Common | **Eliminated** |
| **Caching** | Excellent (HTTP native) | Poor (POST based) | Complex |
| **Best Use Case** | Public APIs / Web | Internal Microservices | Complex Mobile/Web Apps |

---

## 📸 Screenshots Documentation

### **Part 1 – OpenAPI Design**
*   **OpenAPI Specs**: YAML source and rendered Swagger UI showing endpoint documentation and schemas.

### **Part 2 – Gateway Enforcement**
*   **Rate Limiting**: Terminal output showing `HTTP 429 Too Many Requests` after the 5th attempt.
*   **Size Limiting**: Terminal output showing `HTTP 413 Request Entity Too Large` when sending a >1MB file.
*   **Authentication**: Proof of successful access using the `apiuser` credentials.

### **Part 3 – Paradigm Execution**
*   **REST/RPC/GraphQL**: Side-by-side terminal screenshots showing the identical response for Gatsby (`id: 1`) across all three paradigms.

---

## 🚀 How to Run
1.  **Start Services**: `docker-compose up -d`
2.  **Configure Kong**: `./part2/setup-kong.sh`
3.  **Test Part 2 (Gateway)**: `curl -i -u apiuser:apipassword123 http://localhost:8000/artists`
4.  **Test Part 3 (Paradigms)**: `curl -s http://localhost:3000/books/1`
