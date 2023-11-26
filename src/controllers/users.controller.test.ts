import { Request, Response } from 'express';
import { UsersController } from './users.controller';
import { UsersMongoRepo } from '../repos/users.mongo.repo';

describe('Given UsersController class', () => {
  let controller: UsersController;

  let mockNext: jest.Mock;

  describe('When we instantiate it without errors', () => {
    beforeEach(() => {
      const mockRepo = {
        getAll: jest.fn().mockResolvedValue([{}]),
        getById: jest.fn().mockResolvedValue({}),
        search: jest.fn().mockResolvedValue([{}]),
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
        addFriend: jest.fn().mockResolvedValue({}),
        addEnemy: jest.fn().mockResolvedValue({}),
        delete: jest.fn().mockResolvedValue(undefined),
      } as unknown as UsersMongoRepo;

      controller = new UsersController(mockRepo);
    });
    test('Then login should return user data and token', async () => {
      const mockRequestWithUserId = {
        body: { userId: 'someUserId' },
        params: {},
        query: { key: 'value' },
      } as unknown as Request;

      const mockResponseWithUserId = {
        json: jest.fn(),
        status: jest.fn(),
      } as unknown as Response;

      await controller.login(
        mockRequestWithUserId,
        mockResponseWithUserId,
        mockNext
      );

      const expectedDataWithUserId = {
        user: {},
        token: expect.any(String),
      };
      expect(mockResponseWithUserId.json).toHaveBeenCalledWith(
        expectedDataWithUserId
      );
    });
  });
});
