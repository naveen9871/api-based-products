# API Paradigm Comparison: REST vs. RPC vs. GraphQL

In this assignment, we implemented the same "Book Info Service" using three distinct architectural paradigms. Below is a comparison based on the implementation.

## 1. REST (Representational State Transfer)
*   **Focus**: Resources (Nouns).
*   **Endpoint Structure**: `/books`, `/books/{id}`.
*   **HTTP Methods**: Uses standard verbs (`GET`, `POST`, `PUT`, `DELETE`).
*   **Pros**: 
    *   Highly cacheable.
    *   Uniform interface.
    *   Standard status codes (`200`, `404`, etc.).
*   **Cons**: 
    *   Over-fetching/Under-fetching (returns fixed data structures).
    *   Can require multiple round-trips for complex data.

## 2. RPC (Remote Procedure Call)
*   **Focus**: Actions (Verbs).
*   **Endpoint Structure**: `/getBook`, `/createBook`.
*   **HTTP Methods**: Usually relies on `POST` for everything.
*   **Pros**:
    *   Simple and straightforward for action-oriented operations.
    *   High performance (low overhead).
*   **Cons**:
    *   Tight coupling between client and server.
    *   Harder to discover and standardize compared to REST.
    *   Doesn't utilize HTTP semantics (e.g., often returns `200 OK` even for errors).

## 3. GraphQL
*   **Focus**: Data Queries (Client-defined).
*   **Endpoint Structure**: Single endpoint (usually `/graphql`).
*   **HTTP Methods**: Typically `POST`.
*   **Pros**:
    *   **No Over-fetching**: Clients request exactly what they need.
    *   Strongly typed schema.
    *   Aggregation: Can fetch nested data in a single request.
*   **Cons**:
    *   Complexity in implementation (resolvers, schemas).
    *   Harder to cache at the HTTP level.
    *   Query complexity management is required to prevent DOS.

## Summary Table

| Feature | REST | RPC | GraphQL |
| :--- | :--- | :--- | :--- |
| **Center of Gravity** | Resources | Procedures | Data/Graph |
| **Predictability** | High (Conventions) | Low (Custom) | High (Typed Schema) |
| **Efficiency** | Moderate | High | Very High (for specific data) |
| **Caching** | Excellent (Native) | Poor | Challenging |
| **Learning Curve** | Low | Low | Moderate |
