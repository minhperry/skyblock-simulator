import express from 'express';
import {Req, Res} from '../../utils/types';
import {getProfileList} from './profile.service';
import {DatabaseReadError, HypixelApiError, MojangNotFoundError, ZodValidationError} from '../../utils/error';

export const $profileRouter = express.Router()

/**
 * @openapi
 * /profile/list/{name}:
 *   get:
 *     summary: Get SkyBlock profiles of a player
 *     description: Fetches all SkyBlock profiles associated with a player name from the Hypixel API.
 *     tags:
 *       - Profiles
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         description: Minecraft username of the player
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 16
 *           pattern: '^[a-zA-Z0-9_]+$'
 *           example: Technoblade
 *     responses:
 *       200:
 *         description: List of SkyBlock profiles for the player
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   profileId:
 *                     type: string
 *                     example: "95bb24bd-73f6-427d-b35c-248295674ba1"
 *                   fruitName:
 *                     type: string
 *                     example: "Papaya"
 *                   gameMode:
 *                     type: string
 *                     enum: [normal, ironman, bingo, stranded]
 *                     example: "ironman"
 *                   active:
 *                     type: boolean
 *                     example: false
 *       404:
 *         description: Player not found in Mojang
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Player not found
 *                 message:
 *                   type: string
 *                   example: Could not resolve player UUID
 *       500:
 *         description: Failed to fetch data or internal error
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: Failed to fetch data from Hypixel API
 *                     message:
 *                       type: object
 *                       properties:
 *                         hypixelStatus:
 *                           type: number
 *                           example: 503
 *                         hypixelMessage:
 *                           type: string
 *                           example: "Service Unavailable"
 *                 - type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: Data from Hypixel API did not match expected schema
 *                     message:
 *                       type: string
 *                       example: "Invalid enum value"
 *                 - type: object
 *                   properties:
 *                     error:
 *                       type: string
 *                       example: Internal error
 *                     message:
 *                       type: string
 *                       example: "Database connection failed"
 */
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
    } else if (e instanceof MojangNotFoundError) {
      res.status(404).json({
        error: 'Player not found',
        message: e.message
      })
    }

    return;
  }


  res.status(200).json(profileList)
})