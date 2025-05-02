// src/chat.gateway.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { Server } from 'socket.io';
import { createMock } from '@golevelup/ts-jest';
import { WsException } from '@nestjs/websockets';
import { ChatGateway } from '../gateWay/gateway';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let server: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatGateway],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    server = createMock<Server>();
    gateway.server = server;
  });

  it('should handle join', () => {
    const client = { id: 'abc' } as any;
    gateway.handleJoin('John', client);
    expect(gateway['clients'].get('abc').username).toBe('John');
  });

  it('should throw if join username is invalid', () => {
    const client = { id: 'abc' } as any;
    expect(() => gateway.handleJoin(null as any, client)).toThrow(WsException);
  });

  it('should handle message from registered user', () => {
    const client = { id: '123' } as any;
    gateway['clients'].set('123', { username: 'Alice', lastMessageTime: 0 });
    const payload = { message: 'Hello' };
    const now = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(now);

    gateway.handleMessage(payload, client);
    expect(gateway['clients'].get('123').lastMessageTime).toBe(now);
  });

  it('should rate limit messages', () => {
    const client = { id: '123' } as any;
    const now = Date.now();
    gateway['clients'].set('123', { username: 'Alice', lastMessageTime: now });

    expect(() =>
      gateway.handleMessage({ message: 'Hello' }, client),
    ).toThrow(WsException);
  });

  it('should reject empty messages', () => {
    const client = { id: '456' } as any;
    gateway['clients'].set('456', { username: 'Bob', lastMessageTime: 0 });

    expect(() =>
      gateway.handleMessage({ message: '' }, client),
    ).toThrow(WsException);
  });

  it('should broadcast typing event', () => {
    const broadcast = { emit: jest.fn() };
    const client = { id: '789', broadcast } as any;
    gateway['clients'].set('789', { username: 'Charlie', lastMessageTime: 0 });

    gateway.handleTyping(client);
    expect(broadcast.emit).toHaveBeenCalledWith('typing', 'Charlie is typing...');
  });
});
