const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const existing = await User.findOne({ email: 'admin@echoboard.com' });
  if (!existing) {
    await User.create({
      name: 'EchoBoard Admin',
      username: 'admin',
      email: 'admin@echoboard.com',
      password: 'admin123',
      role: 'admin',
      bio: 'Platform administrator of EchoBoard',
    });
    console.log('✅ Admin user created: admin@echoboard.com / admin123');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  await mongoose.disconnect();
}

seed().catch(console.error);
