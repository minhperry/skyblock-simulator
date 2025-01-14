import express from "express";
import {profileCache} from "../../server";
import {Logger} from "../commons/logger";
import {getProfileData, returnProfiles} from "./dataManager";

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

  try {
    const profiles = await getProfileData(name);

    if (profiles.error) {
      res.status(404).json({error: 'Profiles not found'});
      return;
    }

    let result = returnProfiles(profiles)

    profileCache.set(`profile_${name}`, result, 60 * 60 * 24 * 14); // 14 days
    Logger.info(`Profile cache miss for ${name}, set cache`);

    res.json(result);
  } catch (error) {
    Logger.error(error);
    res.status(500).json({error: 'Failed to fetch profile'});
  }
}