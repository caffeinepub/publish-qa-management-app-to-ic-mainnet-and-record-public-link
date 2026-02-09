import { useState } from 'react';
import { SectionPage } from '@/components/SectionPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { toast } from 'sonner';

export function TestCaseUpsertPage() {
  const navigate = useNavigate();
  const { testCaseId } = useParams({ strict: false });
  const isEdit = !!testCaseId;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    status: 'active',
    preconditions: '',
    steps: '',
    expectedResult: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to backend
    toast.success(isEdit ? 'Test case updated successfully' : 'Test case created successfully');
    navigate({ to: '/test-cases' });
  };

  return (
    <SectionPage
      title={isEdit ? 'Edit Test Case' : 'Create Test Case'}
      description={isEdit ? 'Update test case details' : 'Create a new test case for your test suite'}
      actions={
        <Button variant="outline" onClick={() => navigate({ to: '/test-cases' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      }
    >
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief title for the test case"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What does this test case verify?"
                rows={3}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Authentication"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger id="priority">
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

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="deprecated">Deprecated</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preconditions">Preconditions</Label>
              <Textarea
                id="preconditions"
                value={formData.preconditions}
                onChange={(e) => setFormData({ ...formData, preconditions: e.target.value })}
                placeholder="What needs to be set up before running this test?"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="steps">Test Steps</Label>
              <Textarea
                id="steps"
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                placeholder="1. Step one&#10;2. Step two&#10;3. Step three"
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedResult">Expected Result</Label>
              <Textarea
                id="expectedResult"
                value={formData.expectedResult}
                onChange={(e) => setFormData({ ...formData, expectedResult: e.target.value })}
                placeholder="What should happen when the test passes?"
                rows={3}
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {isEdit ? 'Update Test Case' : 'Create Test Case'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </SectionPage>
  );
}
