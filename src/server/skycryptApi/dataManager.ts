import {profileCache, profileDataCache, skycryptEndpoint} from "../../server";
import {Logger} from "../commons/logger";
import {HOUR, MINUTE} from "../commons/time";

// TODO: Save all in one single cache (like how it should be used...)
// TODO 2: Rate limit

// 5min cache of profile data
export async function getProfileData(name: string) {
  let profiles: any = profileDataCache.get(`profile_data_${name}`);
  if (!profiles) {
    profiles = await getSkycryptProfiles(name);
    if (!profiles) return undefined;
    Logger.info(`Profile data cache miss for ${name}`);
    profileDataCache.set(`profile_data_${name}`, profiles, 5 * MINUTE); // 5min
  } else {
    Logger.info(`Profile data cache hit for ${name}`);
  }
  return profiles;
}

// Fetch profile data from skycrypt
// If name doesn't exist, cache for 6 hrs
async function getSkycryptProfiles(name: string) {
  const response = await fetch(skycryptEndpoint + `/profile/${name}`);
  const ret = await response.json();
  if (ret.error) {
    Logger.error(`Error fetching profile data for ${name}: ${ret.error}`);
    profileCache.set(`profile_${name}`, undefined, 6 * HOUR); // 6hrs
    return undefined;
  }
  return ret;
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
  if (!profiles) return undefined;
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