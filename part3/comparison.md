# Comparison of REST, RPC, and GraphQL

This section compares the three paradigms implemented for the same "Book Info Service" domain. Using one shared domain makes the comparison more meaningful because the differences come from the API style rather than from different business requirements.

The three implementations are:

- REST using `/books` and `/books/{id}`
- RPC using `/getBook` and `/createBook`
- GraphQL using `/graphql`

All three expose the same core book information, including `id`, `title`, `author`, `year`, and `genre`.

## 1. REST

REST is resource-oriented. In this design, a book is treated as a resource and is addressed through nouns rather than actions.

Examples:

- `GET /books`
- `GET /books/1`

Analytical points:

- REST aligns naturally with HTTP semantics, so methods such as `GET` and `POST` carry clear meaning.
- It is highly cacheable, especially for read operations, because standard HTTP infrastructure already understands URI-based resources.
- It is loosely coupled compared with RPC because clients interact with resources rather than internal procedure names.
- A common limitation is over-fetching, since the server usually returns a fixed representation whether or not the client needs every field.

For this assignment, REST is the most intuitive paradigm because the book collection is easy to model as a set of resources.

## 2. RPC

RPC is action-oriented. Instead of focusing on resources, it focuses on invoking operations.

Examples:

- `POST /getBook`
- `POST /createBook`

Analytical points:

- RPC can be easier to design when business logic is naturally procedural.
- It tends to be tightly coupled because clients must know the exact operation names exposed by the server.
- It is less aligned with HTTP conventions, since the action is embedded in the endpoint or request body rather than being expressed through standard HTTP method semantics.
- It is usually less cache-friendly than REST because many RPC interactions are sent as `POST` requests.

For this assignment, RPC demonstrates how the same book domain can be exposed in an operation-centric way, which is useful when the emphasis is on commands rather than resource state.

## 3. GraphQL

GraphQL is query-oriented. It exposes a schema and allows the client to request exactly the fields it needs.

Example:

```graphql
query {
  book(id: 1) {
    title
    author
  }
}
```

Analytical points:

- GraphQL addresses both over-fetching and under-fetching by allowing clients to shape the response.
- It is flexible for front-end applications because different clients can request different projections of the same resource without introducing multiple endpoints.
- It has stronger schema-driven discoverability through introspection.
- The main trade-off is implementation complexity, including resolver design, schema maintenance, and query validation.

For this assignment, GraphQL shows how the same book data can be provided in a client-driven form rather than a server-defined representation.

## Same data, different interaction style

REST:

```http
GET /books/1
```

RPC:

```http
POST /getBook
{
  "id": 1
}
```

GraphQL:

```graphql
query {
  book(id: 1) {
    id
    title
    author
    year
    genre
  }
}
```

Each request returns information about the same conceptual entity, but the interaction model is different:

- REST asks for a resource
- RPC invokes a procedure
- GraphQL submits a structured query

## Comparative evaluation

| Criterion | REST | RPC | GraphQL |
|---------|------|-----|---------|
| Primary focus | Resources | Operations | Data queries |
| Coupling | Moderate | High | Moderate |
| Cacheability | Strong | Weak | Moderate |
| Flexibility of returned fields | Low | Low | High |
| Ease of implementation | High | High | Moderate to low |
| Alignment with HTTP semantics | Strong | Weak | Mixed |
| Typical risk | Over-fetching | Tight coupling | Query complexity |

## Conclusion

No paradigm is universally best. REST is appropriate when the system is centered on resources and predictable HTTP behavior. RPC is suitable when the service is fundamentally operation-driven. GraphQL is most useful when clients need flexible access to the same underlying data. The Book Info Service demonstrates that the same domain can be expressed through all three paradigms, but each paradigm optimizes for a different architectural priority: standardization in REST, procedural clarity in RPC, and response flexibility in GraphQL.
