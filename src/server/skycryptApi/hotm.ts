import express from "express";
import {findProfile, getProfileData, Profile} from "./dataManager";
import {Debugger} from "../commons/logger";

// /api/v1/hotm/:name/:profile
export default async function hotmHandler(req: express.Request, res: express.Response) {
  const {name, profile} = req.params;

  Debugger.debug(`Requesting HOTM for ${name} ${profile}`);

  if (!/^[a-zA-z0-9_]+$/.test(name)) {
    res.status(400).json({error: 'Malformed name!'});
    return;
  }

  if (name.length > 16) {
    res.status(400).json({error: 'Invalid name!'});
    return;
  }

  if (!possibleProfileNames.includes(profile)) {
    res.status(400).json({error: 'Invalid profile!'});
    return;
  }

  const profileData = await getProfileData(name);

  const foundProfile: any = findProfile(profileData, profile)
  if (!foundProfile) {
    res.status(404).json({error: 'Profile not found'});
    return;
  }

  let hotmData = (foundProfile as ProfileStructure).data.mining.core;
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
  raw: any
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
      nodes: {
        [key: string]: number | boolean
      }
    }
  }
}

interface TotalSpentAvailable {
  total: number,
  spent: number,
  available: number
}