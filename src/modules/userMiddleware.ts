import { body } from "express-validator";

export const validateUser = [
    body('email')
    .exists().withMessage('Email is required')
    .isString().withMessage('Email must be a string')
    .isEmail().withMessage('Email must be valid')
    .matches(/@asiajapan-bd\.com$/).withMessage('Email must be an organization email ending with @asiajapan-bd.com'),
  body('password')
    .exists().withMessage('Password is required')
    .isString().withMessage('Password must be a string')
]