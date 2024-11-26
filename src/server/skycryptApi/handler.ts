import express from "express";


// /api/v1/profiles/:name
export default function profilesHandler(res: express.Response, req: express.Request) {
  const {name} = req.params;
  res.json({name});
  return
}