import {getPlayerByName} from '../player/player.service';
import {GameMode, Profile, ProfileArraySchema} from './profile.model';
import {HypixelApiError, ZodValidationError} from '../../utils/error';
import log4js from 'log4js';

function getAPIKey() {
  return process.env['HYPIXEL_API_KEY']!
}

let L = log4js.getLogger('profile.service')

/**
 * Fetches the profile list of a player by their name from the Hypixel API.
 * @param playerName - The name of the player.
 * @returns A promise that resolves to an array of profiles.
 * @throws {HypixelApiError} If there is an error fetching data from the Hypixel API.
 * @throws {ZodValidationError} If the response from the Hypixel API does not match the expected schema, or {@link getPlayerByName} fails.
 * @throws {MojangNotFoundError} If the player is not found in the Mojang API.
 * @throws {DatabaseReadError} If there is an error reading the player data from the database.
 */
export async function getProfileList(playerName: string): Promise<Profile[]> {
  L.log(`Trying to fetch player ${playerName}'s profile list`)
  const player = await getPlayerByName(playerName)

  const profileListResp =
    await fetch(`https://api.hypixel.net/v2/skyblock/profiles?uuid=${player.uuid}`, {
      headers: {
        'API-Key': getAPIKey()
      }
    })

  // Catch any Hypixel API errors
  if (profileListResp.status !== 200) {
    const code = profileListResp.status
    const cause = (await profileListResp.json()).cause

    L.error(`Hypixel API returned error: ${code}, ${cause}`)
    throw new HypixelApiError('Error fetching data from Hypixel API', code, cause)
  }

  const profileListJson = (await profileListResp.json()).profiles
  const validation = ProfileArraySchema.safeParse(profileListJson)

  if (!validation.success) {
    L.error(`Hypixel API response does not match schema`)
    throw new ZodValidationError(validation.error.message)
  }

  const validatedArray = validation.data

  return validatedArray.map(zodProfile => {
    return {
      profileId: zodProfile.profile_id,
      fruitName: zodProfile.cute_name,
      gameMode: zodProfile.game_mode as GameMode ?? 'normal',
      active: zodProfile.selected
    }
  })
}