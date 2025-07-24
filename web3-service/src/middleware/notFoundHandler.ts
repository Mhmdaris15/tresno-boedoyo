export const notFoundHandler = (req: any, res: any) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    error: 'NOT_FOUND'
  });
};
