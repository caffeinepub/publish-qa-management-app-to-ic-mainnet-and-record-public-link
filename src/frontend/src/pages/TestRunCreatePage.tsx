import { useState } from 'react';
import { SectionPage } from '@/components/SectionPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

export function TestRunCreatePage() {
  const navigate = useNavigate();

  const [runName, setRunName] = useState('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  // Mock test cases - replace with actual backend data
  const testCases = [
    { id: '1', title: 'User Login Flow', category: 'Authentication' },
    { id: '2', title: 'Checkout Process', category: 'E-commerce' },
    { id: '3', title: 'Profile Update', category: 'User Management' },
    { id: '4', title: 'Password Reset', category: 'Authentication' },
    { id: '5', title: 'Product Search', category: 'E-commerce' },
  ];

  const handleToggleTest = (testId: string) => {
    setSelectedTests(prev =>
      prev.includes(testId)
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTests.length === 0) {
      toast.error('Please select at least one test case');
      return;
    }
    // TODO: Create test run in backend
    toast.success('Test run created successfully');
    navigate({ to: '/test-runs' });
  };

  return (
    <SectionPage
      title="Create Test Run"
      description="Select test cases to include in this test run"
      actions={
        <Button variant="outline" onClick={() => navigate({ to: '/test-runs' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="runName">Test Run Name</Label>
              <Input
                id="runName"
                value={runName}
                onChange={(e) => setRunName(e.target.value)}
                placeholder="e.g., Sprint 12 Regression"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Select Test Cases</Label>
                <span className="text-sm text-muted-foreground">
                  {selectedTests.length} of {testCases.length} selected
                </span>
              </div>
              <div className="space-y-3">
                {testCases.map((testCase) => (
                  <div key={testCase.id} className="flex items-start space-x-3 rounded-lg border p-4">
                    <Checkbox
                      id={testCase.id}
                      checked={selectedTests.includes(testCase.id)}
                      onCheckedChange={() => handleToggleTest(testCase.id)}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={testCase.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {testCase.title}
                      </label>
                      <p className="mt-1 text-sm text-muted-foreground">{testCase.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">
            <PlayCircle className="mr-2 h-4 w-4" />
            Start Test Run
          </Button>
        </div>
      </form>
    </SectionPage>
  );
}
