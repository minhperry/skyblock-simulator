import {Player} from '../api/player/player.model';
import {AppwriteException, Client, Databases, Query} from 'node-appwrite';
import {DatabaseReadError} from '../../commons/error';

// Appwrite client
const $client = new Client();
$client
  .setKey(process.env['APPWRITE_DB_KEY']!)
  .setProject('67face2d002b747386e4')

// DB stuffs
const $dbId = 'hypixel-db'
const DB = new Databases($client)

export async function savePlayer(player: Player): Promise<void> {
  try {
    await DB.createDocument(
      $dbId, // database ID
      'player', // collection ID
      player.uuid, // document ID, unique for each player
      player // document data
    )
    console.log('Player saved successfully:', player)
  } catch (e) {
    console.error('Error saving player:', e)
  }
}

/**
 * Get a player by name from Appwrite Database.
 * @param playerName the name of the player to fetch
 * @returns {`null`} if the player is not found, else returns the player data
 * @throws {DatabaseReadError} if there is an error reading from the database
 */
export async function getPlayerByNameFromDB(playerName: string): Promise<Player | null> {
  try {
    console.log(`Getting player ${playerName} from DB...`)

    // Query the database for the player by username
    const resp = await DB.listDocuments(
      $dbId,
      'player',
      [
        Query.equal('username', playerName)
      ]
    )

    // If not found, return null
    if (resp.documents.length === 0) {
      return null
    }

    // If found, return the player data
    const playerDoc = resp.documents[0] as unknown as Player;
    return {
      uuid: playerDoc.uuid,
      username: playerDoc.username
    }
  } catch (e: unknown) {
    if (e instanceof AppwriteException) {
      console.error('Appwrite error:', e.message)
    }
    throw new DatabaseReadError('Error reading from Appwrite database')
  }
}