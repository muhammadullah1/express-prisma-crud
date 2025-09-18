const PhotoService = require('../services/PhotoService');
const ErrorHandler = require('../middleware/errorHandler');

class PhotoController {
  constructor() {
    this.photoService = new PhotoService();
  }

  // Get all photos
  getPhotos = ErrorHandler.asyncHandler(async (req, res) => {
    const { albumId } = req.query;
    let photos;
    
    if (albumId) {
      photos = await this.photoService.getPhotosByAlbumId(albumId);
    } else {
      photos = await this.photoService.getPhotos();
    }
    
    res.json({
      success: true,
      data: photos,
    });
  });

  // Get photo by ID
  getPhotoById = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const photo = await this.photoService.getPhotoById(id);
    
    res.json({
      success: true,
      data: photo,
    });
  });

  // Create new photo
  createPhoto = ErrorHandler.asyncHandler(async (req, res) => {
    const photo = await this.photoService.addPhoto(req.body, req.user.id);
    
    res.status(201).json({
      success: true,
      message: 'Photo created successfully',
      data: photo,
    });
  });

  // Update photo
  updatePhoto = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedPhoto = await this.photoService.updatePhoto(id, req.body, req.user.id);
    
    res.json({
      success: true,
      message: 'Photo updated successfully',
      data: updatedPhoto,
    });
  });

  // Delete photo
  deletePhoto = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await this.photoService.deletePhoto(id, req.user.id);
    
    res.json({
      success: true,
      message: result.message,
    });
  });
}

module.exports = PhotoController;