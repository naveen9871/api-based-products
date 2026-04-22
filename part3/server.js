const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();
app.use(express.json());

// In-memory book data used by all three paradigms
const books = [
  { 
    id: 1, 
    title: "The Great Gatsby", 
    author: "F. Scott Fitzgerald",
    year: 1925,
    genre: "Fiction",
    isbn: "978-0743273565",
    publisher: "Scribner",
    pages: 180,
    price: 12.99,
    inStock: true
  },
  { 
    id: 2, 
    title: "1984", 
    author: "George Orwell",
    year: 1949,
    genre: "Dystopian",
    isbn: "978-0451524935",
    publisher: "Signet Classic",
    pages: 328,
    price: 9.99,
    inStock: true
  },
  { 
    id: 3, 
    title: "To Kill a Mockingbird", 
    author: "Harper Lee",
    year: 1960,
    genre: "Fiction",
    isbn: "978-0446310789",
    publisher: "Grand Central Publishing",
    pages: 281,
    price: 14.99,
    inStock: false
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    year: 1813,
    genre: "Romance",
    isbn: "978-0141439518",
    publisher: "Penguin Classics",
    pages: 432,
    price: 8.99,
    inStock: true
  }
];

// Helper function for response formatting
const formatResponse = (success, data, error = null) => ({
  success,
  data: data || null,
  error: error || null,
  timestamp: new Date().toISOString()
});

// ============================================
// 1. REST PARADIGM
// Resource-oriented architecture
// ============================================

// GET /books - Get all books with optional filtering
app.get('/books', (req, res) => {
  const { author, genre, inStock, limit, offset = 0 } = req.query;
  
  let filteredBooks = [...books];
  
  // Apply filters
  if (author) {
    filteredBooks = filteredBooks.filter(b => 
      b.author.toLowerCase().includes(author.toLowerCase())
    );
  }
  if (genre) {
    filteredBooks = filteredBooks.filter(b => 
      b.genre.toLowerCase() === genre.toLowerCase()
    );
  }
  if (inStock !== undefined) {
    const stockBool = inStock === 'true';
    filteredBooks = filteredBooks.filter(b => b.inStock === stockBool);
  }
  
  // Apply pagination
  const start = parseInt(offset);
  const end = limit ? start + parseInt(limit) : undefined;
  const paginatedBooks = filteredBooks.slice(start, end);
  
  // RESTful response with metadata
  res.status(200).json({
    data: paginatedBooks,
    metadata: {
      total: filteredBooks.length,
      returned: paginatedBooks.length,
      offset: start,
      limit: limit ? parseInt(limit) : filteredBooks.length,
      filters: { author, genre, inStock }
    },
    _links: {
      self: `/books?offset=${start}&limit=${limit || filteredBooks.length}`,
      next: end < filteredBooks.length ? 
        `/books?offset=${end}&limit=${limit}` : null,
      prev: start > 0 ? 
        `/books?offset=${Math.max(0, start - (limit || 10))}&limit=${limit}` : null
    }
  });
});

// GET /books/:id - Get specific book (RESTful)
app.get('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  
  if (book) {
    res.status(200).json({
      data: book,
      _links: {
        self: `/books/${bookId}`,
        collection: '/books'
      }
    });
  } else {
    res.status(404).json(formatResponse(false, null, {
      code: 'RESOURCE_NOT_FOUND',
      message: `Book with ID ${bookId} not found`,
      status: 404
    }));
  }
});

// POST /books - Create new book (RESTful)
app.post('/books', (req, res) => {
  const { title, author, year, genre, isbn, publisher, pages, price, inStock } = req.body;
  
  // Validation
  if (!title || !author) {
    return res.status(400).json(formatResponse(false, null, {
      code: 'VALIDATION_ERROR',
      message: 'Title and author are required fields',
      status: 400
    }));
  }
  
  const newBook = {
    id: books.length + 1,
    title,
    author,
    year: year || new Date().getFullYear(),
    genre: genre || 'Unknown',
    isbn: isbn || 'N/A',
    publisher: publisher || 'Unknown',
    pages: pages || 0,
    price: price || 0.00,
    inStock: inStock !== undefined ? inStock : true
  };
  
  books.push(newBook);
  
  res.status(201)
     .location(`/books/${newBook.id}`)
     .json(formatResponse(true, newBook));
});

// PUT /books/:id - Update entire book (RESTful)
app.put('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === bookId);
  
  if (bookIndex === -1) {
    return res.status(404).json(formatResponse(false, null, {
      code: 'RESOURCE_NOT_FOUND',
      message: `Book with ID ${bookId} not found`,
      status: 404
    }));
  }
  
  const updatedBook = {
    ...books[bookIndex],
    ...req.body,
    id: bookId // Ensure ID doesn't change
  };
  
  books[bookIndex] = updatedBook;
  
  res.status(200).json(formatResponse(true, updatedBook));
});

// DELETE /books/:id - Delete book (RESTful)
app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === bookId);
  
  if (bookIndex === -1) {
    return res.status(404).json(formatResponse(false, null, {
      code: 'RESOURCE_NOT_FOUND',
      message: `Book with ID ${bookId} not found`,
      status: 404
    }));
  }
  
  const deletedBook = books.splice(bookIndex, 1)[0];
  
  res.status(200).json(formatResponse(true, {
    message: 'Book successfully deleted',
    deleted: deletedBook
  }));
});


// ============================================
// 2. RPC PARADIGM
// Action/procedure-oriented
// ============================================

// POST /rpc - RPC endpoint that handles multiple procedures
app.post('/rpc', (req, res) => {
  const { method, params, id } = req.body;
  
  // JSON-RPC 2.0 style response
  const jsonRpcResponse = (result) => ({
    jsonrpc: '2.0',
    result: result,
    id: id || null
  });
  
  const jsonRpcError = (code, message) => ({
    jsonrpc: '2.0',
    error: { code, message },
    id: id || null
  });
  
  switch(method) {
    case 'getBook':
      const bookId = params?.id;
      const book = books.find(b => b.id === bookId);
      if (book) {
        res.json(jsonRpcResponse(book));
      } else {
        res.json(jsonRpcError(-32602, `Book with ID ${bookId} not found`));
      }
      break;
      
    case 'createBook':
      const { title, author, ...otherFields } = params || {};
      if (!title || !author) {
        return res.json(jsonRpcError(-32602, 'Title and author are required'));
      }
      const newBook = {
        id: books.length + 1,
        title,
        author,
        year: otherFields.year || new Date().getFullYear(),
        genre: otherFields.genre || 'Unknown',
        isbn: otherFields.isbn || 'N/A',
        publisher: otherFields.publisher || 'Unknown',
        pages: otherFields.pages || 0,
        price: otherFields.price || 0.00,
        inStock: otherFields.inStock !== undefined ? otherFields.inStock : true
      };
      books.push(newBook);
      res.json(jsonRpcResponse(newBook));
      break;
      
    case 'getBooksByAuthor':
      const authorName = params?.author;
      const authorBooks = books.filter(b => 
        b.author.toLowerCase().includes(authorName?.toLowerCase() || '')
      );
      res.json(jsonRpcResponse(authorBooks));
      break;
      
    case 'searchBooks':
      const { query, filters } = params || {};
      let results = [...books];
      if (query) {
        results = results.filter(b => 
          b.title.toLowerCase().includes(query.toLowerCase()) ||
          b.author.toLowerCase().includes(query.toLowerCase())
        );
      }
      if (filters?.genre) {
        results = results.filter(b => b.genre === filters.genre);
      }
      res.json(jsonRpcResponse(results));
      break;
      
    case 'getBookCount':
      const count = books.length;
      res.json(jsonRpcResponse({ total: count }));
      break;
      
    default:
      res.json(jsonRpcError(-32601, `Method '${method}' not found`));
  }
});

// Legacy RPC endpoints for backward compatibility
app.post('/getBook', (req, res) => {
  const { id } = req.body;
  const book = books.find(b => b.id === id);
  if (book) {
    res.status(200).json({ result: book, success: true });
  } else {
    res.status(200).json({ 
      error: { code: -32602, message: "Book not found" },
      success: false 
    });
  }
});

app.post('/createBook', (req, res) => {
  const { title, author } = req.body;
  const newBook = { 
    id: books.length + 1, 
    title, 
    author,
    year: new Date().getFullYear(),
    genre: 'Unknown',
    inStock: true
  };
  books.push(newBook);
  res.status(200).json({ result: newBook, success: true });
});


// ============================================
// 3. GRAPHQL PARADIGM
// Query language for APIs
// ============================================

const schema = buildSchema(`
  type Book {
    id: Int!
    title: String!
    author: String!
    year: Int
    genre: String
    isbn: String
    publisher: String
    pages: Int
    price: Float
    inStock: Boolean!
  }
  
  input BookInput {
    title: String!
    author: String!
    year: Int
    genre: String
    isbn: String
    publisher: String
    pages: Int
    price: Float
    inStock: Boolean
  }
  
  input BookFilter {
    author: String
    genre: String
    inStock: Boolean
    yearMin: Int
    yearMax: Int
  }
  
  type Query {
    book(id: Int!): Book
    books(filter: BookFilter, limit: Int, offset: Int): [Book]!
    booksCount: Int!
    searchBooks(query: String!): [Book]!
  }
  
  type Mutation {
    createBook(input: BookInput!): Book!
    updateBook(id: Int!, input: BookInput!): Book
    deleteBook(id: Int!): Boolean!
  }
`);

const root = {
  // Queries
  book: ({ id }) => books.find(b => b.id === id),
  
  books: ({ filter, limit, offset = 0 }) => {
    let results = [...books];
    
    // Apply filters
    if (filter) {
      if (filter.author) {
        results = results.filter(b => 
          b.author.toLowerCase().includes(filter.author.toLowerCase())
        );
      }
      if (filter.genre) {
        results = results.filter(b => b.genre === filter.genre);
      }
      if (filter.inStock !== undefined) {
        results = results.filter(b => b.inStock === filter.inStock);
      }
      if (filter.yearMin) {
        results = results.filter(b => b.year >= filter.yearMin);
      }
      if (filter.yearMax) {
        results = results.filter(b => b.year <= filter.yearMax);
      }
    }
    
    // Apply pagination
    const start = offset;
    const end = limit ? start + limit : undefined;
    return results.slice(start, end);
  },
  
  booksCount: () => books.length,
  
  searchBooks: ({ query }) => {
    return books.filter(b => 
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.author.toLowerCase().includes(query.toLowerCase())
    );
  },
  
  // Mutations
  createBook: ({ input }) => {
    const newBook = {
      id: books.length + 1,
      ...input,
      year: input.year || new Date().getFullYear(),
      genre: input.genre || 'Unknown',
      inStock: input.inStock !== undefined ? input.inStock : true
    };
    books.push(newBook);
    return newBook;
  },
  
  updateBook: ({ id, input }) => {
    const bookIndex = books.findIndex(b => b.id === id);
    if (bookIndex === -1) return null;
    
    const updatedBook = {
      ...books[bookIndex],
      ...input,
      id // Ensure ID doesn't change
    };
    books[bookIndex] = updatedBook;
    return updatedBook;
  },
  
  deleteBook: ({ id }) => {
    const bookIndex = books.findIndex(b => b.id === id);
    if (bookIndex === -1) return false;
    
    books.splice(bookIndex, 1);
    return true;
  }
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));


// ============================================
// Documentation and Demo Routes
// ============================================

// Home route with API documentation
app.get('/', (req, res) => {
  res.json({
    name: 'Book Info Service - Multi-Paradigm API',
    version: '2.0.0',
    paradigms: {
      rest: {
        description: 'Resource-oriented REST API',
        endpoints: [
          { method: 'GET', path: '/books', description: 'Get all books with filtering and pagination' },
          { method: 'GET', path: '/books/:id', description: 'Get specific book by ID' },
          { method: 'POST', path: '/books', description: 'Create new book' },
          { method: 'PUT', path: '/books/:id', description: 'Update entire book' },
          { method: 'DELETE', path: '/books/:id', description: 'Delete book' }
        ],
        examples: [
          'GET /books',
          'GET /books?author=Orwell&limit=5',
          'GET /books/1'
        ]
      },
      rpc: {
        description: 'Procedure-oriented RPC API',
        endpoints: [
          { method: 'POST', path: '/rpc', description: 'JSON-RPC 2.0 endpoint' },
          { method: 'POST', path: '/getBook', description: 'Legacy: Get book by ID' },
          { method: 'POST', path: '/createBook', description: 'Legacy: Create book' }
        ],
        examples: [
          'POST /rpc with body: { "method": "getBook", "params": { "id": 1 } }',
          'POST /rpc with body: { "method": "searchBooks", "params": { "query": "Gatsby" } }'
        ]
      },
      graphql: {
        description: 'GraphQL API with strongly typed schema',
        endpoint: '/graphql',
        features: ['Interactive GraphiQL interface', 'Queries', 'Mutations'],
        examples: [
          'query { book(id: 1) { title author year } }',
          'query { books(filter: { genre: "Fiction" }) { title author } }',
          'mutation { createBook(input: { title: "New Book", author: "John Doe" }) { id title } }'
        ]
      }
    },
    testing: {
      rest: 'curl http://localhost:3000/books',
      rpc: 'curl -X POST http://localhost:3000/rpc -H "Content-Type: application/json" -d \'{"method":"getBook","params":{"id":1},"id":1}\'',
      graphql: 'Open http://localhost:3000/graphql in browser for GraphiQL interface'
    }
  });
});


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('\n=================================');
  console.log('📚 Book Info Service - Multi-Paradigm API');
  console.log('=================================');
  console.log(`🌐 Server running on port ${PORT}`);
  console.log('\n📍 Available Paradigms:');
  console.log('---------------------------------');
  console.log(`📌 REST:   http://localhost:${PORT}/books`);
  console.log(`📌 RPC:    http://localhost:${PORT}/rpc`);
  console.log(`📌 GraphQL: http://localhost:${PORT}/graphql`);
  console.log('\n💡 Quick Test Commands:');
  console.log('---------------------------------');
  console.log(`REST:   curl http://localhost:${PORT}/books/1`);
  console.log(`RPC:    curl -X POST http://localhost:${PORT}/rpc -H "Content-Type: application/json" -d '{"method":"getBook","params":{"id":1}}'`);
  console.log(`GraphQL: curl -X POST http://localhost:${PORT}/graphql -H "Content-Type: application/json" -d '{"query":"{book(id:1){title author}}"}'`);
  console.log('\n✨ Documentation: http://localhost:3000/');
  console.log('=================================\n');
});
