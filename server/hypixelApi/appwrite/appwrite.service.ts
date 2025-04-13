import {$db, $dbId} from '../index';
import {Player} from '../api/player/player.model';
import {Query} from 'appwrite';

const DB = $db

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

export async function getPlayerByName(playerName: string) {//: Promise<Player | null> {
  try {
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
    console.log(resp.documents)
    return null
    // If found, return the player data
  } catch (e) {
    console.log('Error getting player from database: ', e)
    return null
  }
}