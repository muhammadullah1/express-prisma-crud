const database = require('../utils/database');

class AlbumService {
  constructor() {
    this.prisma = database.getClient();
  }

  // Get all albums
  getAlbums = async () => {
    return await this.prisma.album.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
        photos: {
          select: {
            id: true,
            title: true,
            url: true,
            thumbnailUrl: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  };

  // Get album by ID
  getAlbumById = async (id) => {
    const album = await this.prisma.album.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
        photos: {
          select: {
            id: true,
            title: true,
            url: true,
            thumbnailUrl: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!album) {
      throw new Error('Album not found');
    }

    return album;
  };

  // Get albums by user ID
  getAlbumsByUserId = async (userId) => {
    return await this.prisma.album.findMany({
      where: { userId: parseInt(userId) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
        photos: {
          select: {
            id: true,
            title: true,
            url: true,
            thumbnailUrl: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  };

  // Get photos for a specific album
  getAlbumPhotos = async (albumId) => {
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

  // Create new album
  addAlbum = async (albumData, userId) => {
    return await this.prisma.album.create({
      data: {
        ...albumData,
        userId: parseInt(userId),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
    });
  };

  // Update album
  updateAlbum = async (id, albumData, userId, userRole) => {
    const existingAlbum = await this.prisma.album.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingAlbum) {
      throw new Error('Album not found');
    }

    // Check if user owns the album or is admin
    if (existingAlbum.userId !== parseInt(userId) && userRole !== 'ADMIN') {
      throw new Error('Unauthorized to update this album');
    }

    return await this.prisma.album.update({
      where: { id: parseInt(id) },
      data: albumData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
    });
  };

  // Delete album
  deleteAlbum = async (id, userId, userRole) => {
    const existingAlbum = await this.prisma.album.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingAlbum) {
      throw new Error('Album not found');
    }

    // Check if user owns the album or is admin
    if (existingAlbum.userId !== parseInt(userId) && userRole !== 'ADMIN') {
      throw new Error('Unauthorized to delete this album');
    }

    await this.prisma.album.delete({
      where: { id: parseInt(id) },
    });

    return { message: 'Album deleted successfully' };
  };
}

module.exports = AlbumService;