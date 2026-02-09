import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { AppShell } from './components/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { BugListPage } from './pages/BugListPage';
import { BugDetailPage } from './pages/BugDetailPage';
import { BugUpsertPage } from './pages/BugUpsertPage';
import { TestCaseListPage } from './pages/TestCaseListPage';
import { TestCaseDetailPage } from './pages/TestCaseDetailPage';
import { TestCaseUpsertPage } from './pages/TestCaseUpsertPage';
import { TestRunListPage } from './pages/TestRunListPage';
import { TestRunCreatePage } from './pages/TestRunCreatePage';
import { TestRunExecutePage } from './pages/TestRunExecutePage';
import { TestRunSummaryPage } from './pages/TestRunSummaryPage';
import { WebAppTestingPage } from './pages/WebAppTestingPage';
import { RequireAuth } from './components/RequireAuth';

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppShell>
        <Outlet />
      </AppShell>
      <Toaster />
    </ThemeProvider>
  ),
});

// Dashboard
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
});

// Web App Testing Generator
const webAppTestingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/web-app-testing',
  component: () => (
    <RequireAuth>
      <WebAppTestingPage />
    </RequireAuth>
  ),
});

// Bug routes
const bugsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bugs',
  component: () => (
    <RequireAuth>
      <BugListPage />
    </RequireAuth>
  ),
});

const bugDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bugs/$bugId',
  component: BugDetailPage,
});

const bugCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bugs/new',
  component: BugUpsertPage,
});

const bugEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bugs/$bugId/edit',
  component: BugUpsertPage,
});

// Test case routes
const testCasesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/test-cases',
  component: () => (
    <RequireAuth>
      <TestCaseListPage />
    </RequireAuth>
  ),
});

const testCaseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/test-cases/$testCaseId',
  component: TestCaseDetailPage,
});

const testCaseCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/test-cases/new',
  component: TestCaseUpsertPage,
});

const testCaseEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/test-cases/$testCaseId/edit',
  component: TestCaseUpsertPage,
});

// Test run routes
const testRunsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/test-runs',
  component: TestRunListPage,
});

const testRunCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/test-runs/new',
  component: TestRunCreatePage,
});

const testRunExecuteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/test-runs/$testRunId/execute',
  component: TestRunExecutePage,
});

const testRunSummaryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/test-runs/$testRunId',
  component: TestRunSummaryPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  webAppTestingRoute,
  bugsRoute,
  bugDetailRoute,
  bugCreateRoute,
  bugEditRoute,
  testCasesRoute,
  testCaseDetailRoute,
  testCaseCreateRoute,
  testCaseEditRoute,
  testRunsRoute,
  testRunCreateRoute,
  testRunExecuteRoute,
  testRunSummaryRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
