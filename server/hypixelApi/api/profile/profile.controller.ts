import express from 'express';
import {Req, Res} from '../../utils/types';
import {getProfileList} from './profile.service';

export const $profileRouter = express.Router()

$profileRouter.get('/list/:name', (req: Req, res: Res) => {
  const playerName = req.params['name']

  getProfileList(playerName).then()

  res.send('H')
})