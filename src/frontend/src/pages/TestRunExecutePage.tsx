import { useState } from 'react';
import { SectionPage } from '@/components/SectionPage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { toast } from 'sonner';

export function TestRunExecutePage() {
  const navigate = useNavigate();
  const { testRunId } = useParams({ strict: false });

  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [results, setResults] = useState<Record<string, { status: 'passed' | 'failed'; notes: string }>>({});
  const [notes, setNotes] = useState('');

  // Mock data - replace with actual backend data
  const testRun = {
    id: testRunId,
    name: 'Sprint 12 Regression',
    tests: [
      { id: '1', title: 'User Login Flow', steps: ['Navigate to login', 'Enter credentials', 'Click login'] },
      { id: '2', title: 'Checkout Process', steps: ['Add item to cart', 'Proceed to checkout', 'Complete payment'] },
      { id: '3', title: 'Profile Update', steps: ['Navigate to profile', 'Update information', 'Save changes'] },
    ],
  };

  const currentTest = testRun.tests[currentTestIndex];
  const isLastTest = currentTestIndex === testRun.tests.length - 1;

  const handleResult = (status: 'passed' | 'failed') => {
    setResults({
      ...results,
      [currentTest.id]: { status, notes },
    });

    if (isLastTest) {
      // TODO: Save results to backend
      toast.success('Test run completed');
      navigate({ to: `/test-runs/${testRunId}` });
    } else {
      setCurrentTestIndex(currentTestIndex + 1);
      setNotes('');
    }
  };

  return (
    <SectionPage
      title={testRun.name}
      description={`Test ${currentTestIndex + 1} of ${testRun.tests.length}`}
      actions={
        <Button variant="outline" onClick={() => navigate({ to: '/test-runs' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Exit
        </Button>
      }
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{currentTest.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-3 font-semibold">Test Steps</h3>
                <ol className="list-decimal list-inside space-y-2">
                  {currentTest.steps.map((step, idx) => (
                    <li key={idx} className="text-sm">{step}</li>
                  ))}
                </ol>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any observations or issues encountered..."
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleResult('passed')}
                  className="flex-1"
                  variant="default"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Pass
                </Button>
                <Button
                  onClick={() => handleResult('failed')}
                  className="flex-1"
                  variant="destructive"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Fail
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testRun.tests.map((test, idx) => {
                  const result = results[test.id];
                  const isCurrent = idx === currentTestIndex;
                  const isPast = idx < currentTestIndex;

                  return (
                    <div
                      key={test.id}
                      className={`flex items-center gap-2 rounded-lg border p-3 ${
                        isCurrent ? 'border-primary bg-accent' : ''
                      }`}
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{test.title}</p>
                      </div>
                      {result && (
                        <Badge variant={result.status === 'passed' ? 'secondary' : 'destructive'}>
                          {result.status}
                        </Badge>
                      )}
                      {isCurrent && !result && (
                        <Badge variant="outline">Current</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SectionPage>
  );
}
