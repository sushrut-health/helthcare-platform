import { app } from './app.js';
import { config } from './config/index.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Sushrut Healthcare Platform Backend API Server`);
  console.log(`📍 Listening on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${config.env}`);
  console.log(`📁 File Storage Provider: ${config.storage.provider}`);
  console.log(`🩺 REST API Base: http://localhost:${PORT}/api/v1`);
  console.log(`====================================================`);
});
