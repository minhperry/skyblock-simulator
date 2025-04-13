import express from 'express';
import {$router} from '../server/hypixelApi';
import {Req, Res} from '../server/hypixelApi/utils/types';

export function app(): express.Express {
  const server = express();

  server.use('/api/v2', $router)
  server.get('/', (req: Req, res: Res) => {
    res.send({rootIs: 'active'})
  })

  return server
}

function run(): void {
  const port = process.env['PORT'] || 4200;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run()