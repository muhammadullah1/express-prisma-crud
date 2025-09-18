const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Sample data similar to JSONPlaceholder
const sampleUsers = [
  {
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
    password: 'password123',
    phone: '1-770-736-8031 x56442',
    website: 'hildegard.org',
    role: 'ADMIN',
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: {
        lat: '-37.3159',
        lng: '81.1496'
      }
    },
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets'
    }
  },
  {
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'Shanna@melissa.tv',
    password: 'password123',
    phone: '010-692-6593 x09125',
    website: 'anastasia.net',
    role: 'USER',
    address: {
      street: 'Victor Plains',
      suite: 'Suite 879',
      city: 'Wisokyburgh',
      zipcode: '90566-7771',
      geo: {
        lat: '-43.9509',
        lng: '-34.4618'
      }
    },
    company: {
      name: 'Deckow-Crist',
      catchPhrase: 'Proactive didactic contingency',
      bs: 'synergize scalable supply-chains'
    }
  },
  {
    name: 'Clementine Bauch',
    username: 'Samantha',
    email: 'Nathan@yesenia.net',
    password: 'password123',
    phone: '1-463-123-4447',
    website: 'ramiro.info',
    role: 'USER',
    address: {
      street: 'Douglas Extension',
      suite: 'Suite 847',
      city: 'McKenziehaven',
      zipcode: '59590-4157',
      geo: {
        lat: '-68.6102',
        lng: '-47.0653'
      }
    },
    company: {
      name: 'Romaguera-Jacobson',
      catchPhrase: 'Face to face bifurcated interface',
      bs: 'e-enable strategic applications'
    }
  },
  {
    name: 'Patricia Lebsack',
    username: 'Karianne',
    email: 'Julianne.OConner@kory.org',
    password: 'password123',
    phone: '493-170-9623 x156',
    website: 'kale.biz',
    role: 'USER',
    address: {
      street: 'Hoeger Mall',
      suite: 'Apt. 692',
      city: 'South Elvis',
      zipcode: '53919-4257',
      geo: {
        lat: '29.4572',
        lng: '-164.2990'
      }
    },
    company: {
      name: 'Robel-Corkery',
      catchPhrase: 'Multi-tiered zero tolerance productivity',
      bs: 'transition cutting-edge web services'
    }
  },
  {
    name: 'Chelsey Dietrich',
    username: 'Kamren',
    email: 'Lucio_Hettinger@annie.ca',
    password: 'password123',
    phone: '(254)954-1289',
    website: 'demarco.info',
    role: 'USER',
    address: {
      street: 'Skiles Walks',
      suite: 'Suite 351',
      city: 'Roscoeview',
      zipcode: '33263',
      geo: {
        lat: '-31.8129',
        lng: '62.5342'
      }
    },
    company: {
      name: 'Keebler LLC',
      catchPhrase: 'User-centric fault-tolerant solution',
      bs: 'revolutionize end-to-end systems'
    }
  }
];

const samplePosts = [
  {
    title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
    body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
  },
  {
    title: 'qui est esse',
    body: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla'
  },
  {
    title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut',
    body: 'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut'
  }
];

const sampleComments = [
  {
    name: 'id labore ex et quam laborum',
    email: 'Eliseo@gardner.biz',
    body: 'laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium'
  },
  {
    name: 'quo vero reiciendis velit similique earum',
    email: 'Jayne_Kuhic@sydney.com',
    body: 'est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et'
  }
];

const sampleAlbums = [
  { title: 'quidem molestiae enim' },
  { title: 'sunt qui excepturi placeat culpa' },
  { title: 'omnis laborum odio' }
];

const samplePhotos = [
  {
    title: 'accusamus beatae ad facilis cum similique qui sunt',
    url: 'https://via.placeholder.com/600/92c952',
    thumbnailUrl: 'https://via.placeholder.com/150/92c952'
  },
  {
    title: 'reprehenderit est deserunt velit ipsam',
    url: 'https://via.placeholder.com/600/771796',
    thumbnailUrl: 'https://via.placeholder.com/150/771796'
  }
];

const sampleTodos = [
  {
    title: 'delectus aut autem',
    completed: false
  },
  {
    title: 'quis ut nam facilis et officia qui',
    completed: false
  },
  {
    title: 'fugiat veniam minus',
    completed: false
  },
  {
    title: 'et porro tempora',
    completed: true
  }
];

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.todo.deleteMany();
    await prisma.photo.deleteMany();
    await prisma.album.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.company.deleteMany();
    await prisma.address.deleteMany();
    await prisma.user.deleteMany();

    console.log('👥 Creating users...');
    const createdUsers = [];
    
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          phone: userData.phone,
          website: userData.website,
          role: userData.role,
          address: {
            create: {
              street: userData.address.street,
              suite: userData.address.suite,
              city: userData.address.city,
              zipcode: userData.address.zipcode,
              geo: {
                create: {
                  lat: userData.address.geo.lat,
                  lng: userData.address.geo.lng
                }
              }
            }
          },
          company: {
            create: {
              name: userData.company.name,
              catchPhrase: userData.company.catchPhrase,
              bs: userData.company.bs
            }
          }
        },
        include: {
          address: {
            include: {
              geo: true
            }
          },
          company: true
        }
      });
      
      createdUsers.push(user);
    }

    console.log('📝 Creating posts...');
    const createdPosts = [];
    
    for (let i = 0; i < samplePosts.length; i++) {
      const post = await prisma.post.create({
        data: {
          title: samplePosts[i].title,
          body: samplePosts[i].body,
          userId: createdUsers[i % createdUsers.length].id
        }
      });
      createdPosts.push(post);
    }

    console.log('💬 Creating comments...');
    for (let i = 0; i < sampleComments.length; i++) {
      await prisma.comment.create({
        data: {
          name: sampleComments[i].name,
          email: sampleComments[i].email,
          body: sampleComments[i].body,
          postId: createdPosts[i % createdPosts.length].id
        }
      });
    }

    console.log('📸 Creating albums...');
    const createdAlbums = [];
    
    for (let i = 0; i < sampleAlbums.length; i++) {
      const album = await prisma.album.create({
        data: {
          title: sampleAlbums[i].title,
          userId: createdUsers[i % createdUsers.length].id
        }
      });
      createdAlbums.push(album);
    }

    console.log('🖼️ Creating photos...');
    for (let i = 0; i < samplePhotos.length; i++) {
      await prisma.photo.create({
        data: {
          title: samplePhotos[i].title,
          url: samplePhotos[i].url,
          thumbnailUrl: samplePhotos[i].thumbnailUrl,
          albumId: createdAlbums[i % createdAlbums.length].id
        }
      });
    }

    console.log('✅ Creating todos...');
    for (let i = 0; i < sampleTodos.length; i++) {
      await prisma.todo.create({
        data: {
          title: sampleTodos[i].title,
          completed: sampleTodos[i].completed,
          userId: createdUsers[i % createdUsers.length].id
        }
      });
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`Created ${createdUsers.length} users`);
    console.log(`Created ${createdPosts.length} posts`);
    console.log(`Created ${sampleComments.length} comments`);
    console.log(`Created ${createdAlbums.length} albums`);
    console.log(`Created ${samplePhotos.length} photos`);
    console.log(`Created ${sampleTodos.length} todos`);
    
    console.log('\n🔐 Admin credentials:');
    console.log('Email: Sincere@april.biz');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('🎉 Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding process failed:', error);
      process.exit(1);
    });
}

module.exports = seed;