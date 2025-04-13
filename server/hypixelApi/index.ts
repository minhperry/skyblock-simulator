import {Client, Databases} from 'appwrite';
import express from 'express';
import {Req, Res} from './utils/types';
import {$playerRouter} from './api/player/player.controller';

// Appwrite client
export const $client = new Client();
$client
  .setProject('67face2d002b747386e4')
  .setEndpoint('https://cloud.appwrite.io/v1')

// DB stuffs
export const $db = new Databases($client)
export const $dbId = 'hypixel'

// Main backend router
export const $router = express.Router()
$router.get('/', (req: Req, res: Res) => {
  res.send('Hello from the outside!')
})

$router.use('/player', $playerRouter)

