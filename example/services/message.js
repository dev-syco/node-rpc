import { Logger, LoggerMessage } from '../../src/logger';
import { serializeObject } from '../../src/utils';

export class MessageService {
  constructor({ client, server }) {
    this.name = 'message';
    this.client = client;
    this.server = server;
    if (this.server) {
      const events = {
        [this.eventKey(messageServiceEvents.NEW)]: this.onServerReceivedMessage.bind(this),
      };
      this.bindEvents(events, this.server);
    }
    if (this.client) {
      const events = {
        [this.eventKey(messageServiceEvents.NEW)]: this.onClientSendingMessage.bind(this),
      };
      this.bindEvents(events, this.client);
    }
  }

  onClientSendingMessage(data) {
    Logger.info(LoggerMessage.INFO.CLIENT_MESSAGE_RECEIVED(data.message, data.receiverId, this.client.id));
  }

  onServerReceivedMessage(sender, { message, receiverId }) {
    const data = {
      event: this.eventKey(messageServiceEvents.NEW),
      payload: { message, receiverId, senderId: sender.id },
    };
    if (receiverId === -1) {
      this.server.sendToAllClients(data);
    } else {
      this.server.sendDataByClientId(receiverId, data);
    }
  }

  sendMessage(message, receiverId) {
    if (!this.client || this.client.connecting) {
      Logger.error(LoggerMessage.ERROR.CLIENT_NOT_READY);
      throw new Error(LoggerMessage.ERROR.CLIENT_NOT_READY);
    }
    this.client.write(serializeObject({
      event: this.eventKey(messageServiceEvents.NEW),
      payload: { message, receiverId },
    }), () => {
      Logger.info(LoggerMessage.INFO.CLIENT_MESSAGE_SENT(message, receiverId));
    });
  }

  eventKey(key) {
    return `${this.name}:${key}`;
  }

  bindEvents(events, target) {
    Object.keys(events).forEach((event) => {
      target.on(event, events[event]);
    });
  }
}

const messageServiceEvents = {
  NEW: 'new',
};
