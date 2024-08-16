import Joi from 'joi';

const validateUserRegister = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Username cannot be empty',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 30 characters',
    'any.required': 'Username is required',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email must be a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password cannot be empty',
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
  confirmPassword: Joi.string().min(6).required().messages({
    'string.empty': 'Confirm Password cannot be empty',
    'string.min': 'Confirm Password must be at least 6 characters long',
    'any.required': 'Confirm Password is required',
  }),
});

export default validateUserRegister;
