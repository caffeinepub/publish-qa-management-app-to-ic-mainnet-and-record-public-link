import { useState, useEffect } from 'react';
import { SectionPage } from '@/components/SectionPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useNavigate, useParams, Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useGetWebsite, useAddBug, useUpdateBug } from '@/hooks/useQueries';
import { getSelectedWebsiteId } from '@/lib/websiteSelection';
import { Severity } from '../backend';

export function BugUpsertPage() {
  const navigate = useNavigate();
  const { bugId } = useParams({ strict: false });
  const isEdit = !!bugId;
  const selectedWebsiteId = getSelectedWebsiteId();
  const { data: selectedWebsite, isLoading } = useGetWebsite(selectedWebsiteId);
  const addBugMutation = useAddBug();
  const updateBugMutation = useUpdateBug();

  const [formData, setFormData] = useState({
    description: '',
    severity: 'medium' as Severity,
  });

  useEffect(() => {
    if (isEdit && selectedWebsite) {
      const bug = selectedWebsite.bugs.find(b => b.id.toString() === bugId);
      if (bug) {
        setFormData({
          description: bug.description,
          severity: bug.severity,
        });
      }
    }
  }, [isEdit, bugId, selectedWebsite]);

  if (!selectedWebsiteId) {
    return (
      <SectionPage title={isEdit ? 'Edit Bug' : 'Add Bug'}>
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
      <SectionPage title={isEdit ? 'Edit Bug' : 'Add Bug'}>
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </SectionPage>
    );
  }

  if (!selectedWebsite) {
    return (
      <SectionPage title={isEdit ? 'Edit Bug' : 'Add Bug'}>
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

  if (isEdit) {
    const bug = selectedWebsite.bugs.find(b => b.id.toString() === bugId);
    if (!bug) {
      return (
        <SectionPage title="Edit Bug">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Bug Not Found</h3>
              <p className="mb-4 text-center text-sm text-muted-foreground">
                The bug you're trying to edit doesn't exist
              </p>
              <Button asChild>
                <Link to="/web-app-testing">Go to Web App Testing</Link>
              </Button>
            </CardContent>
          </Card>
        </SectionPage>
      );
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    try {
      if (isEdit) {
        await updateBugMutation.mutateAsync({
          websiteId: selectedWebsiteId,
          bugId: BigInt(bugId!),
          description: formData.description,
          severity: formData.severity,
        });
        toast.success('Bug updated successfully');
      } else {
        await addBugMutation.mutateAsync({
          websiteId: selectedWebsiteId,
          description: formData.description,
          severity: formData.severity,
        });
        toast.success('Bug added successfully');
      }
      navigate({ to: '/bugs' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to save bug');
    }
  };

  const isSaving = addBugMutation.isPending || updateBugMutation.isPending;

  return (
    <SectionPage
      title={isEdit ? 'Edit Bug' : 'Add Bug'}
      description={isEdit ? 'Update bug details' : `Add a new bug for ${selectedWebsite.title}`}
      actions={
        <Button variant="outline" onClick={() => navigate({ to: '/bugs' })} disabled={isSaving}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      }
    >
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the bug"
                rows={6}
                required
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select 
                value={formData.severity} 
                onValueChange={(value) => setFormData({ ...formData, severity: value as Severity })}
                disabled={isSaving}
              >
                <SelectTrigger id="severity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEdit ? 'Update Bug' : 'Add Bug'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </SectionPage>
  );
}
