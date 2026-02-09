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

export function BugUpsertPage() {
  const navigate = useNavigate();
  const { bugId } = useParams({ strict: false });
  const isEdit = !!bugId;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    status: 'open',
    priority: 'medium',
    steps: '',
    environment: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to backend
    toast.success(isEdit ? 'Bug updated successfully' : 'Bug reported successfully');
    navigate({ to: '/bugs' });
  };

  return (
    <SectionPage
      title={isEdit ? 'Edit Bug' : 'Report Bug'}
      description={isEdit ? 'Update bug details' : 'Report a new bug found during testing'}
      actions={
        <Button variant="outline" onClick={() => navigate({ to: '/bugs' })}>
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
                placeholder="Brief description of the bug"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the bug"
                rows={4}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
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

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="steps">Steps to Reproduce</Label>
              <Textarea
                id="steps"
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                placeholder="1. Step one&#10;2. Step two&#10;3. Step three"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="environment">Environment</Label>
              <Input
                id="environment"
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                placeholder="e.g., iOS 16.5, iPhone 14 Pro"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {isEdit ? 'Update Bug' : 'Report Bug'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </SectionPage>
  );
}
