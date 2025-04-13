import {Res, Req} from '../../utils/types';
import express from 'express';
import {getPlayerByName} from './player.service';
import {DatabaseReadError, MojangNotFoundError, ZodValidationError} from '../../../commons/error';
import {z} from 'zod';

export const $playerRouter = express.Router()

const PlayerParamSchema = z.string().min(1).max(16).regex(/^[a-zA-Z0-9_]+$/)

// Get name from uuid
$playerRouter.get('/name/:name', async (req: Req, res: Res) => {
  const playerName = req.params['name']

  const validation = PlayerParamSchema.safeParse(playerName)
  if (!validation.success) {
    res.status(400).json({
      error: 'Invalid player name format',
      message: validation.error.format()
    })
    return;
  }

  let player;
  try {
    player = await getPlayerByName(playerName)
  } catch (e) {
    if (e instanceof ZodValidationError || e instanceof MojangNotFoundError) {
      res.status(404).json({
        error: 'Player not found!',
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

  res.send({player})
})

// Get uuid from name
// $router.get('/player/uuid/:name')
