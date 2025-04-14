import express from 'express';
import {Req, Res} from './utils/types';
import {$playerRouter} from './api/player/player.controller';
import {$profileRouter} from './api/profile/profile.controller';

// Main backend router
export const $router = express.Router()
$router.get('/', (req: Req, res: Res) => {
  res.send('Hello from the outside!')
})

$router.use('/player', $playerRouter)

$router.use('/profile', $profileRouter)

