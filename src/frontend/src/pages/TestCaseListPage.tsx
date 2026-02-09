import { SectionPage } from '@/components/SectionPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, TestTube, AlertCircle, Eye } from 'lucide-react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useGetWebsite } from '@/hooks/useQueries';
import { getSelectedWebsiteId } from '@/lib/websiteSelection';

export function TestCaseListPage() {
  const navigate = useNavigate();
  const selectedWebsiteId = getSelectedWebsiteId();
  const { data: selectedWebsite, isLoading } = useGetWebsite(selectedWebsiteId);

  if (!selectedWebsiteId || !selectedWebsite) {
    return (
      <SectionPage
        title="Test Cases"
        description="Manage your test case library"
      >
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No Website Selected</h3>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              Please generate test data for a website first to view test cases
            </p>
            <Button asChild>
              <Link to="/web-app-testing">
                <Plus className="mr-2 h-4 w-4" />
                Go to Web App Testing
              </Link>
            </Button>
          </CardContent>
        </Card>
      </SectionPage>
    );
  }

  if (isLoading) {
    return (
      <SectionPage
        title="Test Cases"
        description="Manage your test case library"
      >
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading test cases...</p>
          </div>
        </div>
      </SectionPage>
    );
  }

  const testCases = selectedWebsite.testCases;

  if (testCases.length === 0) {
    return (
      <SectionPage
        title="Test Cases"
        description={`Test cases for ${selectedWebsite.title}`}
      >
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <img
              src="/assets/generated/empty-testcases.dim_1200x800.png"
              alt="No test cases"
              className="mb-6 h-48 w-auto opacity-50"
            />
            <h3 className="mb-2 text-lg font-semibold">No test cases yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Add test cases from the Web App Testing page
            </p>
            <Button asChild>
              <Link to="/web-app-testing">Go to Web App Testing</Link>
            </Button>
          </CardContent>
        </Card>
      </SectionPage>
    );
  }

  return (
    <SectionPage
      title="Test Cases"
      description={`Test cases for ${selectedWebsite.title}`}
    >
      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-4 pr-4">
          {testCases.map((testCase) => (
            <Card 
              key={testCase.id.toString()}
              className="cursor-pointer transition-colors hover:bg-accent"
              onClick={() => navigate({ to: `/test-cases/${testCase.id.toString()}` })}
            >
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-start gap-4 flex-1">
                  <TestTube className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{testCase.description}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {testCase.steps}
                    </p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: `/test-cases/${testCase.id.toString()}` });
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </SectionPage>
  );
}
