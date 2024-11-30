import express from "express";
import {getProfileData, returnProfiles} from "./dataManager";
import {DAY} from "../commons/time";
import {RequestError, ErrorPayload} from "../commons/error";
import {v1cache} from "../../server";

// /api/v1/profiles/:name
export default async function profilesHandler(req: express.Request, res: express.Response) {
  const {name} = req.params;
  const E = new RequestError(res)

  if (!/^[a-zA-z0-9_]+$/.test(name)) {
    return E.error(400, ErrorPayload.MALFORMED_NAME)
  }

  if (name.length > 16) {
    return E.error(400, ErrorPayload.NAME_TOO_LONG)
  }

  const profiles = await getProfileData(name);
  if (!profiles) {
    return E.error(404, ErrorPayload.PLAYER_NOT_FOUND)
  }

  let result = returnProfiles(profiles)

  // 1 day profile cache
  v1cache.set(`profile_${name}`, result, DAY);

  res.json(result);
}
