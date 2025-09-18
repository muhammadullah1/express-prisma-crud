const express = require('express');
const AlbumController = require('../controllers/AlbumController');
const AuthMiddleware = require('../middleware/auth');
const { ValidationMiddleware, ValidationSchemas } = require('../middleware/validation');

const router = express.Router();
const albumController = new AlbumController();

// Get all albums (public for JSONPlaceholder compatibility)
router.get('/', albumController.getAlbums);

// Get album by ID (public for JSONPlaceholder compatibility)
router.get('/:id', 
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  albumController.getAlbumById
);

// Get photos for an album (public for JSONPlaceholder compatibility)
router.get('/:id/photos', 
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  albumController.getAlbumPhotos
);

// Create album (authenticated users)
router.post('/', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(ValidationSchemas.albumCreate),
  albumController.createAlbum
);

// Update album (authenticated users, owner or admin)
router.put('/:id', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  ValidationMiddleware.validate(ValidationSchemas.albumUpdate),
  albumController.updateAlbum
);

// Delete album (authenticated users, owner or admin)
router.delete('/:id', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  albumController.deleteAlbum
);

module.exports = router;