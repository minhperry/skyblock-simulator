import express from "express";
import profilesHandler from "./profiles";
import hotmHandler from "./hotm";
import {RequestError, ErrorPayload} from "../commons/error";

const skycryptRouter = express.Router();
 
skycryptRouter.get('/profiles/:name', profilesHandler);

skycryptRouter.get('/hotm/:name/:profile', hotmHandler)

skycryptRouter.get('**', (req: express.Request, res: express.Response) => {
  new RequestError(res).error(400, ErrorPayload.ROUTE_NOT_FOUND);
});

export default skycryptRouter;