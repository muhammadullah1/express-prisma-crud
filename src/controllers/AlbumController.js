const AlbumService = require('../services/AlbumService');
const ErrorHandler = require('../middleware/errorHandler');

class AlbumController {
  constructor() {
    this.albumService = new AlbumService();
  }

  // Get all albums
  getAlbums = ErrorHandler.asyncHandler(async (req, res) => {
    const { userId } = req.query;
    let albums;
    
    if (userId) {
      albums = await this.albumService.getAlbumsByUserId(userId);
    } else {
      albums = await this.albumService.getAlbums();
    }
    
    res.json({
      success: true,
      data: albums,
    });
  });

  // Get album by ID
  getAlbumById = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const album = await this.albumService.getAlbumById(id);
    
    res.json({
      success: true,
      data: album,
    });
  });

  // Get photos for an album
  getAlbumPhotos = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const photos = await this.albumService.getAlbumPhotos(id);
    
    res.json({
      success: true,
      data: photos,
    });
  });

  // Create new album
  createAlbum = ErrorHandler.asyncHandler(async (req, res) => {
    const albumData = {
      ...req.body,
      userId: req.user.id,
    };
    
    const album = await this.albumService.addAlbum(albumData);
    
    res.status(201).json({
      success: true,
      message: 'Album created successfully',
      data: album,
    });
  });

  // Update album
  updateAlbum = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedAlbum = await this.albumService.updateAlbum(id, req.body, req.user.id);
    
    res.json({
      success: true,
      message: 'Album updated successfully',
      data: updatedAlbum,
    });
  });

  // Delete album
  deleteAlbum = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await this.albumService.deleteAlbum(id, req.user.id);
    
    res.json({
      success: true,
      message: result.message,
    });
  });
}

module.exports = AlbumController;