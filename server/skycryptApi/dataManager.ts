import {v1cache, skycryptEndpoint} from '../../src/server';
import {Logger} from "../commons/logger";
import {MINUTE} from "../commons/time";

// 5min cache of profile data
export async function getProfileData(name: string) {
  const cached: Profiles | undefined = v1cache.get(`profile_${name}`);
  if (cached !== undefined) {
    Logger.info(`Profile list cache hit for ${name}`);
    return cached;
  }

  const profiles = await getSkycryptProfiles(name);
  Logger.info(`Asked Skycrypt for profile data for ${name}`);
  if (!profiles) return undefined;

  v1cache.set(`profile_${name}`, profiles, 5 * MINUTE);
  Logger.info(`Profile list cache miss for ${name}, set cache.`);
  return profiles;
}

// Fetch profile data from skycrypt
// If name doesn't exist, cache for 6 hrs
async function getSkycryptProfiles(name: string): Promise<Profiles | undefined> {
  const response = await fetch(skycryptEndpoint + `/profile/${name}`);
  const ret = await response.json();

  if (ret.error) {
    Logger.error(`Error fetching profile data for ${name}: ${ret.error}`);
    v1cache.set(`profile_${name}`, undefined, 5 * MINUTE);
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

export function findProfile(profiles: Profiles, profileName: string): Profile | undefined {
  if (!profiles) return undefined;
  return Object.values(profiles.profiles).find((profile: Profile) => profile.cute_name === profileName);
}

interface ReturnProfileData {
  profileId: string,
  profileName: string,
  gameMode: GameMode,
  current: boolean,
}

interface Profiles {
  profiles: Record<string, Profile>
}

export interface Profile {
  profile_id: string,
  cute_name: string,
  game_mode: string,
  current: boolean,
}

export type GameMode = 'normal' | 'ironman' | 'bingo' | 'stranded';