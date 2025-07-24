export interface ChatOption {
  id: string;
  text: string;
  nextTemplateId?: string;
  isEndpoint?: boolean;
}

export interface ChatTemplate {
  id: string;
  message: string;
  options: ChatOption[];
  isStart?: boolean;
}

export const chatTemplates: ChatTemplate[] = [
  {
    id: 'start',
    message: 'Hello! I\'m your VirtuosoU support assistant. How can I help you today?',
    options: [
      { id: 'jobs', text: ' Jobs & Job Management', nextTemplateId: 'jobs-menu' },
      { id: 'candidates', text: ' Candidates & Profiles', nextTemplateId: 'candidates-menu' },
      { id: 'submissions', text: ' Submissions & Applications', nextTemplateId: 'submissions-menu' },
      { id: 'video', text: ' Video Interviews', nextTemplateId: 'video-menu' },
      { id: 'automation', text: ' Automation & Workflows', nextTemplateId: 'automation-menu' },
      { id: 'technical', text: ' Technical Issues', nextTemplateId: 'technical-menu' },
      { id: 'account', text: ' Account & Access', nextTemplateId: 'account-menu' },
      { id: 'support-case', text: ' Other Questions (Support Case)' }
    ],
    isStart: true
  },
  
  // Jobs Menu
  {
    id: 'jobs-menu',
    message: 'What do you need help with regarding Jobs?',
    options: [
      { id: 'create-job', text: 'How to create a new job', nextTemplateId: 'create-job-help' },
      { id: 'edit-job', text: 'How to edit job details', nextTemplateId: 'edit-job-help' },
      { id: 'job-status', text: 'Understanding job statuses', nextTemplateId: 'job-status-help' },
      { id: 'job-qa', text: 'Job Q&A and AI features', nextTemplateId: 'job-qa-help' },
      { id: 'back', text: '← Back to main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'create-job-help',
    message: 'To create a new job:\n\n1. Navigate to the Jobs module\n2. Click "Add Job" button\n3. Fill in required details:\n   • Job title and description\n   • Client and location information\n   • Pay rates and employment type\n4. Save the job\n\nYou can also use the AI feature to generate job summaries and Q&A automatically.',
    options: [
      { id: 'job-ai', text: 'Tell me about AI job features', nextTemplateId: 'job-qa-help' },
      { id: 'jobs-back', text: '← Back to Jobs menu', nextTemplateId: 'jobs-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'edit-job-help',
    message: 'To edit an existing job:\n\n1. Go to Jobs module\n2. Click on the Job ID or title\n3. Click "Edit" button\n4. Modify the required fields\n5. Click "Save" to update\n\nNote: Only users with appropriate permissions can edit jobs.',
    options: [
      { id: 'permissions', text: 'About user permissions', nextTemplateId: 'permissions-help' },
      { id: 'jobs-back', text: '← Back to Jobs menu', nextTemplateId: 'jobs-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'job-status-help',
    message: 'Job statuses explained:\n\n• **Active**: Job is open and accepting candidates\n• **Inactive**: Job is temporarily closed\n• **Draft**: Job is being prepared, not yet published\n• **Closed**: Job has been filled or cancelled\n\nYou can filter jobs by status in the Jobs module.',
    options: [
      { id: 'filter-jobs', text: 'How to filter and search jobs', nextTemplateId: 'filter-jobs-help' },
      { id: 'jobs-back', text: '← Back to Jobs menu', nextTemplateId: 'jobs-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'job-qa-help',
    message: 'AI-powered Job Features:\n\n• **Auto-generate summaries** from job descriptions\n• **Create Q&A pairs** automatically\n• **Boolean search strings** for skills and titles\n• **Keyword extraction** for better matching\n\nTo use: Add a job description and click "Generate" to create AI-enhanced content.',
    options: [
      { id: 'jobs-back', text: '← Back to Jobs menu', nextTemplateId: 'jobs-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  // Candidates Menu
  {
    id: 'candidates-menu',
    message: 'What do you need help with regarding Candidates?',
    options: [
      { id: 'add-candidate', text: 'How to add a new candidate', nextTemplateId: 'add-candidate-help' },
      { id: 'upload-resume', text: 'Uploading resumes and documents', nextTemplateId: 'upload-resume-help' },
      { id: 'candidate-notes', text: 'Adding notes to candidates', nextTemplateId: 'candidate-notes-help' },
      { id: 'rtr-process', text: 'Right to Represent (RTR) process', nextTemplateId: 'rtr-help' },
      { id: 'back', text: '← Back to main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'add-candidate-help',
    message: 'To add a new candidate:\n\n1. Navigate to Candidates module\n2. Click "Add Candidate"\n3. Fill in personal details:\n   • Name, email, phone\n   • Job title and experience\n   • Location and work authorization\n4. Upload resume (skills will be auto-extracted)\n5. Save the candidate profile',
    options: [
      { id: 'upload-resume', text: 'About resume uploads', nextTemplateId: 'upload-resume-help' },
      { id: 'candidates-back', text: '← Back to Candidates menu', nextTemplateId: 'candidates-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'upload-resume-help',
    message: 'Resume and Document Upload:\n\n• **Supported formats**: PDF, DOC, DOCX\n• **File size limit**: 10MB per file\n• **Auto skill extraction**: Skills are automatically detected from resumes\n• **Multiple files**: You can upload multiple resumes and documents\n\nThe system will extract relevant skills and add them to the candidate profile automatically.',
    options: [
      { id: 'candidates-back', text: '← Back to Candidates menu', nextTemplateId: 'candidates-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'candidate-notes-help',
    message: 'Adding Notes to Candidates:\n\n1. Open the candidate profile\n2. Scroll to the "Notes" section\n3. Type your note in the text area\n4. Click "Add Note"\n\nNotes are timestamped and show who created them. You can delete notes if needed.',
    options: [
      { id: 'candidates-back', text: '← Back to Candidates menu', nextTemplateId: 'candidates-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'rtr-help',
    message: 'Right to Represent (RTR) Process:\n\n1. Open candidate profile\n2. Click "Submit RTR"\n3. Select the job position\n4. Review and customize RTR email\n5. Send to candidate\n\nThe candidate\'s RTR status will update to "Received" once sent. This prevents duplicate submissions.',
    options: [
      { id: 'candidates-back', text: '← Back to Candidates menu', nextTemplateId: 'candidates-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  // Submissions Menu
  {
    id: 'submissions-menu',
    message: 'What do you need help with regarding Submissions?',
    options: [
      { id: 'create-submission', text: 'How to submit a candidate', nextTemplateId: 'create-submission-help' },
      { id: 'submission-status', text: 'Understanding submission statuses', nextTemplateId: 'submission-status-help' },
      { id: 'duplicate-check', text: 'Duplicate submission prevention', nextTemplateId: 'duplicate-check-help' },
      { id: 'back', text: '← Back to main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'create-submission-help',
    message: 'To submit a candidate for a job:\n\n1. Go to candidate profile\n2. Click "Submit Candidate"\n3. Select the job from the list\n4. Fill in submission details:\n   • Availability and engagement\n   • Pay rates and location preferences\n5. Compose submission email\n6. Send to client\n\nThe submission will be tracked in the Submissions module.',
    options: [
      { id: 'submissions-back', text: '← Back to Submissions menu', nextTemplateId: 'submissions-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'submission-status-help',
    message: 'Submission statuses:\n\n• **Submitted**: Candidate has been submitted to client\n• **Rejected**: Client has declined the candidate\n• **Offered**: Client has made an offer to candidate\n\nYou can filter submissions by status and track their progress through the pipeline.',
    options: [
      { id: 'submissions-back', text: '← Back to Submissions menu', nextTemplateId: 'submissions-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'duplicate-check-help',
    message: 'Duplicate Prevention:\n\nThe system automatically checks for duplicate submissions when you try to submit a candidate for a job they\'ve already been submitted to.\n\nIf a duplicate is detected, you\'ll see a warning message and the submission will be blocked to prevent conflicts.',
    options: [
      { id: 'submissions-back', text: '← Back to Submissions menu', nextTemplateId: 'submissions-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  // Video Menu
  {
    id: 'video-menu',
    message: 'What do you need help with regarding Video Interviews?',
    options: [
      { id: 'create-template', text: 'Creating interview templates', nextTemplateId: 'create-template-help' },
      { id: 'conduct-interview', text: 'Conducting video interviews', nextTemplateId: 'conduct-interview-help' },
      { id: 'ai-interviewer', text: 'AI interviewer features', nextTemplateId: 'ai-interviewer-help' },
      { id: 'technical-requirements', text: 'Technical requirements', nextTemplateId: 'video-tech-help' },
      { id: 'back', text: '← Back to main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'create-template-help',
    message: 'Creating Interview Templates:\n\n1. Go to Video → Settings\n2. Click "Create Template"\n3. Configure:\n   • Template name and description\n   • AI interviewer personality\n   • Interview duration\n   • Questions and expected keywords\n4. Save template\n\nTemplates can be reused for multiple interviews.',
    options: [
      { id: 'video-back', text: '← Back to Video menu', nextTemplateId: 'video-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'conduct-interview-help',
    message: 'Conducting Video Interviews:\n\n1. Select an interview template\n2. Generate interview link\n3. Send link to candidate\n4. Candidate joins and interview starts automatically\n5. AI conducts the interview\n6. Review recording and transcript afterward\n\nThe AI handles the entire interview process automatically.',
    options: [
      { id: 'ai-interviewer', text: 'About AI interviewer features', nextTemplateId: 'ai-interviewer-help' },
      { id: 'video-back', text: '← Back to Video menu', nextTemplateId: 'video-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'ai-interviewer-help',
    message: 'AI Interviewer Features:\n\n• **Real-time speech recognition** and response\n• **Intelligent follow-up questions** based on answers\n• **Keyword detection** and analysis\n• **Interruption handling** for natural conversation\n• **Performance scoring** and evaluation\n• **Multiple AI personalities** (Jack, Emma, etc.)\n\nThe AI adapts to candidate responses for a natural interview experience.',
    options: [
      { id: 'video-back', text: '← Back to Video menu', nextTemplateId: 'video-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'video-tech-help',
    message: 'Technical Requirements for Video Interviews:\n\n• **Browser**: Chrome or Edge (recommended)\n• **Camera and microphone** access required\n• **Stable internet connection**\n• **Allow permissions** for camera and microphone\n• **Quiet environment** for best speech recognition\n\nThe system will test your setup before starting the interview.',
    options: [
      { id: 'video-back', text: '← Back to Video menu', nextTemplateId: 'video-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  // Automation Menu
  {
    id: 'automation-menu',
    message: 'What do you need help with regarding Automation?',
    options: [
      { id: 'create-workflow', text: 'Creating workflows', nextTemplateId: 'create-workflow-help' },
      { id: 'workflow-activities', text: 'Available workflow activities', nextTemplateId: 'workflow-activities-help' },
      { id: 'message-templates', text: 'Message templates and SMS', nextTemplateId: 'message-templates-help' },
      { id: 'back', text: '← Back to main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'create-workflow-help',
    message: 'Creating Automation Workflows:\n\n1. Go to Automation module\n2. Click "Create Workflow"\n3. Use drag-and-drop builder:\n   • Add activities from the panel\n   • Connect activities with arrows\n   • Configure each activity\'s settings\n4. Test the workflow\n5. Save and activate\n\nWorkflows can automate SMS, emails, calls, and more.',
    options: [
      { id: 'workflow-activities', text: 'What activities are available?', nextTemplateId: 'workflow-activities-help' },
      { id: 'automation-back', text: '← Back to Automation menu', nextTemplateId: 'automation-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'workflow-activities-help',
    message: 'Available Workflow Activities:\n\n• **SMS**: Send text messages to candidates\n• **Email**: Send automated emails\n• **Call**: Make phone calls with scripts\n• **Delay**: Wait for specified time\n• **Condition**: Branch based on criteria\n• **API Call**: Integrate with external systems\n• **Webhook**: Send/receive webhook notifications\n• **Database**: Query or update data\n\nEach activity can be configured with variables like {{candidateName}}.',
    options: [
      { id: 'automation-back', text: '← Back to Automation menu', nextTemplateId: 'automation-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'message-templates-help',
    message: 'Message Templates and SMS:\n\n• Create reusable message templates\n• Use variables like {{candidateName}}, {{jobTitle}}\n• Set up conversational SMS flows\n• Schedule messages and reminders\n• Track response rates and engagement\n\nTemplates can be converted into automated workflows for complex sequences.',
    options: [
      { id: 'automation-back', text: '← Back to Automation menu', nextTemplateId: 'automation-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  // Technical Menu
  {
    id: 'technical-menu',
    message: 'What technical issue are you experiencing?',
    options: [
      { id: 'login-issues', text: 'Login or authentication problems', nextTemplateId: 'login-issues-help' },
      { id: 'permission-denied', text: 'Permission denied errors', nextTemplateId: 'permission-denied-help' },
      { id: 'file-upload', text: 'File upload problems', nextTemplateId: 'file-upload-help' },
      { id: 'video-issues', text: 'Video interview technical issues', nextTemplateId: 'video-issues-help' },
      { id: 'performance', text: 'Slow performance or loading', nextTemplateId: 'performance-help' },
      { id: 'back', text: '← Back to main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'login-issues-help',
    message: 'Login Troubleshooting:\n\n1. **Check credentials**: Ensure username and password are correct\n2. **Account status**: Verify your account is active\n3. **Browser cache**: Clear browser cache and cookies\n4. **Try incognito mode**: Test in private/incognito window\n5. **Password reset**: Use "Forgot Password" if needed\n\nIf issues persist, contact your administrator.',
    options: [
      { id: 'contact-admin', text: 'How to contact administrator', nextTemplateId: 'contact-admin-help' },
      { id: 'technical-back', text: '← Back to Technical menu', nextTemplateId: 'technical-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'permission-denied-help',
    message: 'Permission Denied Solutions:\n\n• **Check your role**: Different roles have different access levels\n• **Contact administrator**: Request access to specific modules\n• **Role types**:\n  - SuperAdmin: Full access\n  - Admin: Administrative access\n  - Employee: Limited access\n\nPermissions are configured per module (Jobs, Candidates, etc.).',
    options: [
      { id: 'user-roles', text: 'More about user roles', nextTemplateId: 'user-roles-help' },
      { id: 'technical-back', text: '← Back to Technical menu', nextTemplateId: 'technical-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'file-upload-help',
    message: 'File Upload Troubleshooting:\n\n• **Check file format**: Only PDF, DOC, DOCX supported\n• **File size**: Maximum 10MB per file\n• **Browser compatibility**: Use Chrome or Edge\n• **Network connection**: Ensure stable internet\n• **Try different file**: Test with a smaller file first\n\nIf uploads still fail, try refreshing the page and uploading again.',
    options: [
      { id: 'technical-back', text: '← Back to Technical menu', nextTemplateId: 'technical-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'video-issues-help',
    message: 'Video Interview Technical Issues:\n\n• **Camera/microphone permissions**: Allow access when prompted\n• **Browser compatibility**: Use Chrome or Edge\n• **Internet connection**: Ensure stable, high-speed connection\n• **Close other applications**: Free up system resources\n• **Refresh and retry**: Reload the page if issues occur\n• **Test beforehand**: Use preview mode to test setup\n\nFor best results, use a quiet environment with good lighting.',
    options: [
      { id: 'video-back', text: '← Video interview help', nextTemplateId: 'video-menu' },
      { id: 'technical-back', text: '← Back to Technical menu', nextTemplateId: 'technical-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'performance-help',
    message: 'Performance Optimization:\n\n• **Clear browser cache**: Remove stored data\n• **Close unused tabs**: Free up browser memory\n• **Check internet speed**: Ensure adequate bandwidth\n• **Update browser**: Use latest version\n• **Disable extensions**: Temporarily disable browser extensions\n• **Restart browser**: Close and reopen completely\n\nFor persistent issues, try using a different browser or device.',
    options: [
      { id: 'technical-back', text: '← Back to Technical menu', nextTemplateId: 'technical-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  // Account Menu
  {
    id: 'account-menu',
    message: 'What do you need help with regarding your Account?',
    options: [
      { id: 'user-roles', text: 'Understanding user roles', nextTemplateId: 'user-roles-help' },
      { id: 'change-password', text: 'Changing your password', nextTemplateId: 'change-password-help' },
      { id: 'profile-settings', text: 'Updating profile settings', nextTemplateId: 'profile-settings-help' },
      { id: 'permissions', text: 'Understanding permissions', nextTemplateId: 'permissions-help' },
      { id: 'back', text: '← Back to main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'user-roles-help',
    message: 'User Roles Explained:\n\n• **SuperAdmin**: Full system access, can manage all users and settings\n• **Admin**: Administrative access, can manage most features and users\n• **Employee**: Standard user access, limited to assigned modules\n\nRole permissions can be customized by administrators in the Access Control module.',
    options: [
      { id: 'permissions', text: 'More about permissions', nextTemplateId: 'permissions-help' },
      { id: 'account-back', text: '← Back to Account menu', nextTemplateId: 'account-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'permissions-help',
    message: 'Understanding Permissions:\n\nPermissions control what you can do in each module:\n• **Read**: View data\n• **Create**: Add new records\n• **Update**: Edit existing records\n• **Delete**: Remove records\n\nPermissions are set per role and per module. Contact your administrator to request additional access.',
    options: [
      { id: 'contact-admin', text: 'How to contact administrator', nextTemplateId: 'contact-admin-help' },
      { id: 'account-back', text: '← Back to Account menu', nextTemplateId: 'account-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'change-password-help',
    message: 'To change your password:\n\n1. Click on your profile in the top-right corner\n2. Select "My Profile"\n3. Scroll to "Account Settings"\n4. Click "Update" next to "Change Password"\n5. Enter current and new password\n6. Click "Update Password"\n\nPasswords must be at least 6 characters long.',
    options: [
      { id: 'account-back', text: '← Back to Account menu', nextTemplateId: 'account-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'profile-settings-help',
    message: 'Updating Profile Settings:\n\n1. Click your profile in the top-right\n2. Select "My Profile"\n3. Click "Edit Profile"\n4. Update your information:\n   • Name, email, phone\n   • Company and department\n   • Location and bio\n5. Click "Save Changes"\n\nSome fields may require administrator approval to change.',
    options: [
      { id: 'account-back', text: '← Back to Account menu', nextTemplateId: 'account-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  // Helper templates
  {
    id: 'contact-admin-help',
    message: 'Contacting Your Administrator:\n\n• **Check user list**: Go to Access → Users to see administrators\n• **Email**: Contact users with "Admin" or "SuperAdmin" roles\n• **Internal communication**: Use your organization\'s standard communication channels\n\nFor technical support, you can also contact:\n📧 Email: support@virtuosou.com\n📞 Phone: (800) 555-1234',
    options: [
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  },
  
  {
    id: 'filter-jobs-help',
    message: 'Filtering and Searching Jobs:\n\n• **Search bar**: Type job title, ID, or client name\n• **Status filter**: Use tabs (Active, Inactive, All)\n• **Date range**: Filter by creation date\n• **Advanced search**: Combine multiple criteria\n\nFilters help you quickly find specific jobs in large lists.',
    options: [
      { id: 'jobs-back', text: '← Back to Jobs menu', nextTemplateId: 'jobs-menu' },
      { id: 'main', text: '🏠 Main menu', nextTemplateId: 'start' }
    ]
  }
];

export const getTemplateById = (id: string): ChatTemplate | undefined => {
  return chatTemplates.find(template => template.id === id);
};

export const getStartTemplate = (): ChatTemplate => {
  return chatTemplates.find(template => template.isStart) || chatTemplates[0];
};