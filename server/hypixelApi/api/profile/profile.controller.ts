import express from 'express';
import {Req, Res} from '../../utils/types';
import {getProfileList} from './profile.service';
import {DatabaseReadError, HypixelApiError, ZodValidationError} from '../../utils/error';

export const $profileRouter = express.Router()

$profileRouter.get('/list/:name', async (req: Req, res: Res) => {
  const playerName = req.params['name']

  let profileList;

  try {
    profileList = await getProfileList(playerName)
  } catch (e) {
    if (e instanceof HypixelApiError) {
      res.status(500).json({
        error: 'Failed to fetch data from Hypixel API',
        message: {
          hypixelStatus: e.responseCode,
          hypixelMessage: e.message
        }
      })
    } else if (e instanceof ZodValidationError) {
      res.status(500).json({
        error: 'Data from Hypixel API did not match expected schema',
        message: e.message
      })
    } else if (e instanceof DatabaseReadError) {
      res.status(500).json({
        error: 'Internal error',
        message: e.message
      })
    }

    return;
  }


  res.status(200).json(profileList)
})