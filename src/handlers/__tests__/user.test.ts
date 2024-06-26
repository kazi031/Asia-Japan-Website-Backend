import { handleInputErrors } from '../../modules/middleware';
import { validateUser } from '../../modules/userMiddleware';
import * as user from '../user';
import { validationResult } from 'express-validator';

describe('user handler', () => {
    it('should create a new user', async () => {
        // Mock request and response objects
        const req = { body: { email: 'test@asiajapan-bd.com', password: 'admin' } };
        const res = {
            json({ token }) {
                expect(token).toBeTruthy();
            },
            status(code) {
                this.statusCode = code;
                return this;
            }
        };
        const next = jest.fn();

        // Run validation middleware
        await validateUser[0](req, res, next);
        await validateUser[1](req, res, next);

        // Check if validation errors exist

        // handleInputErrors(req, res, next)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Call the handler
        await user.createNewUser(req, res, next);

        // Check that next() was not called with an error
        expect(next).not.toHaveBeenCalledWith(expect.any(Error));
    });

    it('should not create a user with invalid email', async () => {
        // Mock request and response objects
        const req = { body: { email: 'nayan.com', password: 'admin' } };
        const res = {
            json(data) {
                // this will be executed if validation does not fail
                throw new Error('Validation should have failed');
            },
            status(code) {
                this.statusCode = code;
                return this;
            }
        };
        const next = jest.fn();

        // Run validation middleware
        await validateUser[0](req, res, next);
        await validateUser[1](req, res, next);

        // Check if validation errors exist
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        await user.createNewUser(req, res, next);

        // Ensure the error was caught
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            errors: expect.arrayContaining([
                expect.objectContaining({
                    msg: 'Email must be valid'
                })
            ])
        });
    });
});
