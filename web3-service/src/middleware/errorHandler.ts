export const errorHandler = (error: any, req: any, res: any, next: any) => {
  console.error('Web3 Service Error:', error);

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error.stack : 'INTERNAL_ERROR'
  });
};
