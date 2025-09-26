# GCO Inventory Management System v2.0

A comprehensive Enterprise Resource Planning (ERP) system built with Next.js 15, focusing on inventory management, purchase operations, sales tracking, and reporting for organizations.

## 🚀 Features

### Core Modules
- **Inventory Management** - Stock items, opening balance, damage items tracking
- **Purchase Management** - Orders, invoices, challans, requisitions, returns, supplier management
- **Sales Management** - Orders, invoices, challans, quotations, returns, customer management
- **Data Management** - Organizations, branches, products, warehouses, product groups/units
- **Reporting** - Monthly reports, purchase reports, sales reports
- **User Management** - Admin accounts, organization members, role-based access

### Key Features
- 🏢 Multi-organization support with role-based access
- 📊 Real-time inventory tracking and reporting
- 🎨 Modern, responsive UI with dark/light theme support
- 📱 Mobile-friendly design
- 🔐 Secure authentication with JWT
- 📈 Export functionality for reports
- 🔄 Real-time data updates with SWR

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) with Radix UI primitives
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: [SWR](https://swr.vercel.app/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

### Backend
- **Runtime**: Node.js
- **Database**: PostgreSQL with [Prisma ORM](https://prisma.io/)
- **Authentication**: JWT with [jose](https://github.com/panva/jose)
- **Password Hashing**: bcrypt
- **Validation**: [Zod](https://zod.dev/)

### Development Tools
- **Package Manager**: Bun (preferred) / npm / yarn / pnpm
- **Linting**: ESLint 9 with Next.js config
- **Formatting**: Prettier with Tailwind CSS plugin
- **Type Checking**: TypeScript 5.8+ with strict mode
- **Database**: Prisma ORM 6.4+ with PostgreSQL
- **Build Tool**: Next.js built-in Turbopack (dev) / Webpack (prod)
- **Version Control**: Git with conventional commits

## 📁 Project Structure

```
gco-inventory-v2/
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin dashboard
│   │   ├── data/                 # Master data management
│   │   │   ├── branch/           # Branch management
│   │   │   ├── organization/     # Organization management
│   │   │   ├── product-group/    # Product categorization
│   │   │   ├── product-unit/     # Product units
│   │   │   ├── products/         # Product management
│   │   │   └── warehouse/        # Warehouse management
│   │   ├── inventory/            # Inventory operations
│   │   │   ├── damage-items/     # Damaged inventory tracking
│   │   │   ├── opening-balance/  # Initial stock setup
│   │   │   └── stock-items/      # Current stock management
│   │   ├── purchase/             # Purchase operations
│   │   │   ├── challan/          # Purchase delivery notes
│   │   │   ├── invoice/          # Purchase invoicing
│   │   │   ├── order/            # Purchase orders
│   │   │   ├── requisition/      # Purchase requests
│   │   │   ├── return/           # Purchase returns
│   │   │   └── supplier/         # Supplier management
│   │   ├── report/               # Reporting module
│   │   │   ├── monthly/          # Monthly reports
│   │   │   ├── purchase/         # Purchase analytics
│   │   │   └── sales/            # Sales analytics
│   │   └── sales/                # Sales operations
│   │       ├── challan/          # Sales delivery notes
│   │       ├── customer/         # Customer management
│   │       ├── invoice/          # Sales invoicing
│   │       ├── order/            # Sales orders
│   │       ├── quotation/        # Sales quotations
│   │       └── return/           # Sales returns
│   ├── login/                    # Authentication
│   └── register/                 # User registration
├── components/                   # Reusable components
│   ├── admin-panel/              # Admin layout components
│   ├── pages/                    # Page-specific components
│   ├── provider/                 # Context providers
│   ├── shared/                   # Shared utility components
│   └── ui/                       # shadcn/ui components
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions and configurations
├── prisma/                       # Database schema and client
├── types/                        # TypeScript type definitions
└── public/                       # Static assets
```

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/devshahoriar/gco_inventory_v2.git
   cd gco-inventory-v2
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/gco_inventory"
   JWT_SECRET="your-jwt-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   bunx prisma generate
   
   # Run database migrations
   bunx prisma db push
   
   # (Optional) Seed the database
   bunx prisma db seed
   ```

5. **Start the development server**
   ```bash
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

```bash
# Development
bun dev          # Start development server with hot reload
bun build        # Build for production (optimized bundle)
bun start        # Start production server
bun lint         # Run ESLint for code quality
bun lint:fix     # Fix auto-fixable ESLint issues
bun type-check   # Run TypeScript compiler check
bun format       # Format code with Prettier

# Database Operations
bunx prisma studio        # Open Prisma Studio (database GUI)
bunx prisma generate      # Generate Prisma client
bunx prisma db push       # Push schema changes to database
bunx prisma db pull       # Pull schema from database
bunx prisma migrate dev   # Create and apply migration
bunx prisma migrate reset # Reset database and apply all migrations
bunx prisma db seed       # Run database seed scripts

# Testing & Quality
bun test              # Run unit tests
bun test:watch        # Run tests in watch mode
bun test:coverage     # Run tests with coverage report
bun analyze           # Analyze bundle size
bun clean             # Clean build artifacts and caches

# Production
bun build:analyze     # Build with bundle analyzer
bun start:prod       # Start production server with PM2
```

## 🗄️ Database Schema

The system uses PostgreSQL with Prisma ORM. Key models include:

- **AdminUsers** - System administrators
- **Organization** - Company/organization entities
- **OrganizationMembers** - User-organization relationships
- **Products** - Product catalog
- **Inventory** - Stock tracking
- **Purchase/Sales Orders** - Transaction records
- **Suppliers/Customers** - Business partner records

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) and Radix UI primitives:

- **Forms**: Input, Select, Button, Label
- **Navigation**: Sidebar, Navbar, Breadcrumbs
- **Data Display**: Table, Card, Badge, Avatar
- **Feedback**: Toast notifications, Loading states
- **Overlays**: Dialog, Popover, Tooltip, Sheet

## 🔐 Authentication & Authorization

- **JWT-based authentication** with secure token handling
- **Role-based access control** for different user types
- **Organization-level permissions** for multi-tenant support
- **Password hashing** with bcrypt
- **Secure middleware** for route protection

## 📊 State Management

- **Zustand** for global state management
- **SWR** for server state synchronization
- **React hooks** for local component state
- **Immer** for immutable state updates

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build the application
bun build

# Start production server
bun start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions, please contact the development team or create an issue in the GitHub repository.

---

**GCO Inventory Management System v2.0** - Built with ❤️ using Next.js and modern web technologies.

## 🏗️ Technical Architecture

### Application Architecture
- **Pattern**: Model-View-Controller (MVC) with Server Components
- **Routing**: Next.js App Router with file-based routing
- **API Layer**: Next.js API routes with TypeScript
- **Database Layer**: Prisma ORM with connection pooling
- **Authentication**: JWT with httpOnly cookies and middleware protection
- **State Management**: Client-side (Zustand) + Server-side (React Server Components)

### File Structure Convention
```
feature/
├── page.tsx              # Next.js page component (Server Component)
├── loading.tsx           # Loading UI for Suspense boundaries
├── error.tsx             # Error boundary component
├── layout.tsx            # Nested layout (if needed)
├── action.ts             # Server actions for mutations
├── type.ts               # TypeScript type definitions
├── Components.tsx        # Feature-specific components
└── hooks.ts              # Custom hooks (if needed)
```

### Code Organization Principles
- **Feature-based structure** - Group related files by feature/domain
- **Server-first approach** - Utilize Server Components for data fetching
- **Type-safe API** - Strong typing across client-server boundaries
- **Separation of concerns** - Clear distinction between UI, business logic, and data
- **Reusable components** - Shared components in `/components` directory

### Database Design Patterns
- **Multi-tenancy** - Organization-based data isolation
- **Audit trails** - CreatedAt/UpdatedAt timestamps on all entities
- **Referential integrity** - Foreign key constraints with cascading rules
- **Normalized schema** - 3NF compliance for data consistency
- **Indexing strategy** - Optimized queries with proper indexing

## 🔧 Development Guidelines

### Prerequisites & Environment Setup

#### Required Software
```bash
# Node.js 18+ (LTS recommended)
node --version  # Should be >= 18.0.0

# Bun (recommended) or npm/yarn/pnpm
bun --version   # Latest stable version

# PostgreSQL 14+
psql --version  # Should be >= 14.0

# Git
git --version
```

#### IDE Setup (VS Code Recommended)
Install the following extensions:
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "prisma.prisma",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-json",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### Project Setup

#### 1. Environment Configuration
Create `.env.local` with required variables:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/gco_inventory"

# Authentication
JWT_SECRET="your-super-secure-jwt-secret-key-minimum-32-characters"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Development
NODE_ENV="development"
LOG_LEVEL="debug"

# Optional: External APIs
SMTP_HOST=""
SMTP_USER=""
SMTP_PASS=""
```

#### 2. Database Setup
```bash
# Install PostgreSQL and create database
createdb gco_inventory

# Generate Prisma client
bunx prisma generate

# Push schema to database
bunx prisma db push

# Optional: Run database studio
bunx prisma studio
```

#### 3. Development Server
```bash
# Install dependencies
bun install

# Start development server
bun dev

# Run in debug mode
NODE_ENV=development DEBUG=* bun dev
```

### Coding Standards

#### TypeScript Configuration
- **Strict mode enabled** - Full type checking
- **Path aliases** - Use `@/` for absolute imports
- **No explicit any** - Avoid `any` type, use proper typing
- **Interface over type** - Prefer interfaces for object shapes

#### Component Development
```typescript
// ✅ Good - Server Component with proper typing
interface UserPageProps {
  params: { id: string }
  searchParams: { tab?: string }
}

export default async function UserPage({ params, searchParams }: UserPageProps) {
  const user = await getUser(params.id)
  return <UserProfile user={user} activeTab={searchParams.tab} />
}

// ✅ Good - Client Component with proper state management
'use client'
interface UserFormProps {
  onSubmit: (data: UserFormData) => Promise<void>
  initialData?: Partial<UserFormData>
}

export function UserForm({ onSubmit, initialData }: UserFormProps) {
  // Component implementation
}
```

#### Server Actions Pattern
```typescript
// action.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

export async function createUser(formData: FormData) {
  const validatedFields = CreateUserSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  })

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  try {
    await db.user.create({ data: validatedFields.data })
    revalidatePath('/users')
    redirect('/users')
  } catch (error) {
    return { error: 'Failed to create user' }
  }
}
```

#### Database Queries (Prisma)
```typescript
// ✅ Good - Type-safe queries with includes
export async function getOrderWithDetails(id: number) {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      customer: true,
      organization: true,
    },
  })
}

// ✅ Good - Optimized queries with select
export async function getOrdersList(organizationId: number) {
  return await prisma.order.findMany({
    where: { organizationId },
    select: {
      id: true,
      orderNumber: true,
      total: true,
      status: true,
      createdAt: true,
      customer: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
}
```

### Testing Strategy

#### Unit Testing
```bash
# Install testing dependencies
bun add -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom

# Run tests
bun test
```

#### Integration Testing
```typescript
// Example test structure
describe('User Management', () => {
  test('should create user successfully', async () => {
    // Test implementation
  })
  
  test('should validate user input', async () => {
    // Test implementation
  })
})
```

### Performance Optimization

#### Next.js Optimization
- **Server Components** - Use for data fetching and static content
- **Client Components** - Only for interactivity and browser APIs
- **Dynamic imports** - Code splitting for heavy components
- **Image optimization** - Use Next.js `Image` component
- **Font optimization** - Use Next.js font loading

#### Database Optimization
- **Connection pooling** - Configured in Prisma
- **Query optimization** - Use `select` instead of full fetches
- **Indexing** - Add indexes for frequently queried fields
- **Pagination** - Implement cursor-based pagination for large datasets

#### Caching Strategy
```typescript
// React Cache for server components
import { cache } from 'react'

export const getUser = cache(async (id: string) => {
  return await prisma.user.findUnique({ where: { id } })
})

// SWR for client-side caching
import useSWR from 'swr'

export function useOrganizations() {
  return useSWR('/api/organizations', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  })
}
```

### Security Guidelines

#### Authentication & Authorization
- **JWT tokens** - Stored in httpOnly cookies
- **Middleware protection** - Route-level authentication
- **Role-based access** - Organization and user-level permissions
- **Input validation** - Zod schemas for all user inputs
- **SQL injection prevention** - Prisma ORM parameterized queries

#### Data Protection
```typescript
// ✅ Good - Input validation
const UserSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(100),
})

// ✅ Good - Password hashing
import bcrypt from 'bcrypt'

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 12)
}
```

### Deployment Guidelines

#### Pre-deployment Checklist
- [ ] All tests passing
- [ ] Type checking with no errors
- [ ] Linting with no errors
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Performance optimization applied
- [ ] Security headers configured

#### Production Build
```bash
# Type checking
bunx tsc --noEmit

# Linting
bun lint

# Build application
bun build

# Start production server
bun start
```

#### Environment-specific Configuration
```typescript
// lib/config.ts
export const config = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  database: {
    url: process.env.DATABASE_URL!,
    maxConnections: process.env.DB_MAX_CONNECTIONS ? parseInt(process.env.DB_MAX_CONNECTIONS) : 10,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiry: '7d',
  },
} as const
```

### Git Workflow

#### Branch Naming Convention
```bash
# Feature branches
feature/inventory-tracking
feature/user-management

# Bug fixes
bugfix/login-validation
hotfix/security-patch

# Release branches
release/v2.1.0
```

#### Commit Message Format
```bash
# Use conventional commits
feat: add inventory tracking dashboard
fix: resolve authentication token refresh issue
docs: update API documentation
style: format code with prettier
refactor: optimize database queries
test: add unit tests for user service
chore: update dependencies

# Examples
feat(inventory): add real-time stock level updates
fix(auth): handle expired JWT tokens properly
docs(readme): add development setup instructions
```

#### Pull Request Process
1. Create feature branch from `main`
2. Implement changes with tests
3. Update documentation if needed
4. Create PR with descriptive title and description
5. Request code review from team members
6. Address review feedback
7. Merge after approval (squash and merge preferred)

### Troubleshooting

#### Common Development Issues

**Database Connection Issues**
```bash
# Check PostgreSQL service status
sudo systemctl status postgresql

# Reset database connection
bunx prisma db push --force-reset

# Regenerate Prisma client
bunx prisma generate
```

**TypeScript Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Restart TypeScript server in VS Code
Ctrl+Shift+P > "TypeScript: Restart TS Server"

# Check TypeScript configuration
bunx tsc --noEmit
```

**Build Failures**
```bash
# Clear all caches
bun clean  # if script exists
rm -rf .next node_modules bun.lockb
bun install

# Check for dependency conflicts
bun ls
```

**Authentication Issues**
```bash
# Verify JWT secret is set
echo $JWT_SECRET

# Check cookie configuration in browser dev tools
# Ensure httpOnly and secure flags are set correctly
```

### API Documentation

#### RESTful API Endpoints

**Authentication**
```typescript
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
GET    /api/auth/me
```

**Organizations**
```typescript
GET    /api/organizations          # List organizations
POST   /api/organizations          # Create organization
GET    /api/organizations/:id      # Get organization
PUT    /api/organizations/:id      # Update organization
DELETE /api/organizations/:id      # Delete organization
```

**Inventory Management**
```typescript
GET    /api/inventory/items        # List inventory items
POST   /api/inventory/items        # Create inventory item
PUT    /api/inventory/items/:id    # Update inventory item
GET    /api/inventory/stock/:id    # Get stock levels
POST   /api/inventory/adjust       # Adjust stock levels
```

#### API Response Format
```typescript
// Success Response
{
  success: true,
  data: T,
  message?: string,
  pagination?: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}

// Error Response
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: unknown
  }
}
```

### Data Models

#### Core Entity Relationships
```mermaid
erDiagram
    AdminUsers ||--o{ OrganizationMembers : "belongs to"
    Organization ||--o{ OrganizationMembers : "has many"
    Organization ||--o{ Products : "owns"
    Organization ||--o{ Warehouses : "owns"
    Products ||--o{ InventoryItems : "tracked in"
    Warehouses ||--o{ InventoryItems : "stores"
    Organization ||--o{ PurchaseOrders : "creates"
    Organization ||--o{ SalesOrders : "processes"
```

#### Database Schema Key Tables
```sql
-- Core user management
AdminUsers (id, name, email, password, createdAt, updatedAt)
Organization (id, name, address, phone, email, createdAt)
OrganizationMembers (id, organizationId, memberId, role, createdAt)

-- Product management
Products (id, name, sku, description, organizationId, productGroupId)
ProductGroups (id, name, description, organizationId)
ProductUnits (id, name, symbol, organizationId)

-- Inventory management
InventoryItems (id, productId, warehouseId, quantity, minStock, maxStock)
Warehouses (id, name, location, organizationId)

-- Transaction management
PurchaseOrders (id, orderNumber, supplierId, total, status, organizationId)
SalesOrders (id, orderNumber, customerId, total, status, organizationId)
```

### Contributing Guidelines

#### Code Review Checklist
- [ ] **Functionality**: Does the code work as intended?
- [ ] **Code Style**: Follows project coding standards
- [ ] **Performance**: No obvious performance issues
- [ ] **Security**: No security vulnerabilities
- [ ] **Testing**: Adequate test coverage
- [ ] **Documentation**: Code is well documented
- [ ] **Type Safety**: Proper TypeScript usage
- [ ] **Error Handling**: Appropriate error handling

#### Development Best Practices
1. **Write self-documenting code** - Use descriptive variable/function names
2. **Follow SOLID principles** - Single responsibility, open/closed, etc.
3. **Implement proper error handling** - Don't let errors go unhandled
4. **Use TypeScript strictly** - Enable strict mode, avoid `any`
5. **Write tests first** - TDD approach for critical functionality
6. **Optimize for performance** - Consider bundle size and runtime performance
7. **Security first** - Validate inputs, sanitize outputs, secure by default

#### Issue Reporting
When reporting bugs or requesting features:
```markdown
## Bug Report Template
**Description**: Brief description of the issue
**Steps to Reproduce**: 
1. Step one
2. Step two
3. Step three

**Expected Behavior**: What should happen
**Actual Behavior**: What actually happens
**Environment**: 
- OS: [e.g., Windows 11, macOS, Ubuntu]
- Browser: [e.g., Chrome 91, Firefox 89]
- Node.js version: [e.g., 18.17.0]
- Bun version: [e.g., 1.0.0]

**Additional Context**: Screenshots, logs, etc.
```
