const Joi = require('joi');

class ValidationMiddleware {
  static validate(schema) {
    return (req, res, next) => {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
          })),
        });
      }
      next();
    };
  }

  static validateParams(schema) {
    return (req, res, next) => {
      const { error } = schema.validate(req.params);
      if (error) {
        return res.status(400).json({
          error: 'Invalid parameters',
          details: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
          })),
        });
      }
      next();
    };
  }

  static validateQuery(schema) {
    return (req, res, next) => {
      const { error } = schema.validate(req.query);
      if (error) {
        return res.status(400).json({
          error: 'Invalid query parameters',
          details: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
          })),
        });
      }
      next();
    };
  }
}

// Common validation schemas
const ValidationSchemas = {
  // User schemas
  userRegistration: Joi.object({
    name: Joi.string().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().optional(),
    website: Joi.string().uri().optional(),
    address: Joi.object({
      street: Joi.string().required(),
      suite: Joi.string().required(),
      city: Joi.string().required(),
      zipcode: Joi.string().required(),
      geo: Joi.object({
        lat: Joi.string().required(),
        lng: Joi.string().required(),
      }).optional(),
    }).optional(),
    company: Joi.object({
      name: Joi.string().required(),
      catchPhrase: Joi.string().required(),
      bs: Joi.string().required(),
    }).optional(),
  }),

  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  userUpdate: Joi.object({
    name: Joi.string().optional(),
    username: Joi.string().alphanum().min(3).max(30).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    phone: Joi.string().optional(),
    website: Joi.string().uri().optional(),
  }),

  // Post schemas
  postCreate: Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
  }),

  postUpdate: Joi.object({
    title: Joi.string().optional(),
    body: Joi.string().optional(),
  }),

  // Comment schemas
  commentCreate: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    body: Joi.string().required(),
    postId: Joi.number().integer().positive().required(),
  }),

  commentUpdate: Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    body: Joi.string().optional(),
  }),

  // Album schemas
  albumCreate: Joi.object({
    title: Joi.string().required(),
  }),

  albumUpdate: Joi.object({
    title: Joi.string().optional(),
  }),

  // Photo schemas
  photoCreate: Joi.object({
    title: Joi.string().required(),
    url: Joi.string().uri().required(),
    thumbnailUrl: Joi.string().uri().required(),
    albumId: Joi.number().integer().positive().required(),
  }),

  photoUpdate: Joi.object({
    title: Joi.string().optional(),
    url: Joi.string().uri().optional(),
    thumbnailUrl: Joi.string().uri().optional(),
  }),

  // Todo schemas
  todoCreate: Joi.object({
    title: Joi.string().required(),
    completed: Joi.boolean().optional(),
  }),

  todoUpdate: Joi.object({
    title: Joi.string().optional(),
    completed: Joi.boolean().optional(),
  }),

  // Parameter schemas
  idParam: Joi.object({
    id: Joi.number().integer().positive().required(),
  }),
};

module.exports = { ValidationMiddleware, ValidationSchemas };