const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    console.log('🔍 Testing MongoDB Connection...\n');
    
    const uri = process.env.MONGODB_URI;
    console.log('📍 Connection URI (masked):', uri.replace(/:[^:@]*@/, ':***@'));
    
    // Test 1: Basic Connection
    try {
        console.log('⏳ Attempting to connect...');
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000, // 10 seconds
            connectTimeoutMS: 10000,
        });
        
        console.log('✅ Successfully connected to MongoDB!');
        
        // Test 2: Database Operations
        const testCollection = mongoose.connection.db.collection('connection_test');
        
        console.log('⏳ Testing database operations...');
        await testCollection.insertOne({ test: true, timestamp: new Date() });
        console.log('✅ Database write test passed!');
        
        const result = await testCollection.findOne({ test: true });
        console.log('✅ Database read test passed!');
        
        await testCollection.deleteMany({ test: true });
        console.log('✅ Database cleanup completed!');
        
        console.log('\n🎉 All tests passed! Your MongoDB connection is working perfectly.');
        
    } catch (error) {
        console.log('\n❌ Connection failed!');
        console.log('Error details:', error.message);
        
        if (error.message.includes('IP')) {
            console.log('\n🛠️  SOLUTION: IP Whitelist Issue');
            console.log('1. Go to https://cloud.mongodb.com');
            console.log('2. Select your project');
            console.log('3. Go to Network Access');
            console.log('4. Click "Add IP Address"');
            console.log('5. Add your current IP or use 0.0.0.0/0 (allow all) for development');
        } else if (error.message.includes('authentication')) {
            console.log('\n🛠️  SOLUTION: Authentication Issue');
            console.log('1. Check your username and password in .env file');
            console.log('2. Make sure the database user exists in MongoDB Atlas');
            console.log('3. Verify the user has read/write permissions');
        }
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

testConnection();
