import {Res, Req} from '../../utils/types';
import {getPlayerByName} from '../../appwrite/appwrite.service';
import express from 'express';

export const $playerRouter = express.Router()

// Get name from uuid
$playerRouter.get('/name/:uuid', async (req: Req, res: Res) => {
  const {playerName} = req.params

})

// Get uuid from name
// $router.get('/player/uuid/:name')

// Test
$playerRouter.get('/test', async (req: Req, res: Res) => {
  res.send(getPlayerByName('Notch'))
  console.log('Test')
  res.send('Test')
})
