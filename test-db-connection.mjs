
import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://affworldtechnologies:wMbiyR0ZM8JWfOYl@loc.6qmwn3p.mongodb.net/whitlin-ecommerce-new?retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Successfully connected to MongoDB!');
    console.log('Database name:', mongoose.connection.db.databaseName);

    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    await mongoose.disconnect();
    console.log('Disconnected.');
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

testConnection();
