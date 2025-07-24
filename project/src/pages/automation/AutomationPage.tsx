import { History, List, Plus, Settings } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import WorkflowBuilder from './WorkflowBuilder';
import WorkflowHistory from './WorkflowHistory';
import WorkflowList from './WorkflowList';

const AutomationPage: React.FC = () => {
  const { section = 'workflows' } = useParams();
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingWorkflowId, setEditingWorkflowId] = useState<string | undefined>();

  const handleCreateNew = () => {
    setEditingWorkflowId(undefined);
    setShowBuilder(true);
  };

  const handleEditWorkflow = (workflowId: string) => {
    setEditingWorkflowId(workflowId);
    setShowBuilder(true);
  };

  const handleCloseBuilder = () => {
    setShowBuilder(false);
    setEditingWorkflowId(undefined);
  };

  const renderContent = () => {
    if (showBuilder) {
      return (
        <WorkflowBuilder 
          onClose={handleCloseBuilder}
          workflowId={editingWorkflowId}
        />
      );
    }

    switch (section) {
      case 'workflows':
        return (
          <WorkflowList 
            onCreateNew={handleCreateNew}
            onEdit={handleEditWorkflow}
          />
        );
      case 'history':
        return <WorkflowHistory />;
      case 'settings':
        return (
          <div className="bg-white dark:bg-[#1c273c] rounded-lg shadow-md p-6">
    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
      Automation Settings
    </h2>
    <p className="text-gray-600 dark:text-gray-400">
      Configure automation settings and preferences.
    </p>
  </div>
        );
      default:
        return (
          <WorkflowList 
            onCreateNew={handleCreateNew}
            onEdit={handleEditWorkflow}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automation"
        subtitle="Create and manage automated workflows"
        actions={
          <div className="flex items-center space-x-2">
            {!showBuilder && (
              <>
                <Link to="/automation/workflows">
                  <Button
                    variant={section === 'workflows' ? 'primary' : 'outline'}
                    className="flex items-center gap-2"
                  >
                    <List className="w-4 h-4" />
                    Workflows
                  </Button>
                </Link>
                <Link to="/automation/history">
                  <Button
                    variant={section === 'history' ? 'primary' : 'outline'}
                    className="flex items-center gap-2"
                  >
                    <History className="w-4 h-4" />
                    History
                  </Button>
                </Link>
                <Link to="/automation/settings">
                  <Button
                    variant={section === 'settings' ? 'primary' : 'outline'}
                    className="flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Button>
                </Link>
                <Button
                  onClick={handleCreateNew}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Workflow
                </Button>
              </>
            )}
          </div>
        }
      />

      {renderContent()}
    </div>
  );
};

export default AutomationPage;