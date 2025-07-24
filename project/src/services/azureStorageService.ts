import api from './api';

export const generateSasUrl = async (blobUrl: string): Promise<string> => {
  try {
    const response = await api.post('/storage/generate-sas-url', { blobUrl });
    
    if (!response.data) {
      throw new Error('Failed to generate SAS URL');
    }

    return response.data.sasUrl;
  } catch (error) {
    console.error('Error generating SAS URL:', error);
    throw error;
  }
};