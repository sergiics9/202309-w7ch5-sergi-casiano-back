import { Request, Response } from 'express';
import { UsersController } from './users.controller';
import { UsersMongoRepo } from '../repos/users.mongo.repo';

describe('Given UsersController class', () => {
  let controller: UsersController;
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: jest.Mock;
  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      query: { key: 'value' },
    } as unknown as Request;
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;
    mockNext = jest.fn();
  });

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
    describe('When we instantiate it WITH errors', () => {
      let mockError: Error;
      beforeEach(() => {
        mockError = new Error('Mock error');
        const mockRepo = {
          getAll: jest.fn().mockRejectedValue(mockError),
          getById: jest.fn().mockRejectedValue(mockError),
          search: jest.fn().mockRejectedValue(mockError),
          create: jest.fn().mockRejectedValue(mockError),
          update: jest.fn().mockRejectedValue(mockError),
          addFriend: jest.fn().mockRejectedValue(mockError),
          addEnemy: jest.fn().mockRejectedValue(mockError),
          delete: jest.fn().mockRejectedValue(mockError),
          login: jest.fn().mockRejectedValue(mockError),
        } as unknown as UsersMongoRepo;

        controller = new UsersController(mockRepo);
      });
      test('Then login should ...', async () => {
        await controller.login(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenLastCalledWith(mockError);
      });
    });
  });
});
