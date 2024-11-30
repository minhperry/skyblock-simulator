import express from "express";

export class RequestError {
  private serverResponse: express.Response;

  constructor(res: express.Response) {
    this.serverResponse = res;
  }

  error(status: number, payload: any) {
    if (status <= 499 && status >= 400) {
      this.serverResponse.status(status).json(payload);
    } else {
      throw new Error('Invalid error status code!');
    }
  }
}

export const ErrorPayload = {
  MALFORMED_NAME: {
    id: 'MALFORMED_NAME',
    error: 'Malformed name with invalid characters!'
  },
  NAME_TOO_LONG: {
    id: 'NAME_TOO_LONG',
    error: 'Name is too long!'
  },
  PLAYER_NOT_FOUND: {
    id: 'PLAYER_NOT_FOUND',
    error: 'Player not found!'
  },
  INVALID_PROFILE: {
    id: 'INVALID_PROFILE',
    error: 'Invalid profile!'
  },
  PROFILE_NOT_FOUND: {
    id: 'PROFILE_NOT_FOUND',
    error: 'Profile not found!'
  },
  ROUTE_NOT_FOUND: {
    id: 'ROUTE_NOT_FOUND',
    error: 'Route not found!'
  },
  RATE_LIMITED: {
    id: 'RATE_LIMITED',
    error: 'Too many requests, please try again later!'
  }
}