const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

// Seed data for 50 users
async function userSeed() {
  try {
    for(i=0; i < 50; i++){
      await prisma.user.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          username: faker.internet.userName(), 
          password: faker.internet.password(),
          email: faker.internet.email(),
          streetAddress: faker.location.streetAddress(),
          city: faker.location.city(),
          zipcode: faker.location.zipCode(),
          phone: faker.phone.number()
        }
      });
    }
  } catch(error) {
    console.log(error);
    throw error;
  };
};

// Seed data for 50 items and order by Id
async function itemSeed() {
  for(i=0; i < 50; i++){
    try {
      await prisma.item.create({
        data: {
          name: faker.commerce.productName(),
          imageUrl: faker.image.urlLoremFlickr(),
          description: faker.commerce.productDescription(),
          category: faker.commerce.productAdjective()
        }
      });
    }
    catch(error) {
        console.log(error);
        throw error;
    };
  };
};

// Seed 2 reviews per user for random items
async function reviewSeed() {
  const users = await prisma.user.findMany();
  const items = await prisma.item.findMany();
  for (i=0; i < users.length; i++) {
    try{
      await prisma.review.createMany({
        data: [
            {
                userId: users[i].userId,
                itemId: items[Math.floor(Math.random() * items.length)].itemId,
                text: faker.lorem.paragraph({ min: 1, max: 3 }),
                score: Number(Math.floor(Math.random() * 5))
            },
            {
                userId: users[i].userId,
                itemId: items[Math.floor(Math.random() * items.length)].itemId,
                text: faker.lorem.paragraph({ min: 1, max: 3 }),
                score: Number(Math.floor(Math.random() * 5))
            }
        ]
      });
    }
    catch(error) {
      console.log(error);
      throw error;
    }
  };
};

// Seeds 4 comments per user for random reviews
// NOTE: Runs slowly. Do not use with large seeds.
async function commentSeed() {
  const users = await prisma.user.findMany();
  const reviews = await prisma.review.findMany();
  for (i=0; i < users.length; i++) {
    try{
      await prisma.comment.createMany({
        data: [
            {
                userId: users[i].userId,
                reviewId: reviews[Math.floor(Math.random() * reviews.length)].reviewId,
                text: faker.lorem.paragraph({min: 1, max: 3})
            },
            {
                userId: users[i].userId,
                reviewId: reviews[Math.floor(Math.random() * reviews.length)].reviewId,
                text: faker.lorem.paragraph({min: 1, max: 3})
            },
            {
                userId: users[i].userId,
                reviewId: reviews[Math.floor(Math.random() * reviews.length)].reviewId,
                text: faker.lorem.paragraph({min: 1, max: 3})
            },
            {
                userId: users[i].userId,
                reviewId: reviews[Math.floor(Math.random() * reviews.length)].reviewId,
                text: faker.lorem.paragraph({min: 1, max: 3})
            }
        ]
      });
    }
    catch(error) {
      console.log(error);
      throw error;
    }
  };
};

// Runs all seed functions
async function seedAllTables() {
  await userSeed();
  await itemSeed();
  await reviewSeed();
  await commentSeed();
};

seedAllTables();

try {
    async () => { await prisma.$disconnect(); }
}
catch {
    async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
};