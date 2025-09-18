const database = require('../utils/database');
const AuthUtils = require('../utils/auth');

class UserService {
  constructor() {
    this.prisma = database.getClient();
  }

  // Get all users (excluding password)
  getUsers = async () => {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        website: true,
        role: true,
        address: {
          select: {
            street: true,
            suite: true,
            city: true,
            zipcode: true,
            geo: {
              select: {
                lat: true,
                lng: true,
              },
            },
          },
        },
        company: {
          select: {
            name: true,
            catchPhrase: true,
            bs: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  };

  // Get user by ID
  getUserById = async (id) => {
    const user = await this.prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        website: true,
        role: true,
        address: {
          select: {
            street: true,
            suite: true,
            city: true,
            zipcode: true,
            geo: {
              select: {
                lat: true,
                lng: true,
              },
            },
          },
        },
        company: {
          select: {
            name: true,
            catchPhrase: true,
            bs: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  };

  // Create new user
  addUser = async (userData) => {
    const { password, address, company, ...userInfo } = userData;

    // Hash password
    const hashedPassword = await AuthUtils.hashPassword(password);

    // Create user with nested relations
    const { password: _, ...createdUser } = await this.prisma.user.create({
      data: {
        ...userInfo,
        password: hashedPassword,
        ...(address && {
          address: {
            create: {
              ...address,
              ...(address.geo && {
                geo: {
                  create: address.geo,
                },
              }),
            },
          },
        }),
        ...(company && {
          company: {
            create: company,
          },
        }),
      },
      include: {
        address: {
          include: {
            geo: true,
          },
        },
        company: true,
      },
    });

    return createdUser;
  };

  // Update user
  updateUser = async (id, userData) => {
    const { password, address, company, ...userInfo } = userData;

    const updateData = { ...userInfo };

    // Hash password if provided
    if (password) {
      updateData.password = await AuthUtils.hashPassword(password);
    }

    const { password: _, ...updatedUser } = await this.prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        website: true,
        role: true,
        address: {
          select: {
            street: true,
            suite: true,
            city: true,
            zipcode: true,
            geo: {
              select: {
                lat: true,
                lng: true,
              },
            },
          },
        },
        company: {
          select: {
            name: true,
            catchPhrase: true,
            bs: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  };

  // Delete user
  deleteUser = async (id) => {
    await this.prisma.user.delete({
      where: { id: parseInt(id) },
    });
    return { message: 'User deleted successfully' };
  };

  // Authentication methods
  login = async (email, password) => {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        address: {
          include: {
            geo: true,
          },
        },
        company: true,
      },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await AuthUtils.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = AuthUtils.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  };

  register = async (userData) => {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { username: userData.username },
        ],
      },
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Create new user
    const newUser = await this.addUser(userData);

    // Generate JWT token
    const token = AuthUtils.generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return {
      user: newUser,
      token,
    };
  };
}

module.exports = UserService;