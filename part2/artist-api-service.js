const http = require('http');
const { URL } = require('url');

const artists = [
  {
    artistName: 'Taylor Swift',
    artistGenre: 'Pop',
    albumsPublished: 10,
    artistUsername: 'taylorswift'
  },
  {
    artistName: 'Ed Sheeran',
    artistGenre: 'Pop',
    albumsPublished: 6,
    artistUsername: 'edsheeran'
  }
];

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost:8080');

  if (req.method === 'GET' && url.pathname === '/artists') {
    const offset = Number(url.searchParams.get('offset') || 0);
    const limit = Number(url.searchParams.get('limit') || 10);
    const start = offset * limit;
    const data = artists.slice(start, start + limit);

    return sendJson(res, 200, {
      data,
      pagination: {
        offset,
        limit,
        totalRecords: artists.length
      }
    });
  }

  if (req.method === 'GET' && url.pathname.startsWith('/artists/')) {
    const artistname = decodeURIComponent(url.pathname.replace('/artists/', ''));
    const artist = artists.find(
      (item) => item.artistName.toLowerCase() === artistname.toLowerCase()
    );

    if (!artist) {
      return sendJson(res, 404, { status: 404, message: 'Artist not found' });
    }

    return sendJson(res, 200, artist);
  }

  if (req.method === 'POST' && url.pathname === '/artists') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const newArtist = JSON.parse(body || '{}');

        if (
          !newArtist.artistName ||
          !newArtist.artistGenre ||
          newArtist.albumsPublished === undefined ||
          !newArtist.artistUsername
        ) {
          return sendJson(res, 400, {
            status: 400,
            message: 'Missing required artist fields'
          });
        }

        artists.push(newArtist);
        return sendJson(res, 201, newArtist);
      } catch (error) {
        return sendJson(res, 400, {
          status: 400,
          message: 'Invalid JSON payload'
        });
      }
    });

    return;
  }

  sendJson(res, 404, { status: 404, message: 'Route not found' });
});

server.listen(8080, () => {
  console.log('Artist API service running on port 8080');
});
