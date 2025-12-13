# AGENTS.md - Campus Conecta Development Guidelines

## Commands
- **Dev server**: `npm run dev` - Start Vite development server with HMR
- **Build**: `npm run build` - TypeScript compile + Vite production build
- **Lint**: `npm run lint` - Run ESLint on the codebase
- **Preview**: `npm run preview` - Preview production build locally

## Code Style Guidelines

### Imports
- Use absolute imports with `@/` alias (configured in tsconfig.json)
- Group imports: 3rd party → internal → local
- Sort alphabetically within groups
- Use named imports, avoid wildcard imports

### Formatting
- TypeScript with strict mode enabled
- Tailwind CSS v4 for styling
- 2-space indentation
- 80-character line limit
- ESLint configured with recommended React rules

### Types
- Use TypeScript interfaces/Types for all data structures
- Define types in `src/types/` directory
- Use `interface` for object shapes, `type` for unions/aliases
- Strict null checks enabled

### Naming Conventions
- PascalCase for components and interfaces
- camelCase for functions and variables
- snake_case for constants
- Use descriptive names (avoid abbreviations)

### Error Handling
- Use try/catch for Supabase operations
- Show user-friendly error messages with Sonner
- Log errors for debugging
- Handle network failures gracefully

### React Patterns
- Functional components with hooks
- Custom hooks in `src/app/*/hooks/`
- Component composition over inheritance
- Radix UI primitives for accessible UI

### Supabase
- Use Supabase client from `src/lib/supabase.ts`
- Handle authentication state properly
- Sanitize user inputs
- Use parameterized queries to prevent SQL injection

### Testing
- Write unit tests for utilities and hooks
- Test critical business logic
- Use React Testing Library for component tests
- Mock Supabase in tests

## Instrucciones de Idioma
- **Responde siempre y exclusivamente en español.**
- Independientemente del idioma en el que recibas la consulta, tu salida debe estar completamente en español.