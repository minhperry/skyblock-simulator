import express from "express";
import profilesHandler from "./handler";

const skycryptRouter = express.Router();
 
skycryptRouter.get('/profiles/:name', profilesHandler);

skycryptRouter.get('**', (req: express.Request, res: express.Response) => {
  res.status(404).json({error: 'Route not found'});
});

export default skycryptRouter;