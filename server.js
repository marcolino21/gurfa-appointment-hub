const express = require('express');
const { createServer: createViteServer } = require('vite');
const path = require('path');

async function createServer() {
  const app = express();
  
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(vite.middlewares);

  // Serve static files from the dist directory in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
  }

  // Handle SPA routing
  app.get('*', (req, res, next) => {
    if (req.url.includes('.')) {
      next();
    } else {
      if (process.env.NODE_ENV === 'production') {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
      } else {
        res.sendFile(path.join(__dirname, 'index.html'));
      }
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

createServer(); 