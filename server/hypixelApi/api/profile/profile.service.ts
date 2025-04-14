import Hypixel from 'hypixel-api-reborn'
import {HOUR_MS} from '../../../commons/time';

const HYPIXEL_API_KEY = process.env['HYPIXEL_API_KEY']!

const $hypixel = new Hypixel.Client(HYPIXEL_API_KEY, {cache: true, cacheTime: 4 * HOUR_MS})


export async function getProfileList(playerName: string) {
  const profilesProm = await $hypixel.getSkyblockProfiles(playerName)
  console.log(profilesProm)
}