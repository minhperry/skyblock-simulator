import express from "express";
import {skycryptEndpoint, v1cache} from "../../server";
import {Logger} from "../commons/logger";

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

  const cachedProfile = v1cache.get(`profile_${name}`);
  if (cachedProfile) {
    Logger.info('Cache hit for', name);
    res.json(cachedProfile);
    return;
  }

  try {
    let result = 0 // await getSkycryptProfiles(name);
    await returnProfiles(name);


    v1cache.set(`profile_${name}`, result);
    Logger.info('Cache miss for', name, ', set cache');

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Failed to fetch profile'});
  }
}

async function getSkycryptProfiles(name: string) {
  const response = await fetch(skycryptEndpoint + `/profile/${name}`);
  return await response.json();
}

async function returnProfiles(name: string) {
  const response = await getSkycryptProfiles(name);
  Logger.debug(response.profiles)
}