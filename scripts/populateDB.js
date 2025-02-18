const env_path = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'
require('dotenv').config({ path: env_path })
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const Role = require('../schemas/role');
const User = require('../schemas/user');
const Play = require('../schemas/play');

const seedDB = async () => {
  try {
    // Conexión a MongoDB usando la variable de entorno MONGO_URI
    const db_url = process.env.MONGO_URL_AUTH_ENABLED || 'mongodb://adminTeatro:passTeatro@127.0.0.1:27017/'
    const db_name = process.env.MONGO_DB || 'teatro'

    // MongoDB database initialization
    await initDatabase()
    console.log('Database connection established successfully!')

    async function initDatabase() {
      await mongoose.connect(db_url + db_name, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        //tls: true, // Cifra la conexión con SSL/TLS
        authMechanism: 'SCRAM-SHA-256' // Usa autenticación segura
      })
    }

    const initialRoles = [
      {
        _id: new ObjectId('000000000000000000000000'),
        name: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: new ObjectId('000000000000000000000001'),
        name: 'client',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const initialUsers = [
      {
        _id: new ObjectId('000000000000000000000000'),
        email: 'admin@admin.com',
        password: '$2b$10$uJQdgVBiMmVCiri7egVifu/IbeR4rV59/GXA6qZMzqe9kkRmsb.f6', // 1234
        firstName: 'Admin',
        lastName: 'Istrator',
        role: new ObjectId('000000000000000000000000'), // Admin
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      },
    ]

    const initialPlay = {
      _id: new ObjectId('6574cb460627af3472703c24'),
      name: 'tin pan alley, noches de broadway',
      plot: 'un hermoso musical inspirado en los comienzos de broadway. test',
      cast: 'Belén Cabrera, Joaquín Catarineu',
      performances: [],
      imgName: 'obra1.jpg',
      __v: 0
    }

    await mongoose.connection.collection('roles').insertMany(initialRoles)
    console.log('Roles seeded successfully')

    await mongoose.connection.collection('users').insertMany(initialUsers)
    console.log('Users seeded successfully')

    await mongoose.connection.collection('plays').insertOne(initialPlay)
    console.log('Play seeded successfully')

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();