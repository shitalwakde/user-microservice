require('dotenv').config({ 
  path: `config/${process.env.NODE_ENV || 'dev'}.env`
});

const express = require('express');
const bodyParser = require('body-parser');
const employeeRoutes = require('./routes/employeeRoutes');

// Initialize AWS SDK only when needed
const initializeAWS = async () => {
  const AWS = require('aws-sdk');
  const ssm = new AWS.SSM();
  
  try {
    const params = await ssm.getParameters({
      Names: [
        '/prod/user-service/db_host', 
        '/prod/user-service/db_user',
        '/prod/user-service/db_pass'
      ],
      WithDecryption: true
    }).promise();
    
    params.Parameters.forEach(param => {
      const key = param.Name.split('/').pop().toUpperCase();
      process.env[`DB_${key}`] = param.Value;
    });
    
    return true;
  } catch (err) {
    console.error('Failed to load SSM parameters:', err);
    return false;
  }
};

const startServer = () => {
  const app = express();
  
  // Middleware
  app.use(bodyParser.json());
  
  // Routes
  app.use('/api', employeeRoutes);
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

// Main execution
if (process.env.NODE_ENV === 'prod') {
  initializeAWS().then(success => {
    if (success) startServer();
    else process.exit(1);
  });
} else {
  startServer();
}