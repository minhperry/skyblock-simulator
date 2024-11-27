import winston, {info, transports} from "winston";

const logFormat = winston.format.printf(({level, message, timestamp}) => {
  const formattedDate = new Date(timestamp as string).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).replace(',', '');
  return `[${formattedDate}] ${level.toUpperCase()} ${message}`;
})

export const Logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({filename: 'logs/error.log', level: 'error'}),
    new transports.File({filename: 'logs/combined.log'})
  ]
});