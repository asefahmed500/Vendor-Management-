# AGENTS.md

This file guides AI agents working on the VMS (Vendor Management System) codebase.

## Development Commands

### Core Commands
```bash
npm run dev              # Start development server (localhost:3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npx tsc --noEmit         # TypeScript type check
```

### Testing Commands
```bash
npm test                 # Run all Jest unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run all Playwright E2E tests
npm run test:e2e:ui      # Run E2E tests with Playwright UI
```

### Database Scripts
```bash
npm run seed             # Seed database with sample data (vendors, proposals, documents)
npm run seed:admin       # Seed admin user
npm run reset:admin      # Reset admin password
```

### Running Single Tests
```bash
# Jest - run specific file
npm test -- path/to/file.test.ts

# Jest - run tests matching pattern
npm test -- --testPathPattern="guards"

# Jest - run specific test by name
npm test -- -t "should authorize user with valid role"

# Playwright - run specific file
npx playwright test e2e/auth-flows.spec.ts --project=chromium

# Playwright - run tests with specific project
npx playwright test --project=chromium
```

## Code Style Guidelines

### TypeScript & Types
- **Strict mode enabled** - All types must be properly defined
- **Interfaces**: Prefix domain types with `I` (e.g., `IUser`, `IVendor`)
- **Types**: Use for utility types and non-domain constructs
- **Generics**: Use `<T>` for generic type parameters
- **Never use `any`** - Use `unknown` with type guards if needed

### Naming Conventions
- **Variables/Functions**: `camelCase` (e.g., `getUserData`, `isLoading`)
- **Classes/Interfaces/Types**: `PascalCase` (e.g., `User`, `IAuthResponse`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `MAX_RETRIES`)
- **Files**: `kebab-case` for lib/utils, `PascalCase` for components

### Import Order
```typescript
// 1. External imports
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

// 2. Internal imports with @/ alias
import { guard } from '@/lib/auth/guards';
import { ApiResponse } from '@/lib/types/api';
import User from '@/lib/db/models/User';
```

### API Routes Pattern
```typescript
export async function GET(request: NextRequest) {
  try {
    const { authorized, user } = await guard(request, ['ADMIN']);
    if (!authorized || !user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' }, { status: 401 }
      );
    }
    await connectDB();
    return NextResponse.json<ApiResponse>(
      { success: true, data: { result} }, { status: 200 }
    );
  } catch (error) {
    console.error('Operation error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Internal server error' }, { status: 500 }
    );
  }
}
```

### Error Handling & Validation
- Use try/catch in all async functions
- ZodError: Extract fieldErrors for validation responses
- Console.error for logging; never expose stack traces in production
- Mock external dependencies with `jest.mock()`, use beforeEach for test isolation

### Database (Mongoose)
- Define document interface: `export interface IUserDocument extends Omit<IUser, '_id'>, Document`
- Add indexes: `UserSchema.index({ email: 1 })`
- Pre-save hooks: bcrypt password hashing (12 rounds)

### React Components
- Default server components; use `'use client'` only for hooks (useState, useEffect)
- Client components: fetch data via API routes
- Styling: Tailwind utility classes, avoid inline styles

### State Management
- Use Zustand for global client state: stores in `@/lib/stores/`

### Forms & Validation
- React Hook Form + Zod resolver
- Radix UI primitives from `@radix-ui/react-*`
- Schema validation in `@/lib/validation/schemas/`

### Testing
- Jest: Unit tests in `__tests__` or `*.test.ts`
- Playwright: E2E tests in `e2e/*.spec.ts`

### Auth & Response Format
- Guards: `adminGuard`, `vendorGuard`, `authGuard` from `@/lib/auth/guards`
- Roles: `'ADMIN' | 'VENDOR'`, JWT in HTTP-only cookies
- Response: `{ success: true, data: {...} }` or `{ success: false, error: '...' }`

## File Organization
```
app/                    # Next.js pages, layouts, API routes
lib/auth/               # Guards, JWT, middleware
lib/db/                 # Mongoose models, connection
lib/middleware/         # Rate limiting, error handling
lib/services/           # Business logic
lib/stores/             # Zustand state stores
lib/types/              # TypeScript definitions
lib/utils/              # Utility functions
lib/validation/         # Zod schemas
components/             # React components
e2e/                    # Playwright tests
```

## Key Dependencies
- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB with Mongoose
- **Auth**: Better Auth + JWT (jose)
- **UI**: Radix UI, Tailwind CSS v4, Lucide icons
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts | **PDF**: jsPDF

## Design System (Corporate Minimal)
- **Fonts**: DM Sans (body), Syne (headings), JetBrains Mono (code)
- **Colors**: #FAFAFA background, zinc-950 primary, blue-500 accent
- **Animations**: Subtle transitions, prefers-reduced-motion support

## Important Notes
- NO comments unless explaining complex logic
- Call `await connectDB()` in API routes
- Convert ObjectId to string in API responses: `.toString()`
- Rate limit public endpoints, validate all input with Zod
- Use proper ellipsis character `…` not three dots `...`
- Avoid `transition: all` - use specific properties like `transition-colors`
- Support `prefers-reduced-motion` for accessibility

## Common Issues & Fixes Learned

### Serialization Gotcha
The `serialize()` utility in `lib/utils/serialization.ts` only converts `_id` to string but doesn't populate the optional `id` field in interfaces like `IVendor`. When updating this utility, ensure both `_id` and `id` fields are set:
```typescript
if (key === '_id' && val && typeof val === 'object') {
  obj[key] = val.toString();
  obj.id = val.toString(); // Critical for UI compatibility
}
```

### TypeScript Interface Extension
When extending interfaces that contain optional fields (like `IDocument` in `admin/documents/page.tsx`), use `Omit` to avoid conflicts:
```typescript
// Correct
interface DocumentWithVendor extends Omit<IDocument, 'documentType'> {
  vendorName: string;
  vendorEmail: string;
  documentType: { name: string };
}

// Incorrect - causes "property X is incompatible" errors
interface DocumentWithVendor extends IDocument {
  // ... 
}
```

### Optional Date Handling
When accessing potentially undefined dates (like `submission.submittedAt`), always check for null/undefined:
```typescript
{submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}
```

### Feature Flags
Check `process.env.NEXT_PUBLIC_ENABLE_REGISTRATION` before showing registration links. Defaults to `true` but can be disabled in production.

### Auth System
- Uses HTTP-only cookies (Better Auth) - no need to manually handle tokens in API calls
- Guards (`adminGuard`, `vendorGuard`, `authGuard`) validate sessions from cookies
- Always await the guard result: `const { authorized, user } = await guard(request, roles);`

### E2E Test Selectors
The UI uses custom headings per the ElevenLabs design system:
- Login: "Identity Validation" (not "Sign In")
- Register: "Entity Enrollment" (not "Create Account")
- Forgot Password: "Identity Recovery" (not "Check your inbox")
Use role-based selectors when text varies: `page.getByRole('link', { name: /Create account/i })`