const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        const users = await User.find({}, {
            email: 1,
            emailVerificationToken: 1,
            emailVerificationExpires: 1,
            isEmailVerified: 1,
            createdAt: 1
        }).sort({ createdAt: -1 }).limit(5);
        
        console.log('\n📋 Recent users in database:');
        users.forEach((user, index) => {
            console.log(`\n${index + 1}. Email: ${user.email}`);
            console.log(`   Verified: ${user.isEmailVerified}`);
            console.log(`   Token: ${user.emailVerificationToken ? user.emailVerificationToken.substring(0, 10) + '...' : 'None'}`);
            console.log(`   6-char code: ${user.emailVerificationToken ? user.emailVerificationToken.substring(0, 6).toUpperCase() : 'None'}`);
            console.log(`   Expires: ${user.emailVerificationExpires ? new Date(user.emailVerificationExpires).toLocaleString() : 'None'}`);
            console.log(`   Created: ${user.createdAt ? new Date(user.createdAt).toLocaleString() : 'None'}`);
        });
        
        console.log('\n🔍 Looking for recent unverified users...');
        const unverified = await User.find({
            isEmailVerified: false,
            emailVerificationExpires: { $gt: Date.now() }
        });
        
        console.log(`Found ${unverified.length} unverified users with valid tokens`);
        unverified.forEach(user => {
            const code = user.emailVerificationToken ? user.emailVerificationToken.substring(0, 6).toUpperCase() : 'None';
            console.log(`   ${user.email}: Code ${code}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

checkUsers();
