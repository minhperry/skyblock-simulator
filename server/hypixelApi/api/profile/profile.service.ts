// import Hypixel from 'hypixel-api-reborn'

import {getPlayerByName} from '../player/player.service';
import {ProfileArraySchema, Profile, GameMode} from './profile.model';
import {HypixelApiError, ZodValidationError} from '../../../commons/error';
import {joinZodError} from '../../utils/zod';

function getAPIKey() {
  return process.env['HYPIXEL_API_KEY']!
}

/**
 * Fetches the profile list of a player by their name from the Hypixel API.
 * @param playerName - The name of the player.
 * @returns A promise that resolves to an array of profiles.
 * @throws {HypixelApiError} If there is an error fetching data from the Hypixel API.
 * @throws {ZodValidationError} If the response from the Hypixel API does not match the expected schema, or {@link getPlayerByName} fails.
 * @throws {DatabaseReadError} If there is an error reading the player data from the database.
 */
export async function getProfileList(playerName: string): Promise<Profile[]> {

  const player = await getPlayerByName(playerName)

  console.log(process.env['HYPIXEL_API_KEY'])

  const profileListResp =
    await fetch(`https://api.hypixel.net/v2/skyblock/profiles?uuid=${player.uuid}`, {
      headers: {
        'API-Key': getAPIKey()
      }
    })

  // Catch any Hypixel API errors
  if (profileListResp.status !== 200) {
    throw new HypixelApiError(
      'Error fetching data from Hypixel API',
      profileListResp.status,
      (await profileListResp.json()).cause
    )
  }

  const profileListJson = (await profileListResp.json()).profiles
  const validation = ProfileArraySchema.safeParse(profileListJson)

  if (!validation.success) {
    console.log('Zod error: =========================== \n', validation.error)
    throw new ZodValidationError(validation.error.message)
  }

  const validatedArray = validation.data

  const profileList: Profile[] = validatedArray.map(zodProfile => {
    return {
      profileId: zodProfile.profile_id,
      fruitName: zodProfile.cute_name,
      gameMode: zodProfile.game_mode as GameMode ?? 'normal',
      active: zodProfile.selected
    }
  })

  return profileList
}