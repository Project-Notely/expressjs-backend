import request from 'supertest';
import express from 'express';
import { getAuth } from 'firebase-admin/auth';
import { app } from '../src/index';

jest.mock('firebase-admin/auth');

const mockVerifyIdToken = jest.fn();
const mockGetUser = jest.fn();
(getAuth as jest.Mock).mockReturnValue({
    verifyIdToken: mockVerifyIdToken,
    getUser: mockGetUser
});

describe('User Email Route', () => {
    beforeEach(() => {
        // Reset mocks before each test
        mockVerifyIdToken.mockReset();
        mockGetUser.mockReset();
    });

    it('should return 401 if no token is provided', async () => {
        const response = await request(app).get('/user/email');
        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Authentication required');
    });

    it('should return 403 for invalid token', async () => {
        mockVerifyIdToken.mockRejectedValue(new Error('Invalid token'));

        const response = await request(app)
            .get('/user/email')
            .set('Authorization', 'Bearer invalidtoken');

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('Invalid or expired token');
    });

    it('should return user email if authenticated', async () => {
        const mockUser = { uid: '123', email: 'test@example.com' };
        const verifyIdTokenMock = getAuth().verifyIdToken as jest.Mock;
        mockVerifyIdToken.mockResolvedValue(mockUser);
        mockGetUser.mockResolvedValue({ email: mockUser.email });

        const response = await request(app)
            .get('/user/email')
            .set('Authorization', 'Bearer validtoken');

        expect(response.status).toBe(200);
        expect(response.body.email).toBe(mockUser.email);
    });
});