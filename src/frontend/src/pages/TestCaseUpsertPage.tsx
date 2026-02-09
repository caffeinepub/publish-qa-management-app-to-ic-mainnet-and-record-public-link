import { useState, useEffect } from 'react';
import { SectionPage } from '@/components/SectionPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { useNavigate, useParams, Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useGetWebsite, useAddTestCase, useUpdateTestCase } from '@/hooks/useQueries';
import { getSelectedWebsiteId } from '@/lib/websiteSelection';

export function TestCaseUpsertPage() {
  const navigate = useNavigate();
  const { testCaseId } = useParams({ strict: false });
  const isEdit = !!testCaseId;
  const selectedWebsiteId = getSelectedWebsiteId();
  const { data: selectedWebsite, isLoading } = useGetWebsite(selectedWebsiteId);
  const addTestCaseMutation = useAddTestCase();
  const updateTestCaseMutation = useUpdateTestCase();

  const [formData, setFormData] = useState({
    description: '',
    steps: '',
  });

  useEffect(() => {
    if (isEdit && selectedWebsite) {
      const testCase = selectedWebsite.testCases.find(tc => tc.id.toString() === testCaseId);
      if (testCase) {
        setFormData({
          description: testCase.description,
          steps: testCase.steps,
        });
      }
    }
  }, [isEdit, testCaseId, selectedWebsite]);

  if (!selectedWebsiteId) {
    return (
      <SectionPage title={isEdit ? 'Edit Test Case' : 'Add Test Case'}>
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
      <SectionPage title={isEdit ? 'Edit Test Case' : 'Add Test Case'}>
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
      <SectionPage title={isEdit ? 'Edit Test Case' : 'Add Test Case'}>
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
    const testCase = selectedWebsite.testCases.find(tc => tc.id.toString() === testCaseId);
    if (!testCase) {
      return (
        <SectionPage title="Edit Test Case">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Test Case Not Found</h3>
              <p className="mb-4 text-center text-sm text-muted-foreground">
                The test case you're trying to edit doesn't exist
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

    if (!formData.steps.trim()) {
      toast.error('Please enter test steps');
      return;
    }

    try {
      if (isEdit) {
        await updateTestCaseMutation.mutateAsync({
          websiteId: selectedWebsiteId,
          testCaseId: BigInt(testCaseId!),
          description: formData.description,
          steps: formData.steps,
        });
        toast.success('Test case updated successfully');
      } else {
        await addTestCaseMutation.mutateAsync({
          websiteId: selectedWebsiteId,
          description: formData.description,
          steps: formData.steps,
        });
        toast.success('Test case added successfully');
      }
      navigate({ to: '/test-cases' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to save test case');
    }
  };

  const isSaving = addTestCaseMutation.isPending || updateTestCaseMutation.isPending;

  return (
    <SectionPage
      title={isEdit ? 'Edit Test Case' : 'Add Test Case'}
      description={isEdit ? 'Update test case details' : `Add a new test case for ${selectedWebsite.title}`}
      actions={
        <Button variant="outline" onClick={() => navigate({ to: '/test-cases' })} disabled={isSaving}>
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
                placeholder="What does this test case verify?"
                rows={3}
                required
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="steps">Test Steps</Label>
              <Textarea
                id="steps"
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                placeholder="1. Step one&#10;2. Step two&#10;3. Step three"
                rows={8}
                required
                disabled={isSaving}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEdit ? 'Update Test Case' : 'Add Test Case'}
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
