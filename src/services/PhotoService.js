const database = require('../utils/database');

class PhotoService {
  constructor() {
    this.prisma = database.getClient();
  }

  // Get all photos
  getPhotos = async () => {
    return await this.prisma.photo.findMany({
      include: {
        album: {
          select: {
            id: true,
            title: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  };

  // Get photo by ID
  getPhotoById = async (id) => {
    const photo = await this.prisma.photo.findUnique({
      where: { id: parseInt(id) },
      include: {
        album: {
          select: {
            id: true,
            title: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!photo) {
      throw new Error('Photo not found');
    }

    return photo;
  };

  // Get photos by album ID
  getPhotosByAlbumId = async (albumId) => {
    // Verify album exists
    const album = await this.prisma.album.findUnique({
      where: { id: parseInt(albumId) },
    });

    if (!album) {
      throw new Error('Album not found');
    }

    return await this.prisma.photo.findMany({
      where: { albumId: parseInt(albumId) },
      orderBy: {
        createdAt: 'desc',
      },
    });
  };

  // Create new photo
  addPhoto = async (photoData) => {
    const { albumId, ...data } = photoData;

    // Verify album exists
    const album = await this.prisma.album.findUnique({
      where: { id: parseInt(albumId) },
    });

    if (!album) {
      throw new Error('Album not found');
    }

    return await this.prisma.photo.create({
      data: {
        ...data,
        albumId: parseInt(albumId),
      },
      include: {
        album: {
          select: {
            id: true,
            title: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });
  };

  // Update photo
  updatePhoto = async (id, photoData, userId, userRole) => {
    const existingPhoto = await this.prisma.photo.findUnique({
      where: { id: parseInt(id) },
      include: {
        album: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!existingPhoto) {
      throw new Error('Photo not found');
    }

    // Check if user owns the album or is admin
    if (existingPhoto.album.userId !== parseInt(userId) && userRole !== 'ADMIN') {
      throw new Error('Unauthorized to update this photo');
    }

    return await this.prisma.photo.update({
      where: { id: parseInt(id) },
      data: photoData,
      include: {
        album: {
          select: {
            id: true,
            title: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });
  };

  // Delete photo
  deletePhoto = async (id, userId, userRole) => {
    const existingPhoto = await this.prisma.photo.findUnique({
      where: { id: parseInt(id) },
      include: {
        album: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!existingPhoto) {
      throw new Error('Photo not found');
    }

    // Check if user owns the album or is admin
    if (existingPhoto.album.userId !== parseInt(userId) && userRole !== 'ADMIN') {
      throw new Error('Unauthorized to delete this photo');
    }

    await this.prisma.photo.delete({
      where: { id: parseInt(id) },
    });

    return { message: 'Photo deleted successfully' };
  };
}

module.exports = PhotoService;