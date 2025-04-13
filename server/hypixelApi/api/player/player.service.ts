import axios from 'axios';
import {Player, PlayerResponse, PlayerSchema} from './player.model';
import {savePlayer} from '../../appwrite/appwrite.service';

const MOJANG_API_URL = 'https://api.minecraftservices.com/minecraft/profile/lookup/name/'

export async function getPlayerByNameFromAPI(playerName: string): Promise<Player> {
  // Get player data from Mojang API
  const resp = await axios.get<PlayerResponse>(`${MOJANG_API_URL}${playerName}`)
  const player = resp.data

  // Validate with Zod
  const validation = PlayerSchema.safeParse({
    uuid: player.id,
    username: playerName
  })
  if (!validation.success) {
    throw new Error(validation.error.message)
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
