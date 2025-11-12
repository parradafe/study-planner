# GitHub Copilot Instructions - Study Planner

## Project Description

This is a study planning project (Study Planner) consisting of:
- **study-planner-app**: Frontend application built with Next.js 16, React 19, and Tailwind CSS 4
- **study-planner-api**: Backend API (to be developed)
- **db**: Database folder (to be configured)

## Tech Stack

### Frontend (study-planner-app)
- **Framework**: Next.js 16.0.2 with App Router
- **React**: 19.2.0
- **TypeScript**: v5
- **Styling**: Tailwind CSS v4 with PostCSS
- **Linting**: ESLint v9 with eslint-config-next

### Design System & Theme
The application uses a custom color theme defined in `app/globals.css`:

**Light Mode Colors:**
- Background: `#f0f9ff` (soft cyan blue)
- Primary: `#a78bfa` (purple) with light variant `#e9d5ff` and dark variant `#7c3aed`
- Secondary: `#fbbf24` (amber/yellow) with light variant `#fef3c7`
- Accents: Pink `#f9a8d4`, Green `#86efac`, Cyan `#67e8f9`
- Card backgrounds: White `#ffffff` with dark borders `#1e293b`
- Text: Primary `#0f172a`, Secondary `#475569`

**Dark Mode Colors:**
- Background: `#0f172a` (dark slate)
- Card backgrounds: `#1e293b` with light borders `#e2e8f0`
- All accent colors remain the same for consistency
- Text automatically adjusts for readability

## Code Conventions

### TypeScript
- Use strict TypeScript in all files
- Define interfaces and types for component props
- Avoid using `any`, prefer specific types
- Use descriptive names for types and interfaces (e.g., `UserProfile`, `StudyPlanProps`)

### React/Next.js
- Use functional components with hooks
- Prefer Server Components by default in Next.js
- Use Client Components (`'use client'`) only when necessary (interactivity, browser hooks)
- Component names in PascalCase
- Component files with `.tsx` extension

### Styling
- Use Tailwind CSS for all styles
- Prefer utility classes over custom CSS
- Maintain responsive design with Tailwind breakpoints (sm, md, lg, xl)
- **ALWAYS use the custom theme colors defined in `globals.css`** - do not use arbitrary color values
- Use semantic color variables from the theme:
  - `bg-background`, `text-foreground` for base colors
  - `bg-card-bg`, `border-card-border` for cards and containers
  - `text-text-primary`, `text-text-secondary` for text hierarchy
  - `bg-primary`, `bg-primary-light`, `bg-primary-dark` for primary actions (purple tones)
  - `bg-secondary`, `bg-secondary-light` for secondary elements (yellow/amber tones)
  - `bg-accent-pink`, `bg-accent-green`, `bg-accent-cyan` for accents and highlights
- Dark mode is automatically handled through CSS variables - avoid using `dark:` prefixes when using theme colors
- Maintain consistency with the design system at all times

### File Structure
- Pages in `/app` following Next.js App Router
- Reusable components in `/app/components` (create if needed)
- Utilities and helpers in `/app/lib` or `/app/utils` (create if needed)
- Shared TypeScript types in `/app/types` (create if needed)

### Naming Conventions
- **Files**: kebab-case for utility files (e.g., `date-formatter.ts`)
- **Components**: PascalCase (e.g., `StudyCard.tsx`)
- **Variables/functions**: camelCase (e.g., `handleSubmit`, `studyPlan`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_STUDY_HOURS`)

## Patterns and Best Practices

### Components
```typescript
// Example component structure
interface ComponentProps {
  title: string;
  onAction: () => void;
}

export default function Component({ title, onAction }: ComponentProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Content */}
    </div>
  );
}
```

### State Management
- Use `useState` for simple local state
- Use `useReducer` for complex state logic
- Consider Context API or Zustand for global state (when needed)

### Data Handling
- Use Server Actions for data mutations
- Implement loading states and error boundaries
- Validate data on both client and server

### Accessibility
- Use semantic HTML tags
- Include ARIA attributes when appropriate
- Ensure keyboard navigation
- Maintain adequate color contrast

### Performance
- Optimize images with `next/image`
- Implement lazy loading when appropriate
- Minimize Client components when possible
- Use dynamic imports for non-critical code

## Useful Commands

```bash
# Development
cd study-planner-app && npm run dev

# Production build
cd study-planner-app && npm run build

# Start in production
cd study-planner-app && npm start

# Linting
cd study-planner-app && npm run lint
```

## Domain-Specific Guidelines

### Expected Features (Study Planner)
- Creation and management of study plans
- Task and subject organization
- Study calendar
- Progress tracking
- Reminders and notifications
- Study time management

### UX Considerations
- Clean and minimalist interface
- Intuitive navigation
- Clear visual feedback
- Mobile-first design
- Dark mode by default

## Additional Notes

- This project is in early development phase
- Keep code clean, documented, and maintainable
- Prioritize user experience and accessibility
- Follow Next.js 16 and React 19 best practices
