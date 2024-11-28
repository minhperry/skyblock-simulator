import express from "express";
import {profileCache} from "../../server";
import {Logger} from "../commons/logger";
import {getProfileData, returnProfiles} from "./dataManager";
import {DAY} from "../commons/time";
import {RequestError, ErrorPayload} from "../commons/error";

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

  const cachedProfile = profileCache.get(`profile_${name}`);
  if (cachedProfile) {
    Logger.info(`Profile cache hit for ${name}`);
    res.json(cachedProfile);
    return;
  }

  const profiles = await getProfileData(name);
  if (!profiles) {
    return E.error(404, ErrorPayload.PLAYER_NOT_FOUND)
  }

  let result = returnProfiles(profiles)

  // 1 day profile cache
  profileCache.set(`profile_${name}`, result, DAY);
  Logger.info(`Profile cache miss for ${name}, set cache`);

  res.json(result);
}
