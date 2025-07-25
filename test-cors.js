// Test CORS configuration
const testCORS = async () => {
  const baseURL = 'http://172.24.2.150:3001';
  
  try {
    console.log('Testing CORS with health endpoint...');
    const response = await fetch(`${baseURL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ CORS test successful:', data);
    } else {
      console.log('❌ CORS test failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ CORS test error:', error.message);
  }
  
  try {
    console.log('Testing CORS with OPTIONS preflight...');
    const response = await fetch(`${baseURL}/api/auth/me`, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://172.24.2.150:3000'
      },
    });
    
    console.log('✅ OPTIONS preflight successful:', response.status);
  } catch (error) {
    console.log('❌ OPTIONS preflight error:', error.message);
  }
};

testCORS();
