import { LoggerMessage } from "../logger";

export const currentDateTime = () => {
  const date = new Date();
  return date.toLocaleString('ru-RU');
}

export const serializeObject = (obj) => {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    throw new Error(LoggerMessage.ERROR.ERROR_WHILE_SERIALIZING_OBJECT);
  }
}

export const deserializeObject = (obj) => {
  try {
    return JSON.parse(obj);
  } catch (e) {
    throw new Error(LoggerMessage.ERROR.ERROR_WHILE_DESERIALIZING_OBJECT);
  }
}
