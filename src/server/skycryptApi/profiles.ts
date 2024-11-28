import express from "express";
import {profileCache} from "../../server";
import {Logger} from "../commons/logger";
import {getProfileData, returnProfiles} from "./dataManager";
import {DAY} from "../commons/time";

// /api/v1/profiles/:name
export default async function profilesHandler(req: express.Request, res: express.Response) {
  const {name} = req.params;
  if (!/^[a-zA-z0-9_]+$/.test(name)) {
    res.status(400).json({error: 'Malformed name!'});
    return;
  }

  if (name.length > 16) {
    res.status(400).json({error: 'Invalid name!'});
    return;
  }

  const cachedProfile = profileCache.get(`profile_${name}`);
  if (cachedProfile) {
    Logger.info(`Profile cache hit for ${name}`);
    res.json(cachedProfile);
    return;
  }

  const profiles = await getProfileData(name);
  if (!profiles) {
    res.status(404).json({error: 'Player not found'});
    return;
  }

  let result = returnProfiles(profiles)

  // 1 day profile cache
  profileCache.set(`profile_${name}`, result, DAY);
  Logger.info(`Profile cache miss for ${name}, set cache`);

  res.json(result);
}
