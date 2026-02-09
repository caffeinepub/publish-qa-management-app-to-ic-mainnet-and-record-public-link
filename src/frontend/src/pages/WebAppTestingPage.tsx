import { useState, useEffect } from 'react';
import { SectionPage } from '@/components/SectionPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Plus, Edit, Trash2, AlertCircle, History, ExternalLink } from 'lucide-react';
import { validateAndNormalizeUrl } from '@/lib/urlValidation';
import { getSelectedWebsiteId, setSelectedWebsiteId } from '@/lib/websiteSelection';
import {
  useGetWebsitesByUser,
  useGetWebsite,
  useGenerateWebsiteTestingData,
  useAddTestCase,
  useUpdateTestCase,
  useDeleteTestCase,
  useAddBug,
  useUpdateBug,
  useDeleteBug,
  useAddCornerCase,
  useUpdateCornerCase,
  useDeleteCornerCase,
} from '@/hooks/useQueries';
import type { TestCase, Bug, CornerCase, Severity } from '../backend';
import { toast } from 'sonner';

type EditingItem = {
  type: 'testCase' | 'bug' | 'cornerCase';
  item: TestCase | Bug | CornerCase;
  isNew?: boolean;
};

export function WebAppTestingPage() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [urlError, setUrlError] = useState('');
  const [selectedWebsiteId, setSelectedWebsiteIdState] = useState<bigint | null>(getSelectedWebsiteId());
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  const { data: websites = [], isLoading: websitesLoading } = useGetWebsitesByUser();
  const { data: selectedWebsite, isLoading: websiteLoading } = useGetWebsite(selectedWebsiteId);
  const generateMutation = useGenerateWebsiteTestingData();

  const addTestCaseMutation = useAddTestCase();
  const updateTestCaseMutation = useUpdateTestCase();
  const deleteTestCaseMutation = useDeleteTestCase();

  const addBugMutation = useAddBug();
  const updateBugMutation = useUpdateBug();
  const deleteBugMutation = useDeleteBug();

  const addCornerCaseMutation = useAddCornerCase();
  const updateCornerCaseMutation = useUpdateCornerCase();
  const deleteCornerCaseMutation = useDeleteCornerCase();

  useEffect(() => {
    const storedId = getSelectedWebsiteId();
    if (storedId) {
      setSelectedWebsiteIdState(storedId);
    }
  }, []);

  const handleGenerate = async () => {
    const validation = validateAndNormalizeUrl(url);
    if (!validation.isValid) {
      setUrlError(validation.error || 'Invalid URL');
      return;
    }

    setUrlError('');

    if (!title.trim()) {
      toast.error('Please enter a title for this website');
      return;
    }

    try {
      const websiteId = await generateMutation.mutateAsync({
        url: validation.normalizedUrl!,
        title: title.trim(),
      });
      toast.success('Test data generated successfully!');
      setSelectedWebsiteIdState(websiteId);
      setSelectedWebsiteId(websiteId);
      setUrl('');
      setTitle('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate test data');
    }
  };

  const handleSelectWebsite = (websiteId: bigint) => {
    setSelectedWebsiteIdState(websiteId);
    setSelectedWebsiteId(websiteId);
  };

  const openEditDialog = (type: 'testCase' | 'bug' | 'cornerCase', item: any, isNew = false) => {
    setEditingItem({ type, item, isNew });
    if (type === 'testCase') {
      setEditFormData({
        description: isNew ? '' : item.description,
        steps: isNew ? '' : item.steps,
      });
    } else if (type === 'bug') {
      setEditFormData({
        description: isNew ? '' : item.description,
        severity: isNew ? 'medium' : item.severity,
      });
    } else if (type === 'cornerCase') {
      setEditFormData({
        description: isNew ? '' : item.description,
        scenario: isNew ? '' : item.scenario,
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedWebsiteId || !editingItem) return;

    try {
      if (editingItem.type === 'testCase') {
        if (editingItem.isNew) {
          await addTestCaseMutation.mutateAsync({
            websiteId: selectedWebsiteId,
            description: editFormData.description,
            steps: editFormData.steps,
          });
          toast.success('Test case added successfully');
        } else {
          await updateTestCaseMutation.mutateAsync({
            websiteId: selectedWebsiteId,
            testCaseId: (editingItem.item as TestCase).id,
            description: editFormData.description,
            steps: editFormData.steps,
          });
          toast.success('Test case updated successfully');
        }
      } else if (editingItem.type === 'bug') {
        if (editingItem.isNew) {
          await addBugMutation.mutateAsync({
            websiteId: selectedWebsiteId,
            description: editFormData.description,
            severity: editFormData.severity,
          });
          toast.success('Bug added successfully');
        } else {
          await updateBugMutation.mutateAsync({
            websiteId: selectedWebsiteId,
            bugId: (editingItem.item as Bug).id,
            description: editFormData.description,
            severity: editFormData.severity,
          });
          toast.success('Bug updated successfully');
        }
      } else if (editingItem.type === 'cornerCase') {
        if (editingItem.isNew) {
          await addCornerCaseMutation.mutateAsync({
            websiteId: selectedWebsiteId,
            description: editFormData.description,
            scenario: editFormData.scenario,
          });
          toast.success('Corner case added successfully');
        } else {
          await updateCornerCaseMutation.mutateAsync({
            websiteId: selectedWebsiteId,
            cornerCaseId: (editingItem.item as CornerCase).id,
            description: editFormData.description,
            scenario: editFormData.scenario,
          });
          toast.success('Corner case updated successfully');
        }
      }
      setEditingItem(null);
      setEditFormData({});
    } catch (error: any) {
      toast.error(error.message || 'Failed to save changes');
    }
  };

  const handleDelete = async (type: 'testCase' | 'bug' | 'cornerCase', itemId: bigint) => {
    if (!selectedWebsiteId) return;

    try {
      if (type === 'testCase') {
        await deleteTestCaseMutation.mutateAsync({ websiteId: selectedWebsiteId, testCaseId: itemId });
        toast.success('Test case deleted');
      } else if (type === 'bug') {
        await deleteBugMutation.mutateAsync({ websiteId: selectedWebsiteId, bugId: itemId });
        toast.success('Bug deleted');
      } else if (type === 'cornerCase') {
        await deleteCornerCaseMutation.mutateAsync({ websiteId: selectedWebsiteId, cornerCaseId: itemId });
        toast.success('Corner case deleted');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete item');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <SectionPage
      title="Web App Testing Generator"
      description="Generate comprehensive test cases, bug lists, and corner cases for any web application"
    >
      <div className="space-y-6">
        {/* URL Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Generate Test Data
            </CardTitle>
            <CardDescription>
              Enter a website URL to automatically generate test cases, potential bugs, and corner cases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setUrlError('');
                }}
                className={urlError ? 'border-destructive' : ''}
              />
              {urlError && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {urlError}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="My Web Application"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending || !url || !title}
              className="w-full"
            >
              {generateMutation.isPending ? (
                <>Generating...</>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Test Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* History Section */}
        {websites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Previously Generated Websites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {websites.map((website) => (
                    <button
                      key={website.id.toString()}
                      onClick={() => handleSelectWebsite(website.id)}
                      className={`w-full rounded-lg border p-3 text-left transition-colors hover:bg-accent ${
                        selectedWebsiteId?.toString() === website.id.toString()
                          ? 'border-primary bg-accent'
                          : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{website.title}</h4>
                          <p className="text-sm text-muted-foreground">{website.url}</p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                        <span>{website.testCases.length} test cases</span>
                        <span>•</span>
                        <span>{website.bugs.length} bugs</span>
                        <span>•</span>
                        <span>{website.cornerCases.length} corner cases</span>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {selectedWebsite && (
          <Card>
            <CardHeader>
              <CardTitle>{selectedWebsite.title}</CardTitle>
              <CardDescription>{selectedWebsite.url}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="testCases">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="testCases">
                    Test Cases ({selectedWebsite.testCases.length})
                  </TabsTrigger>
                  <TabsTrigger value="bugs">
                    Bugs ({selectedWebsite.bugs.length})
                  </TabsTrigger>
                  <TabsTrigger value="cornerCases">
                    Corner Cases ({selectedWebsite.cornerCases.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="testCases" className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => openEditDialog('testCase', { id: BigInt(0) }, true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Test Case
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {selectedWebsite.testCases.map((testCase) => (
                      <Card key={testCase.id.toString()}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold">{testCase.description}</h4>
                              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                                {testCase.steps}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => openEditDialog('testCase', testCase)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete('testCase', testCase.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="bugs" className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => openEditDialog('bug', { id: BigInt(0) }, true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Bug
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {selectedWebsite.bugs.map((bug) => (
                      <Card key={bug.id.toString()}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{bug.description}</h4>
                                <Badge variant={getSeverityColor(bug.severity)}>
                                  {bug.severity}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => openEditDialog('bug', bug)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete('bug', bug.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="cornerCases" className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => openEditDialog('cornerCase', { id: BigInt(0) }, true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Corner Case
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {selectedWebsite.cornerCases.map((cornerCase) => (
                      <Card key={cornerCase.id.toString()}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold">{cornerCase.description}</h4>
                              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                                {cornerCase.scenario}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => openEditDialog('cornerCase', cornerCase)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDelete('cornerCase', cornerCase.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem?.isNew ? 'Add' : 'Edit'}{' '}
                {editingItem?.type === 'testCase' ? 'Test Case' : editingItem?.type === 'bug' ? 'Bug' : 'Corner Case'}
              </DialogTitle>
              <DialogDescription>
                {editingItem?.isNew ? 'Create a new' : 'Update the'}{' '}
                {editingItem?.type === 'testCase' ? 'test case' : editingItem?.type === 'bug' ? 'bug' : 'corner case'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editFormData.description || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                />
              </div>

              {editingItem?.type === 'testCase' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-steps">Steps</Label>
                  <Textarea
                    id="edit-steps"
                    value={editFormData.steps || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, steps: e.target.value })}
                    rows={4}
                  />
                </div>
              )}

              {editingItem?.type === 'bug' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-severity">Severity</Label>
                  <Select
                    value={editFormData.severity || 'medium'}
                    onValueChange={(value) => setEditFormData({ ...editFormData, severity: value })}
                  >
                    <SelectTrigger id="edit-severity">
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
              )}

              {editingItem?.type === 'cornerCase' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-scenario">Scenario</Label>
                  <Textarea
                    id="edit-scenario"
                    value={editFormData.scenario || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, scenario: e.target.value })}
                    rows={4}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SectionPage>
  );
}
