import {Player, PlayerResponse, PlayerSchema} from './player.model';
import {getPlayerByNameFromDB, savePlayer} from '../../appwrite/player.service';
import {MojangNotFoundError, ZodValidationError} from '../../utils/error';
import {joinZodError} from '../../utils/zod';
import {getLogger} from '../../utils/logger';

const MOJANG_API_URL = 'https://api.minecraftservices.com/minecraft/profile/lookup/name/'

const logger = getLogger('player.service')
logger.level = 'debug'

/**
 * Fetch player data from Mojang API
 * @param playerName the name of the player to fetch
 * @returns the player data of type Player
 * @throws ZodValidationError if the player data is not valid. (aka non-200 responses)
 * @throws MojangNotFoundError if the player is not found in the Mojang API
 */
async function getPlayerByNameFromAPI(playerName: string): Promise<Player> {
  logger.log(`Calling Mojang API for player ${playerName}...`)
  // Get player data from Mojang API
  const resp = await fetch(`${MOJANG_API_URL}${playerName}`)

  if (resp.status !== 200) {
    logger.error(`Name ${playerName} not found in Mojang API!`)
    throw new MojangNotFoundError('Player not found on Mojang API!')
  }

  logger.log(`Trying to validate Mojang API response`)
  const player = (await resp.json()) as PlayerResponse
  // Validate with Zod
  const validation = PlayerSchema.safeParse({
    uuid: player.id,
    username: player.name
  })

  // Either this or MojangNotFoundError only, since non-200 would just trigger failed validation
  if (!validation.success) {
    logger.error(`Player ${playerName} does not match schema`)
    throw new ZodValidationError(joinZodError(validation.error))
  }

  // Save to database
  const validatedPlayer = validation.data

  const playerData: Player = new Player(validatedPlayer.uuid, validatedPlayer.username)

  await savePlayer(playerData)

  logger.log(`Player ${playerName} returned`)
  return playerData
}

/**
 * Get a player by name. Will first check in the Appwrite DB, and if not found, will fetch from Mojang API.
 * @param playerName the player name to fetch
 * @returns the player data
 * @throws ZodValidationError if the player data from Mojang API is not valid
 * @throws DatabaseReadError if there is an error reading from the database
 * @throws MojangNotFoundError if the player is not found in the Mojang API
 */
export async function getPlayerByName(playerName: string): Promise<Player> {
  // First get player data from Appwrite DB
  const playerFromDB = await getPlayerByNameFromDB(playerName)

  // If player is not found in DB, get from Mojang API
  if (!playerFromDB) {
    logger.log(`Name ${playerName} not found in DB, fetching from Mojang API...`)

    return await getPlayerByNameFromAPI(playerName)
  }

  // If player is found in DB, return it
  return playerFromDB
}
