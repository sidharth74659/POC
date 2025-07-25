import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

/**
 * Middleware to validate request body using Zod schema
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as any;
        const errors = zodError.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors,
        });
        return;
      }
      next(error);
    }
  };
};

/**
 * Middleware to validate request parameters using Zod schema
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.params);
      req.params = validatedData as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as any;
        const errors = zodError.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors,
        });
        return;
      }
      next(error);
    }
  };
};

/**
 * Middleware to validate request query using Zod schema
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.query);
      req.query = validatedData as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as any;
        const errors = zodError.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors,
        });
        return;
      }
      next(error);
    }
  };
};

/**
 * Middleware to validate and format response using Zod schema
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 */
const validateResponse = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const originalJson = res.json;
    res.json = function (data: any) {
      try {
        const validatedData = schema.parse(data);
        return originalJson.call(this, validatedData);
      } catch (error) {
        if (error instanceof ZodError) {
          const zodError = error as any;
          console.error('Response validation failed:', zodError.errors);
          // Still send the response but log the validation error
          return originalJson.call(this, data);
        }
        return originalJson.call(this, data);
      }
    };
    next();
  };
};

export {
  validateBody,
  validateParams,
  validateQuery,
  validateResponse,
}; 