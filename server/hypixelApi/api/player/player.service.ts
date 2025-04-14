import axios from 'axios';
import {Player, PlayerResponse, PlayerSchema} from './player.model';
import {getPlayerByNameFromDB, savePlayer} from '../../appwrite/player.service';
import {MojangNotFoundError, ZodValidationError} from '../../../commons/error';
import {joinZodError} from '../../utils/zod';

const MOJANG_API_URL = 'https://api.minecraftservices.com/minecraft/profile/lookup/name/'

/**
 * Fetch player data from Mojang API
 * @param playerName the name of the player to fetch
 * @returns the player data of type Player
 * @throws ZodValidationError if the player data is not valid. (aka non-200 responses)
 */
async function getPlayerByNameFromAPI(playerName: string): Promise<Player> {
  console.log(`Calling Mojang API for player ${playerName}...`)
  // Get player data from Mojang API
  const resp = await fetch(`${MOJANG_API_URL}${playerName}`)

  if (resp.status !== 200) {
    throw new MojangNotFoundError('Player not found on Mojang API!')
  }

  const player = (await resp.json()) as PlayerResponse

  // Validate with Zod
  const validation = PlayerSchema.safeParse({
    uuid: player.id,
    username: player.name
  })

  // Either this or MojangNotFoundError only, since non-200 would just trigger failed validation
  if (!validation.success) {
    throw new ZodValidationError(joinZodError(validation.error))
  }

  // Save to database
  const validatedPlayer = validation.data

  const playerData: Player = {
    uuid: validatedPlayer.uuid,
    username: validatedPlayer.username
  }

  await savePlayer(playerData)

  return playerData
}

/**
 * Get a player by name. Will first check in the Appwrite DB, and if not found, will fetch from Mojang API.
 * @param playerName the player name to fetch
 * @returns the player data
 * @throws ZodValidationError if the player data from Mojang API is not valid
 * @throws DatabaseReadError if there is an error reading from the database
 */
export async function getPlayerByName(playerName: string): Promise<Player> {
  // First get player data from Appwrite DB
  const playerFromDB = await getPlayerByNameFromDB(playerName)

  // If player is not found in DB, get from Mojang API
  if (!playerFromDB) {
    console.log(`Name ${playerName} not found in DB, fetching from Mojang API...`)

    return await getPlayerByNameFromAPI(playerName)
  }

  // If player is found in DB, return it
  return playerFromDB
}
