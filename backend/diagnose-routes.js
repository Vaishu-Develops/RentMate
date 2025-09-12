// This script will help diagnose issues with route registration
// Run it with: node diagnose-routes.js

const express = require('express');
const fs = require('fs');
const path = require('path');

// Create a test Express app
const app = express();

// Try to load the auth routes
try {
  const authRoutesPath = path.join(__dirname, 'routes', 'auth.js');
  console.log(`Looking for auth routes at: ${authRoutesPath}`);
  
  if (fs.existsSync(authRoutesPath)) {
    console.log('✅ Auth routes file exists');
    
    // Try to require the file
    try {
      const authRoutes = require('./routes/auth.js');
      console.log('✅ Auth routes loaded successfully');
      
      // Check if it's a router
      if (authRoutes && typeof authRoutes === 'function' && authRoutes.stack) {
        console.log('✅ Auth routes is a valid Express router');
        
        // List all routes in the router
        console.log('\n📋 Routes defined in auth.js:');
        authRoutes.stack.forEach(r => {
          if (r.route && r.route.path) {
            const methods = Object.keys(r.route.methods).join(', ').toUpperCase();
            console.log(`  ${methods} /api/auth${r.route.path}`);
          }
        });
        
        // Mount the router to our test app
        app.use('/api/auth', authRoutes);
        
        // List all registered routes in the app
        console.log('\n📋 All registered routes:');
        app._router.stack.forEach(middleware => {
          if (middleware.route) {
            // Routes defined directly on the app
            const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
            console.log(`  ${methods} ${middleware.route.path}`);
          } else if (middleware.name === 'router') {
            // Router middleware
            middleware.handle.stack.forEach(handler => {
              if (handler.route) {
                const baseUrl = middleware.regexp.toString()
                  .replace('\\^', '')
                  .replace('\\/?(?=\\/|$)', '')
                  .replace(/\\\//g, '/');
                
                const path = baseUrl + handler.route.path;
                const methods = Object.keys(handler.route.methods).join(', ').toUpperCase();
                console.log(`  ${methods} ${path}`);
              }
            });
          }
        });
        
      } else {
        console.log('❌ Auth routes is not a valid Express router');
        console.log('Type:', typeof authRoutes);
        console.log('Value:', authRoutes);
      }
    } catch (requireError) {
      console.log('❌ Error loading auth routes:');
      console.log(requireError);
    }
  } else {
    console.log('❌ Auth routes file does not exist');
  }
} catch (error) {
  console.log('❌ Error during diagnosis:');
  console.log(error);
}
