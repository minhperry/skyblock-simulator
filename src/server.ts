import { APP_BASE_HREF } from '@angular/common';
import {CommonEngine} from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';
import skycryptRouter from "./server/skycryptApi";
import NodeCache from "node-cache";
import {MINUTE, MINUTE_MS} from "./server/commons/time";
import rateLimit from "express-rate-limit";
import {ErrorPayload, RequestError} from "./server/commons/error";

// Profile data cache check every 5min.
export const v1cache = new NodeCache({checkperiod: 5 * MINUTE});

export const skycryptEndpoint = 'https://sky.shiiyu.moe/api/v2';

export const hypixelEndpoint = 'https://api.hypixel.net';


export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.use('/api/v1', skycryptRouter);
  server.use('/api/v1', rateLimit({
    windowMs: 15 * MINUTE_MS,
    limit: 1,
    handler: (req: express.Request, res: express.Response) => {
      return new RequestError(res).error(429, ErrorPayload.RATE_LIMITED);
    },
    standardHeaders: 'draft-7'
  }))

  // Serve static files from /browser
  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }));

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const {protocol, originalUrl, baseUrl, headers} = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          { provide: 'REQUEST', useValue: req },
          { provide: 'RESPONSE', useValue: res },
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
