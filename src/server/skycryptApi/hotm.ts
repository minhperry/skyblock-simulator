import express from "express";
import {findProfile, getProfileData, Profile} from "./dataManager";

import {ErrorPayload, RequestError} from "../commons/error";

// /api/v1/hotm/:name/:profile
export default async function hotmHandler(req: express.Request, res: express.Response) {
  const {name, profile} = req.params;
  const E = new RequestError(res);

  if (!/^[a-zA-z0-9_]+$/.test(name)) {
    return E.error(400, ErrorPayload.MALFORMED_NAME)
  }

  if (name.length > 16) {
    return E.error(400, ErrorPayload.NAME_TOO_LONG)
  }

  const profileData = await getProfileData(name);
  if (!profileData) {
    return E.error(404, ErrorPayload.PLAYER_NOT_FOUND)
  }

  if (!possibleProfileNames.includes(profile)) {
    return E.error(400, ErrorPayload.INVALID_PROFILE)
  }

  const foundProfile: unknown = findProfile(profileData, profile)
  if (!foundProfile) {
    return E.error(404, ErrorPayload.PROFILE_NOT_FOUND)
  }

  const hotmData = (foundProfile as ProfileStructure).data.mining.core;
  res.status(200).json({
    level: {
      xp: hotmData.level.xp,
      level: hotmData.level.level
    },
    tokens: hotmData.tokens,
    powder: hotmData.powder,
    nodes: hotmData.nodes
  });
}

const possibleProfileNames = [
  "Apple", "Banana", "Blueberry", "Cucumber", "Coconut",
  "Grapes", "Kiwi", "Lemon", "Lime", "Mango", "Orange",
  "Papaya", "Pineapple", "Peach", "Pear", "Pomegranate",
  "Raspberry", "Strawberry", "Watermelon", "Tomato", "Zucchini",
];

interface ProfileStructure extends Profile {
  data: TheDataStructure,
  raw: unknown
}

interface TheDataStructure {
  mining: {
    core: {
      level: {
        xp: number,
        level: number,
      },
      tokens: TotalSpentAvailable,
      powder: {
        mithril: TotalSpentAvailable,
        gemstone: TotalSpentAvailable,
        glacite: TotalSpentAvailable
      },
      nodes: Record<string, number | boolean>
    }
  }
}

interface TotalSpentAvailable {
  total: number,
  spent: number,
  available: number
}