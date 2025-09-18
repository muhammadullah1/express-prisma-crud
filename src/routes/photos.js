const express = require('express');
const PhotoController = require('../controllers/PhotoController');
const AuthMiddleware = require('../middleware/auth');
const { ValidationMiddleware, ValidationSchemas } = require('../middleware/validation');

const router = express.Router();
const photoController = new PhotoController();

// Get all photos (public for JSONPlaceholder compatibility)
router.get('/', photoController.getPhotos);

// Get photo by ID (public for JSONPlaceholder compatibility)
router.get('/:id', 
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  photoController.getPhotoById
);

// Create photo (authenticated users)
router.post('/', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(ValidationSchemas.photoCreate),
  photoController.createPhoto
);

// Update photo (authenticated users, owner or admin)
router.put('/:id', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  ValidationMiddleware.validate(ValidationSchemas.photoUpdate),
  photoController.updatePhoto
);

// Delete photo (authenticated users, owner or admin)
router.delete('/:id', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  photoController.deletePhoto
);

module.exports = router;