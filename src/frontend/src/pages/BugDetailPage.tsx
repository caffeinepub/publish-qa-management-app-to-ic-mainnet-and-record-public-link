import { SectionPage } from '@/components/SectionPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, AlertCircle } from 'lucide-react';
import { useNavigate, useParams, Link } from '@tanstack/react-router';
import { useGetWebsite } from '@/hooks/useQueries';
import { getSelectedWebsiteId } from '@/lib/websiteSelection';

export function BugDetailPage() {
  const navigate = useNavigate();
  const { bugId } = useParams({ strict: false });
  const selectedWebsiteId = getSelectedWebsiteId();
  const { data: selectedWebsite, isLoading } = useGetWebsite(selectedWebsiteId);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  if (!selectedWebsiteId) {
    return (
      <SectionPage title="Bug Details">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No Website Selected</h3>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              Please select a website from the Web App Testing page first
            </p>
            <Button asChild>
              <Link to="/web-app-testing">Go to Web App Testing</Link>
            </Button>
          </CardContent>
        </Card>
      </SectionPage>
    );
  }

  if (isLoading) {
    return (
      <SectionPage title="Bug Details">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading bug details...</p>
          </div>
        </div>
      </SectionPage>
    );
  }

  if (!selectedWebsite) {
    return (
      <SectionPage title="Bug Details">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Website Not Found</h3>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              The selected website could not be found
            </p>
            <Button asChild>
              <Link to="/web-app-testing">Go to Web App Testing</Link>
            </Button>
          </CardContent>
        </Card>
      </SectionPage>
    );
  }

  const bug = selectedWebsite.bugs.find(b => b.id.toString() === bugId);

  if (!bug) {
    return (
      <SectionPage title="Bug Details">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">Bug Not Found</h3>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              The bug you're looking for doesn't exist in this website
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
      title={bug.description}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate({ to: '/bugs' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={() => navigate({ to: `/bugs/${bugId}/edit` })}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{bug.description}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Severity</p>
                <Badge className="mt-1" variant={getSeverityColor(bug.severity)}>{bug.severity}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bug ID</p>
                <p className="mt-1 text-sm font-mono">{bug.id.toString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Website</p>
                <p className="mt-1 text-sm">{selectedWebsite.title}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionPage>
  );
}
