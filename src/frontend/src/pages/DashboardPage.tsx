import { SectionPage } from '@/components/SectionPage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bug, TestTube, PlayCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export function DashboardPage() {
  const navigate = useNavigate();

  const stats = [
    { name: 'Open Bugs', value: '12', icon: Bug, color: 'text-destructive', href: '/bugs' },
    { name: 'Test Cases', value: '48', icon: TestTube, color: 'text-primary', href: '/test-cases' },
    { name: 'Active Runs', value: '3', icon: PlayCircle, color: 'text-chart-2', href: '/test-runs' },
    { name: 'Pass Rate', value: '87%', icon: CheckCircle2, color: 'text-chart-1', href: '/test-runs' },
  ];

  const recentActivity = [
    { type: 'bug', title: 'Login button not responding', status: 'open', time: '2 hours ago' },
    { type: 'test', title: 'Checkout flow test completed', status: 'passed', time: '4 hours ago' },
    { type: 'bug', title: 'Image upload fails on iOS', status: 'in-progress', time: '5 hours ago' },
    { type: 'test', title: 'Payment integration test', status: 'failed', time: '1 day ago' },
  ];

  return (
    <SectionPage
      title="Dashboard"
      description="Overview of your QA testing activities"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.name}
            className="cursor-pointer transition-colors hover:bg-accent/50"
            onClick={() => navigate({ to: stat.href })}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your QA workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1">
                    {activity.type === 'bug' ? (
                      <Bug className="h-4 w-4 text-destructive" />
                    ) : (
                      <TestTube className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{activity.status}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate({ to: '/bugs/new' })}
            >
              <Bug className="mr-2 h-4 w-4" />
              Report a Bug
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate({ to: '/test-cases/new' })}
            >
              <TestTube className="mr-2 h-4 w-4" />
              Create Test Case
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate({ to: '/test-runs/new' })}
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Start Test Run
            </Button>
          </CardContent>
        </Card>
      </div>
    </SectionPage>
  );
}
