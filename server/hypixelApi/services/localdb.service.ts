import {LocalPlayerDAO, Player} from '../api/player/player.model';
import {ItemNotFoundError} from '../utils/error';
import {getLogger} from '../utils/logger';
import {JSONFilePreset} from 'lowdb/node';

const logger = getLogger('services/localdb.service')

const defaultData: { players: LocalPlayerDAO[] } = {players: []}
const DB = await JSONFilePreset('players.json', defaultData)

/**
 * Saves a player to local db.
 * @param player the player to save
 */
export async function savePlayer(player: Player): Promise<void> {
  try {
    logger.log(`Saving player ${player.username} to DB...`)
    const playerDAO = player.asLDAO()
    DB.data.players.push(playerDAO)
  } catch (e) {
    logger.error('Error saving player:', e)
  }
}

/**
 * Get a player by name from Local Database.
 * @param playerName the name of the player to fetch
 * @throws {ItemNotFoundError} if the player is not found in the database
 */
export function getPlayerByNameFromDB(playerName: string): Player {
  logger.log(`Getting player ${playerName} from DB...`)
  const {players} = DB.data

  // Query the database for the player by username
  const foundPlayer = players.find((pDAO) => pDAO.username === playerName)

  if (!foundPlayer) {
    logger.log(`Player ${playerName} not found in DB`)
    throw new ItemNotFoundError(`with name ${playerName}`)
  }

  return foundPlayer.asPlayer()
}

/**
 * Get a player by UUID from Database.
 * @param uuid the UUID of the player to fetch
 * @throws {ItemNotFoundError} if the uuid is not found in the database
 */
export function getPlayerByUuidFromDB(uuid: string): Player {
  logger.info(`Getting player with UUID ${uuid} from DB...`)
  const {players} = DB.data

  // Query the database for the player by UUID
  const foundPlayer = players.find((pDAO) => pDAO.uuid === uuid)

  if (!foundPlayer) {
    logger.log(`Player with UUID ${uuid} not found in DB`)
    throw new ItemNotFoundError(`with UUID ${uuid}`)
  }

  return foundPlayer.asPlayer()
}