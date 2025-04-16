import {LocalPlayerDAO, Player} from '../api/player/player.model';
import {ItemNotFoundError} from '../utils/error';
import {getLogger} from '../utils/logger';
import {JSONFilePreset} from 'lowdb/node';
import {Low} from 'lowdb';

/**
 * This is a class that manages a local database for storing player data.
 */
export class LocalDatabaseService {
  private logger = getLogger('services/localdb.service')
  private DB: Low<{ players: LocalPlayerDAO[] }>

  constructor() {
    this.defineDatabase().then(
      lw => this.DB = lw
    );
    this.logger.level = 'debug'
  }

  private async defineDatabase() {
    const defaultData: { players: LocalPlayerDAO[] } = {players: []}
    return await JSONFilePreset('players.json', defaultData)
  }

  /**
   * Saves a player to local db.
   * @param player the player to save
   */
  savePlayer(player: Player) {
    logger.log(`Saving player ${player.username} to DB...`)
    const playerDAO = player.asLDAO()
    DB.data.players.push(playerDAO)
  }

  /**
   * Get a player by name from local database.
   * @param playerName the name of the player to fetch
   */
  getPlayerByName(playerName: string): Player {
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
   * Get a player by UUID from local database.
   * @param uuid the UUID of the player to fetch
   */
  getPlayerByUuid(uuid: string): Player {
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
}