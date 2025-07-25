# Backend Specifications

## TypeScript Configuration

### Overview
The backend has been successfully migrated to TypeScript with Zod integration for runtime validation and type inference. The configuration avoids strict mode for flexibility while maintaining type safety through `noImplicitAny: true`.

### TypeScript Configuration (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": false,
    "noImplicitAny": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitReturns": false,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": false,
    "exactOptionalPropertyTypes": false,
    "noImplicitOverride": false,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false
  }
}
```

### Key Configuration Decisions
- **`strict: false`**: Avoids overly restrictive type checking for easier migration
- **`noImplicitAny: true`**: Catches missing types without being too rigid
- **`noImplicitReturns: false`**: Allows flexible return patterns in route handlers
- **`esModuleInterop: true`**: Enables seamless CommonJS/ES module interoperability

## Zod Integration

### Schema Structure (`src/schemas/zod-schemas.ts`)
Comprehensive Zod schemas for all models with proper type inference:

```typescript
// Base entity schema
export const BaseEntitySchema = z.object({
  _id: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Model schemas with type inference
export const UserSchema = BaseEntitySchema.extend({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  email: z.string().email('Invalid email format'),
  passwordHash: z.string().min(1, 'Password hash is required'),
  roles: z.array(UserRoleSchema).min(1, 'At least one role is required'),
});

export type User = z.infer<typeof UserSchema>;
```

### Request/Response Schemas
- **Authentication**: `LoginRequestSchema`, `RegisterRequestSchema`
- **Customer Management**: `CreateCustomerRequestSchema`, `UpdateCustomerRequestSchema`
- **Order Management**: `CreateOrderRequestSchema`, `UpdateOrderRequestSchema`
- **Tenant Management**: `TenantRegistrationSchema`

### Validation Middleware
Zod-powered validation middleware for request validation:

```typescript
const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Handle validation errors
      }
    }
  };
};
```

## Model Architecture

### TypeScript Models
All models converted to TypeScript with proper interfaces:

```typescript
// Example: User Model
export interface IUser extends Document {
  tenantId: string;
  email: string;
  passwordHash: string;
  roles: string[];
}

const userSchema = new Schema<IUser>({
  tenantId: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: false },
  passwordHash: { type: String, required: true },
  roles: [{ type: String, enum: ['admin', 'agent', 'customer'], required: true }],
});
```

### Model Files
- `src/models/User.ts` - User management with tenant isolation
- `src/models/Customer.ts` - Customer data with contact information
- `src/models/Order.ts` - Order management with status tracking
- `src/models/Tenant.ts` - Tenant configuration and settings

## Middleware Architecture

### TypeScript Middleware
All middleware converted to TypeScript with proper type annotations:

```typescript
// Example: Authentication Middleware
interface AuthRequest extends Request {
  user?: {
    id: string;
    tenantId: string;
    roles: string[];
  };
}

function auth(req: AuthRequest, res: Response, next: NextFunction): void {
  // JWT validation logic
}
```

### Middleware Files
- `src/middlewares/auth.ts` - JWT authentication
- `src/middlewares/tenantExtractor.ts` - Tenant identification from subdomain
- `src/middlewares/validateTenant.ts` - Tenant validation
- `src/middlewares/roles.ts` - Role-based authorization
- `src/middlewares/validation.ts` - Zod-based request validation

## Route Architecture

### TypeScript Routes
All routes converted to TypeScript with proper error handling:

```typescript
// Example: Customer Routes
router.get('/', async (req: CustomerRequest, res: Response) => {
  try {
    // Route logic with proper error handling
    res.json({ success: true, data: customers });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
```

### Route Files
- `src/routes/auth.routes.ts` - Authentication endpoints
- `src/routes/tenant.routes.ts` - Tenant management
- `src/routes/customer.routes.ts` - Customer CRUD operations
- `src/routes/order.routes.ts` - Order management

## Global Types (`src/types/global.d.ts`)

### Express Extensions
```typescript
declare global {
  namespace Express {
    interface Request {
      tenant?: Tenant;
      user?: User;
      tenantId?: string;
    }
  }
}
```

### Common Interfaces
- `JWTPayload` - JWT token structure
- `DatabaseConnection` - Database connection configuration
- `ValidationError` - Validation error structure
- `APIError` - API error response structure
- `PaginationOptions` - Pagination configuration
- `TenantContext` - Tenant context information
- `UserContext` - User context information

## Development Scripts

### Package.json Scripts
```json
{
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc",
    "dev": "ts-node src/server.ts",
    "dev:watch": "nodemon --exec ts-node src/server.ts",
    "test": "ts-node test-server.ts",
    "lint": "eslint ./src --ext .ts",
    "lint:fix": "eslint ./src --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "format:fix": "prettier --write \"src/**/*.ts\" --fix",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  }
}
```

## Dependencies

### TypeScript Dependencies
```json
{
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/morgan": "^1.9.9",
    "@types/node": "^20.19.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.7.2"
  }
}
```

## Testing and Validation

### Type Checking
```bash
npm run type-check  # TypeScript compilation check
```

### Development Server
```bash
npm run dev  # Start development server with ts-node
```

### Build Process
```bash
npm run build  # Compile TypeScript to JavaScript
npm start      # Run compiled JavaScript
```

## Benefits of TypeScript Migration

### 1. Type Safety
- Compile-time error detection
- IntelliSense and autocomplete support
- Refactoring safety

### 2. Zod Integration
- Runtime validation with type inference
- Automatic type generation from schemas
- Consistent validation across the application

### 3. Developer Experience
- Better IDE support
- Easier debugging
- Improved code documentation

### 4. Maintainability
- Clear interfaces and contracts
- Easier onboarding for new developers
- Reduced runtime errors

## Migration Notes

### Completed Steps
- ✅ Added `tsconfig.json` with flexible configuration
- ✅ Renamed all `.js` files to `.ts`
- ✅ Installed TypeScript dependencies
- ✅ Created comprehensive Zod schemas
- ✅ Converted all models to TypeScript
- ✅ Updated all middleware with proper types
- ✅ Converted all routes to TypeScript
- ✅ Added global type definitions
- ✅ Verified TypeScript compilation
- ✅ Tested development server

### Key Decisions
- Avoided strict mode for flexibility
- Used `noImplicitAny: true` for essential type checking
- Implemented comprehensive Zod schemas for validation
- Maintained backward compatibility during migration
- Used proper error handling throughout

## Future Enhancements

### Potential Improvements
1. **Strict Mode**: Gradually enable strict mode as codebase matures
2. **Advanced Zod Features**: Implement more complex validation rules
3. **Type Guards**: Add runtime type checking utilities
4. **API Documentation**: Generate OpenAPI specs from Zod schemas
5. **Testing**: Add comprehensive TypeScript-based tests

### Monitoring
- Regular type checking with `npm run type-check`
- Linting with `npm run lint`
- Formatting with `npm run format` 