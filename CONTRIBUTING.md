# 🤝 Contributing to VarTex

Thank you for your interest in contributing to VarTex! This document provides guidelines and information for contributors to help make the contribution process smooth and effective.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style & Standards](#code-style--standards)
- [Contribution Workflow](#contribution-workflow)
- [Issue Guidelines](#issue-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Community Guidelines](#community-guidelines)

## 🚀 Getting Started

### Prerequisites

Before contributing, make sure you have:

- **Node.js 18+** installed
- **pnpm** package manager (recommended) or npm/yarn
- **Git** for version control
- **PostgreSQL** database (local or cloud)
- **AWS S3** bucket for file storage
- **Razorpay** account for payment testing
- **GitHub** account for OAuth testing

### Fork & Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/vartex.git
   cd vartex
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/vartex.git
   ```

## 🛠️ Development Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Configuration

1. **Copy the environment template**:

   ```bash
   cp .env.example .env.local
   ```

2. **Configure your environment variables**:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/vartex"

   # Authentication
   AUTH_GITHUB_CLIENT_ID="your_github_client_id"
   AUTH_GITHUB_SECRET="your_github_client_secret"

   # Razorpay
   RAZORPAY_KEY_ID=sk_test_...
   NEXT_PUBLIC_RAZORPAY_KEY_ID=whsec_...

   # AWS S3
   AWS_ENDPOINT_URL_S3="https://your-bucket.s3.region.amazonaws.com"
   AWS_ACCESS_KEY_ID="your_access_key"
   AWS_SECRET_ACCESS_KEY="your_secret_key"

   # Arcjet (Security)
   ARCJET_KEY="your_arcjet_key"

   # Resend (Email)
   RESEND_API_KEY="your_resend_api_key"
   ```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm prisma generate

# Push schema to database
pnpm prisma db push

# (Optional) Seed database with sample data
pnpm prisma db seed
```

### 4. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your local development environment.

## 📝 Code Style & Standards

### TypeScript Guidelines

- **Use TypeScript** for all new code
- **Define proper types** for all functions and components
- **Avoid `any` type** - use proper typing or `unknown`
- **Use interfaces** for object shapes and classes
- **Use type aliases** for complex union types

```typescript
// ✅ Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

// ❌ Avoid
const user: any = { id: "1", name: "John" };
```

### React & Next.js Guidelines

- **Use Server Components** by default
- **Use Client Components** only when necessary (interactivity, hooks)
- **Follow Next.js 13+ App Router conventions**
- **Use proper error boundaries**
- **Implement loading states**

```typescript
// ✅ Good - Server Component
export default async function CourseList() {
  const courses = await getCourses();
  return <CourseGrid courses={courses} />;
}

// ✅ Good - Client Component (when needed)
("use client");
export function CourseEnrollmentButton({ courseId }: { courseId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  // ... implementation
}
```

### Component Guidelines

- **Use PascalCase** for component names
- **Use camelCase** for props and variables
- **Implement proper prop validation**
- **Use semantic HTML elements**
- **Follow accessibility guidelines**

```typescript
// ✅ Good
interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
  variant?: "default" | "compact";
}

export function CourseCard({
  course,
  onEnroll,
  variant = "default",
}: CourseCardProps) {
  return (
    <article className="course-card">
      <h3>{course.title}</h3>
      {/* ... rest of component */}
    </article>
  );
}
```

### File Organization

- **Group related files** in feature folders
- **Use index files** for clean imports
- **Separate concerns** (UI, logic, data)
- **Follow consistent naming** conventions

```
components/
├── course/
│   ├── CourseCard.tsx
│   ├── CourseList.tsx
│   └── index.ts
├── ui/
│   ├── Button.tsx
│   └── index.ts
└── layout/
    ├── Header.tsx
    └── Footer.tsx
```

### Database Guidelines

- **Use Prisma** for all database operations
- **Write type-safe queries** with proper selects
- **Use transactions** for related operations
- **Implement proper error handling**

```typescript
// ✅ Good
export async function getCourseWithChapters(courseId: string) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        chapter: {
          include: {
            lessons: {
              orderBy: { position: "asc" },
            },
          },
          orderBy: { position: "asc" },
        },
      },
    });

    if (!course) {
      throw new Error("Course not found");
    }

    return course;
  } catch (error) {
    console.error("Failed to fetch course:", error);
    throw error;
  }
}
```

## 🔄 Contribution Workflow

### 1. Create a Feature Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
# or
git checkout -b docs/your-documentation-update
```

### 2. Make Your Changes

- **Write clear, focused commits**
- **Test your changes thoroughly**
- **Update documentation** if needed
- **Follow the coding standards**

### 3. Commit Guidelines

Use conventional commit messages:

```bash
# Format: type(scope): description
git commit -m "feat(courses): add course enrollment functionality"
git commit -m "fix(auth): resolve login redirect issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(ui): improve button component styling"
git commit -m "refactor(data): optimize course fetching queries"
```

**Commit Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 4. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with a clear description.

## 🐛 Issue Guidelines

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check the documentation** for solutions
3. **Reproduce the issue** in a clean environment
4. **Gather relevant information** (logs, screenshots, etc.)

### Issue Template

Use this template when creating issues:

```markdown
## Bug Report / Feature Request

### Description

Brief description of the issue or feature request.

### Steps to Reproduce (for bugs)

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

### Expected Behavior

What you expected to happen.

### Actual Behavior

What actually happened.

### Environment

- OS: [e.g., Windows 10, macOS 12.0]
- Browser: [e.g., Chrome 120, Firefox 119]
- Node.js version: [e.g., 18.17.0]
- Database: [e.g., PostgreSQL 15]

### Additional Information

- Screenshots (if applicable)
- Console logs (if applicable)
- Database schema changes (if applicable)
```

## 🔀 Pull Request Guidelines

### Before Submitting

1. **Ensure all tests pass**
2. **Update documentation** if needed
3. **Follow the coding standards**
4. **Test your changes** thoroughly
5. **Squash commits** if necessary

### PR Template

Use this template for Pull Requests:

```markdown
## Description

Brief description of the changes made.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Checklist

- [ ] I have tested this on a local development environment
- [ ] I have tested the database migrations (if applicable)
- [ ] I have tested the payment flow (if applicable)
- [ ] I have tested the file upload functionality (if applicable)

## Screenshots (if applicable)

Add screenshots to help explain your changes.

## Additional Notes

Any additional information or context.
```

## 🧪 Testing Guidelines

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test -- components/CourseCard.test.tsx
```

### Writing Tests

- **Test user interactions** and business logic
- **Mock external dependencies** (API calls, database)
- **Test error scenarios** and edge cases
- **Use descriptive test names**

```typescript
// ✅ Good test example
describe("CourseCard Component", () => {
  it("should display course title and description", () => {
    const course = {
      id: "1",
      title: "React Fundamentals",
      description: "Learn React basics",
    };

    render(<CourseCard course={course} />);

    expect(screen.getByText("React Fundamentals")).toBeInTheDocument();
    expect(screen.getByText("Learn React basics")).toBeInTheDocument();
  });

  it("should call onEnroll when enroll button is clicked", () => {
    const onEnroll = jest.fn();
    const course = { id: "1", title: "Test Course" };

    render(<CourseCard course={course} onEnroll={onEnroll} />);

    fireEvent.click(screen.getByRole("button", { name: /enroll/i }));

    expect(onEnroll).toHaveBeenCalledWith("1");
  });
});
```

## 📚 Documentation Guidelines

### Code Documentation

- **Use JSDoc** for functions and classes
- **Document complex business logic**
- **Explain non-obvious code decisions**
- **Keep comments up-to-date**

```typescript
/**
 * Calculates the progress percentage for a course based on completed lessons.
 *
 * @param courseData - The course data including chapters and lessons
 * @returns Object containing total lessons, completed lessons, and percentage
 *
 * @example
 * const progress = useCourseProgress({ courseData });
 * console.log(progress.progressPercentage); // 75
 */
export function useCourseProgress({ courseData }: CourseProgressProps) {
  // Implementation...
}
```

### README Updates

- **Update README.md** for new features
- **Add setup instructions** for new dependencies
- **Update API documentation** for new endpoints
- **Include examples** and usage patterns

## 🤝 Community Guidelines

### Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please:

- **Be respectful** and considerate of others
- **Use inclusive language** in comments and documentation
- **Give constructive feedback** on pull requests
- **Help newcomers** get started
- **Report inappropriate behavior** to maintainers

### Communication

- **Use clear, professional language**
- **Ask questions** when you're unsure
- **Provide context** when reporting issues
- **Be patient** with responses

### Getting Help

If you need help:

1. **Check the documentation** first
2. **Search existing issues** for similar problems
3. **Ask in discussions** for general questions
4. **Create an issue** for bugs or feature requests
5. **Join our community** (if available)

## 🎯 Areas for Contribution

### High Priority

- **Bug fixes** and performance improvements
- **Security enhancements**
- **Accessibility improvements**
- **Test coverage** improvements
- **Documentation** updates

### Feature Ideas

- **Advanced analytics** dashboard
- **Real-time notifications**
- **Mobile app** development
- **API improvements**
- **Integration** with third-party services

### Documentation

- **API documentation** improvements
- **Tutorial** creation
- **Code examples** and demos
- **Deployment** guides
- **Troubleshooting** guides

## 🏆 Recognition

Contributors will be recognized in:

- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub** contributor graph
- **Community** acknowledgments

## 📞 Contact

If you have questions about contributing:

- **Open an issue** for technical questions
- **Start a discussion** for general topics
- **Email maintainers** for sensitive matters

---

Thank you for contributing to VarTex! Your contributions help make online education better for everyone. 🚀
