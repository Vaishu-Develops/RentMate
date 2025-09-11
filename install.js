#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏠 RentMate Platform Setup');
console.log('==========================\n');

// Function to run commands
const runCommand = (command, cwd = process.cwd()) => {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit', cwd });
    return true;
  } catch (error) {
    console.error(`Failed to execute: ${command}`);
    return false;
  }
};

// Function to create .env files
const createEnvFile = (filePath, content) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created ${filePath}`);
  } else {
    console.log(`⚠️  ${filePath} already exists, skipping...`);
  }
};

console.log('📦 Installing dependencies...\n');

// Install root dependencies
console.log('Installing root dependencies...');
if (!runCommand('npm install')) {
  process.exit(1);
}

// Install client dependencies
console.log('\nInstalling client dependencies...');
if (!runCommand('npm install', './client')) {
  process.exit(1);
}

// Install server dependencies
console.log('\nInstalling server dependencies...');
if (!runCommand('npm install', './server')) {
  process.exit(1);
}

console.log('\n🔧 Setting up environment files...\n');

// Create client .env
const clientEnv = `VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=RentMate
VITE_APP_VERSION=1.0.0
`;

createEnvFile('./client/.env', clientEnv);

// Create server .env from example
const serverEnvExample = fs.readFileSync('./server/.env.example', 'utf8');
createEnvFile('./server/.env', serverEnvExample);

console.log('\n✅ Setup completed successfully!\n');

console.log('🚀 Next Steps:');
console.log('==============');
console.log('1. Configure your environment variables in server/.env');
console.log('   - Add your MongoDB connection string');
console.log('   - Add your Gemini API key');
console.log('   - Configure email settings');
console.log('');
console.log('2. Start the development servers:');
console.log('   npm run dev');
console.log('');
console.log('3. Open your browser:');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend:  http://localhost:5000');
console.log('');
console.log('📚 For detailed setup instructions, see README.md');
console.log('');
console.log('🏠 Welcome to RentMate - Smart Rental Management Platform!');