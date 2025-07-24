import api from './api';

export interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
}

export const fetchContacts = async (): Promise<Contact[]> => {
  try {
    // Try to fetch from contacts API endpoint
    const response = await api.get('/contacts/');
    return response.data.map((contact: any) => ({
      id: contact.id.toString(),
      name: contact.name || contact.full_name || '',
      email: contact.email,
      company: contact.company || ''
    }));
  } catch (error) {
    // If contacts endpoint doesn't exist, fall back to candidates
    try {
      const candidatesResponse = await api.get('/candidates/?limit=1000');
      return candidatesResponse.data.map((candidate: any) => ({
        id: candidate.id.toString(),
        name: `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim(),
        email: candidate.email,
        company: candidate.company || ''
      })).filter((contact: Contact) => contact.email && contact.email.includes('@'));
    } catch (fallbackError) {
      console.error('Failed to fetch contacts:', fallbackError);
      return [];
    }
  }
};