export interface Environment {
    NODE_ENV: 'development' | 'production';
  }
  
  const env: Environment = {
    NODE_ENV: (process.env.NODE_ENV as 'development' | 'production') || 'development',
  };
  
  export default env;