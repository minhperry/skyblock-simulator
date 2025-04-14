import {Res, Req} from '../../utils/types';
import express from 'express';
import {getPlayerByName} from './player.service';
import {
  DatabaseEntryNotFoundError,
  DatabaseReadError,
  MojangNotFoundError,
  ZodValidationError
} from '../../utils/error';
import {z} from 'zod';
import {joinZodError} from '../../utils/zod';
import {getPlayerByUuidFromDB} from '../../appwrite/player.service';

export const $playerRouter = express.Router()

// Get player by name
const PlayerParamSchema = z.string()
  .min(1, 'Player name must be at least 1 character long')
  .max(16, 'Player name must be at most 16 characters long')
  .regex(/^[a-zA-Z0-9_]+$/, 'Player name must only contain alphanumeric characters and underscores')

/**
 * @openapi
 * /player/name/{name}:
 *   get:
 *     summary: Get player by name.
 *     description: Fetches player data from the Mojang API using a Minecraft username.
 *     tags:
 *       - Player
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         description: The Minecraft username to look up.
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 16
 *           pattern: '^[a-zA-Z0-9_]+$'
 *           example: "Notch"
 *     responses:
 *       200:
 *         description: Player data successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uuid:
 *                   type: string
 *                   description: The player's UUID.
 *                   example: "b876ec32e396476ba1158438d83c67d4"
 *                 username:
 *                   type: string
 *                   description: The player's Minecraft username.
 *                   example: "Technoblade"
 *       400:
 *         description: Invalid player name format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid player name format"
 *                 message:
 *                   type: string
 *                   example: "Player name must only contain alphanumeric characters and underscores"
 *       404:
 *         description: Player not found (invalid name or Mojang API error).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Player not found"
 *                 message:
 *                   type: string
 *                   example: "Player with the given name could not be found in Mojang's database"
 *       500:
 *         description: Internal server error (e.g., DB failure).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal error"
 *                 message:
 *                   type: string
 *                   example: "Error reading data from the database"
 */
$playerRouter.get('/name/:name', async (req: Req, res: Res) => {
  const playerName = req.params['name']

  const validation = PlayerParamSchema.safeParse(playerName)
  if (!validation.success) {
    res.status(400).json({
      error: 'Invalid player name format',
      message: joinZodError(validation.error)
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

  res.send(player)
})

// Get player by uuid
const PlayerUuidParamSchema = z.string()
  .length(32, 'UUID must be exactly 32 characters long')
  .regex(/^[a-fA-F0-9]+$/, 'UUID must only contain alphanumeric characters')
/**
 * @openapi
 * /player/uuid/{uuid}:
 *   get:
 *     summary: Get player by UUID.
 *     description: Fetches player data by UUID, exclusively from the database. The UUID can be dashed or non-dashed.
 *     tags:
 *       - Player
 *     parameters:
 *       - name: uuid
 *         in: path
 *         required: true
 *         description: The player's UUID to look up. Can be dashed or non-dashed.
 *         schema:
 *           type: string
 *           minLength: 32
 *           maxLength: 36
 *           pattern: '^[a-f0-9\-]+$'  # Allows dashed or non-dashed UUID
 *           example: "b876ec32e396476ba1158438d83c67d4"
 *     responses:
 *       200:
 *         description: Player data successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uuid:
 *                   type: string
 *                   description: The player's UUID.
 *                   example: "b876ec32e396476ba1158438d83c67d4"
 *                 username:
 *                   type: string
 *                   description: The player's Minecraft username.
 *                   example: "Technoblade"
 *       400:
 *         description: Invalid UUID format.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid Player UUID format"
 *                 message:
 *                   type: string
 *                   example: "UUID must be exactly 32 characters long (or 36 with dashes) and contain only alphanumeric characters and dashes"
 *       404:
 *         description: UUID not found in the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Player not found"
 *                 message:
 *                   type: string
 *                   example: "Player with the given UUID could not be found in the database"
 *       500:
 *         description: Internal server error (e.g., DB failure).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal error"
 *                 message:
 *                   type: string
 *                   example: "Error reading data from the database"
 */
$playerRouter.get('/uuid/:uuid', async (req: Req, res: Res) => {
  // Convert UUID to lowercase and remove dashes
  const playerUuid = req.params['uuid'].toLowerCase().replaceAll('-', '')

  const validation = PlayerUuidParamSchema.safeParse(playerUuid)

  if (!validation.success) {
    res.status(400).json({
      error: 'Invalid Player UUID format',
      message: joinZodError(validation.error)
    })
    return;
  }

  let player;
  try {
    player = await getPlayerByUuidFromDB(playerUuid)
  } catch (e) {
    if (e instanceof DatabaseReadError) {
      res.status(500).json({
        error: 'Internal error',
        message: e.message
      })
    } else if (e instanceof DatabaseEntryNotFoundError) {
      res.status(404).json({
        error: 'Player not found!',
        message: e.message
      })
    }
    return;
  }

  res.send(player)
})
