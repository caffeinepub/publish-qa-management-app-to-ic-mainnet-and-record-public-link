import { type ReactNode } from 'react';
import { Bug, TestTube, PlayCircle, LayoutDashboard, Menu, Sparkles } from 'lucide-react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LoginButton } from './LoginButton';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Web App Testing', href: '/web-app-testing', icon: Sparkles },
  { name: 'Bugs', href: '/bugs', icon: Bug },
  { name: 'Test Cases', href: '/test-cases', icon: TestTube },
  { name: 'Test Runs', href: '/test-runs', icon: PlayCircle },
];

export function AppShell({ children }: AppShellProps) {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const NavItems = () => (
    <>
      {navigation.map((item) => {
        const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
        return (
          <button
            key={item.name}
            onClick={() => navigate({ to: item.href })}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </button>
        );
      })}
    </>
  );

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col gap-2 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <img src="/assets/generated/qa-logo.dim_512x512.png" alt="QA Logo" className="h-8 w-8" />
                  <span className="text-lg font-bold">QA Manager</span>
                </div>
                <nav className="flex flex-col gap-1">
                  <NavItems />
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <img src="/assets/generated/qa-logo.dim_512x512.png" alt="QA Logo" className="h-8 w-8" />
            <span className="text-lg font-bold">QA Manager</span>
          </div>

          <nav className="ml-8 hidden gap-1 md:flex">
            <NavItems />
          </nav>

          <div className="ml-auto">
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="container py-6">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026. Built with ❤️ using{' '}
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
