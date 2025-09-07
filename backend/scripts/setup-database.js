const mongoose = require('mongoose');
const User = require('../models/User');
const Grievance = require('../models/Grievance');
const Reward = require('../models/Reward');

// Sample data for seeding
const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    gender: 'male',
    age: 30,
    region: 'Delhi',
    role: 'citizen',
    points: 150,
    isVerified: true
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    gender: 'female',
    age: 25,
    region: 'Mumbai',
    role: 'citizen',
    points: 200,
    isVerified: true
  },
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    gender: 'male',
    age: 35,
    region: 'Delhi',
    role: 'admin',
    points: 500,
    isVerified: true
  }
];

const sampleGrievances = [
  {
    title: 'Broken Street Light',
    description: 'Street light is not working on Main Street, causing safety issues at night.',
    category: 'infrastructure',
    priority: 'medium',
    status: 'pending',
    location: {
      coordinates: [77.2090, 28.6139],
      address: 'Main Street, Delhi',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      pincode: '110001'
    },
    attachments: []
  },
  {
    title: 'Pothole on Road',
    description: 'Large pothole causing traffic issues and vehicle damage.',
    category: 'roads',
    priority: 'high',
    status: 'in_progress',
    location: {
      coordinates: [77.2090, 28.6139],
      address: 'Ring Road, Delhi',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      pincode: '110001'
    },
    attachments: []
  }
];

const sampleRewards = [
  {
    name: 'Food Coupon',
    description: 'Get 20% off on your next meal',
    type: 'citizen',
    category: 'food',
    pointsRequired: 50,
    gender: 'male'
  },
  {
    name: 'Bus Pass',
    description: 'Free bus pass for one month',
    type: 'citizen',
    category: 'transport',
    pointsRequired: 100,
    gender: 'female'
  },
  {
    name: 'Healthcare Voucher',
    description: 'Free health checkup voucher',
    type: 'citizen',
    category: 'healthcare',
    pointsRequired: 150,
    gender: 'female'
  }
];

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/citizen-grievance', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');
    
    // Clear existing data
    await User.deleteMany({});
    await Grievance.deleteMany({});
    await Reward.deleteMany({});
    
    // Create users
    const users = await User.create(sampleUsers);
    console.log(`✅ Created ${users.length} users`);
    
    // Create grievances with user references
    const grievances = await Grievance.create(
      sampleGrievances.map(grievance => ({
        ...grievance,
        citizen: users[0]._id // Assign to first user
      }))
    );
    console.log(`✅ Created ${grievances.length} grievances`);
    
    // Create rewards
    const rewards = await Reward.create(sampleRewards);
    console.log(`✅ Created ${rewards.length} rewards`);
    
    console.log('🎉 Database seeded successfully!');
    console.log('\n📊 Sample Data:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Grievances: ${grievances.length}`);
    console.log(`- Rewards: ${rewards.length}`);
    
    return { users, grievances, rewards };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

const main = async () => {
  try {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}

module.exports = { connectDB, seedDatabase };
