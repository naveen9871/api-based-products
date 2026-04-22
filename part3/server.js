const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
app.use(express.json());

// --- Identical Data Source ---
const books = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  { id: 2, title: "1984", author: "George Orwell" },
  { id: 3, title: "To Kill a Mockingbird", author: "Harper Lee" }
];

// --- 1. REST Paradigm ---
// GET /books - Get all books
app.get('/books', (req, res) => {
  res.status(200).json(books);
});

// GET /books/:id - Get specific book
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ error: "Book not found" });
  }
});


// --- 2. RPC Paradigm ---
// POST /getBook - RPC style to get a book by ID
app.post('/getBook', (req, res) => {
  const { id } = req.body;
  const book = books.find(b => b.id === id);
  if (book) {
    res.status(200).json({ result: book });
  } else {
    res.status(200).json({ error: { message: "Book not found", code: -32602 } });
  }
});

// POST /createBook - RPC style to "create" a book (simulation)
app.post('/createBook', (req, res) => {
  const { title, author } = req.body;
  const newBook = { id: books.length + 1, title, author };
  // In a real app, we'd push to the array. Here we just return success.
  res.status(200).json({ result: newBook });
});


// --- 3. GraphQL Paradigm ---
const schema = buildSchema(`
  type Book {
    id: Int
    title: String
    author: String
  }

  type Query {
    book(id: Int!): Book
    books: [Book]
  }
`);

const root = {
  book: ({ id }) => books.find(b => b.id === id),
  books: () => books,
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));


// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Book Info Service running:`);
  console.log(`- REST: http://localhost:${PORT}/books`);
  console.log(`- RPC:  http://localhost:${PORT}/getBook`);
  console.log(`- GraphQL: http://localhost:${PORT}/graphql`);
});
