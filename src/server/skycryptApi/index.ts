import express from "express";
import profilesHandler from "./handler";

const router = express.Router();

router.get('/profiles/:name', profilesHandler);

export const skycryptRouter = router;