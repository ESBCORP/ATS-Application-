import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Video, Calendar, History, Search, Loader, Bot, UserCog } from 'lucide-react';
import { candidates } from '../../data/candidates';
import { Meeting, Recording } from '../../types';
import Button from '../../components/ui/Button';
import Status from '../../components/ui/Status';

const VideoPage = () => {
  const { section = 'meetings' } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [aiMode, setAiMode] = useState(true);

  // Mock data
  const meetings: Meeting[] = [
    {
      id: '1',
      candidateId: 'OOC-15330',
      scheduledTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      duration: 30,
      status: 'scheduled',
      jobId: 'OOJ-4361'
    }
  ];

  const recordings: Recording[] = [
    {
      id: '1',
      candidateId: 'OOC-15330',
      timestamp: new Date().toISOString(),
      duration: 1800,
      url: '#'
    }
  ];

  const filteredCandidates = candidates.filter(candidate =>
    `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleScheduleMeeting = (candidateId: string) => {
    setSelectedCandidate(candidateId);
  };

  const renderMeetings = () => (
    <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Upcoming Interviews</h2>
        </div>
        <div className="space-y-4">
          {meetings.map(meeting => {
            const candidate = candidates.find(c => c.id === meeting.candidateId);
            return (
              <div key={meeting.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">
                    {candidate?.firstName} {candidate?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(meeting.scheduledTime).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {meeting.duration} minutes
                  </span>
                  <Status status={meeting.status} />
                  <Button variant="outline" size="sm">Join</Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

            <div className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Candidates</h2>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCandidates.map(candidate => (
            <div key={candidate.id} className="border rounded-lg p-4">
              <p className="font-medium">{candidate.firstName} {candidate.lastName}</p>
              <p className="text-sm text-gray-500">{candidate.jobTitle}</p>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => handleScheduleMeeting(candidate.id)}
                >
                  Schedule Interview
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRecordings = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Recent Recordings</h2>
      <div className="space-y-4">
        {recordings.map(recording => {
          const candidate = candidates.find(c => c.id === recording.candidateId);
          return (
            <div key={recording.id} className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">
                  {candidate?.firstName} {candidate?.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(recording.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {Math.floor(recording.duration / 60)} minutes
                </span>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Video className="h-8 w-8 text-blue-600 dark:text-teal-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Video Interviewing</h1>
        </div>
        <div className="flex gap-2">
          <Link to="/video/meetings">
            <Button
              variant={section === 'meetings' ? 'primary' : 'outline'}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Interviews
            </Button>
          </Link>
          <Link to="/video/recordings">
            <Button
              variant={section === 'recordings' ? 'primary' : 'outline'}
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              Recordings
            </Button>
          </Link>
        </div>
      </div>

      {section === 'meetings' && renderMeetings()}
      {section === 'recordings' && renderRecordings()}
    </div>
  );
};

export default VideoPage;