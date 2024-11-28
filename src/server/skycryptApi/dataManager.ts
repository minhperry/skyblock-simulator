import {profileDataCache, skycryptEndpoint} from "../../server";
import {Logger} from "../commons/logger";

export async function getProfileData(name: string) {
  let profiles: any = profileDataCache.get(`profile_data_${name}`);
  if (!profiles) {
    Logger.info(`Profile data cache miss for ${name}`);
    profiles = await getSkycryptProfiles(name);
    profileDataCache.set(`profile_data_${name}`, profiles, 60 * 5); // 5min
  } else {
    Logger.info(`Profile data cache hit for ${name}`);
  }
  return profiles;
}

async function getSkycryptProfiles(name: string) {
  const response = await fetch(skycryptEndpoint + `/profile/${name}`);
  return await response.json();
}

export function returnProfiles(profiles: Profiles): ReturnProfileData[] {
  return Object.values(profiles.profiles).map((profile: Profile) => ({
    profileId: profile.profile_id,
    profileName: profile.cute_name,
    gameMode: profile.game_mode as GameMode,
    current: profile.current,
  }));
}

export function findProfile(profiles: any, profileName: string) {
  return Object.values(profiles.profiles).find((profile: any) => profile.cute_name === profileName);
}

interface ReturnProfileData {
  profileId: string,
  profileName: string,
  gameMode: GameMode,
  current: boolean,
}

interface Profiles {
  profiles: {
    [key: string]: Profile,
  }
}

export interface Profile {
  profile_id: string,
  cute_name: string,
  game_mode: string,
  current: boolean,
}

export type GameMode = 'normal' | 'ironman' | 'bingo' | 'stranded';