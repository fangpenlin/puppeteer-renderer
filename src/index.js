'use strict';

const { URLSearchParams } = require('url');
const express = require('express');
const createRenderer = require('./renderer');

const port = process.env.PORT || 3000;
const baseURL = process.env.BASE_URL || 'http://localhost:3000/'
const pageWidth = parseInt(process.env.PAGE_WIDTH || '600')
const pageHeight = parseInt(process.env.PAGE_HEIGHT || '314')

const app = express();

let renderer = null;

// Configure.
app.disable('x-powered-by');

// Render url.
app.use(async (req, res, next) => {
  const urlParams = new URLSearchParams()
  for (const key in req.query) {
    const value = req.query[key]
    urlParams.set(key, value)
  }
  urlParams.set('__render__', '1')
  const query = urlParams.toString()

  try {
    const image = await renderer.screenshot(
      baseURL + '?' + query,
      pageWidth,
      pageHeight
    );
    res.set('Content-type', 'image/png').send(image);
  } catch (e) {
    next(e);
  }
});

// Error page.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Oops, An expected error seems to have occurred.');
});

// Create renderer and start server.
createRenderer().then((createdRenderer) => {
  renderer = createdRenderer;
  console.info('Initialized renderer.');

  app.listen(port, () => {
    console.info(`Listen port on ${port}.`);
  });
}).catch((e) => {
  console.error('Fail to initialze renderer.', e);
});
