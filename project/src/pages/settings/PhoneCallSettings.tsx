import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';

const PhoneCallSettings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Phone Call Settings"
        subtitle="This feature has been temporarily disabled"
        actions={
          <Button 
            variant="outline" 
            onClick={() => navigate('/settings')}
          >
            Back to Settings
          </Button>
        }
      />

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-yellow-800">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-yellow-800">Phone Feature Temporarily Disabled</h3>
            <div className="mt-2 text-yellow-700">
              <p>The phone call feature has been temporarily disabled due to audio issues.</p>
              <p className="mt-2">Our team is working to resolve these issues and will restore this functionality in a future update.</p>
              <p className="mt-4">Please use the video interview feature instead for candidate interactions.</p>
            </div>
            <div className="mt-4">
              <Button 
                onClick={() => navigate('/settings/video')}
                variant="outline"
              >
                Go to Video Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneCallSettings;