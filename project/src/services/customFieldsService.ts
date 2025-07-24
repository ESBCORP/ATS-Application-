import api from './api';

const BASE_URL = '/custom-fields';

export interface CustomField {
  id: number;
  resource_id: number;
  field_name: string;
  field_label: string;
  field_type: string;
  is_required: boolean;
  field_options: string;
  default_value: string;
  placeholder: string;
  help_text: string;
  field_order: number;
  is_active: boolean;
  is_default: boolean;
  created_by: string;
  created_at: string;
  modified_by: string | null;
  modified_at: string | null;
}

interface FieldResponse {
  resource_name: string;
  resource_id: number;
  fields: CustomField[];
  total_fields: number;
}

export const getCustomFields = async (
  resourceId: number
): Promise<CustomField[]> => {
  try {
    const response = await api.get<FieldResponse>(
      `${BASE_URL}/${resourceId}/fields/`,
      { 
        params: { include_inactive: false }
      }
    );
    return response.data.fields;
  } catch (error) {
    console.error(`Error fetching custom fields for resource ${resourceId}:`, error);
    throw error;
  }
};


// ✅ POST a new custom field
export const createCustomField = async (
  resourceId: number,
  payload: Omit<CustomField, 'id' | 'resource_id' | 'created_by' | 'created_at' | 'modified_by' | 'modified_at' | 'is_default'>
): Promise<CustomField> => {
  try {
    const response = await api.post(
      `${BASE_URL}/${resourceId}/fields/`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(`Error creating custom field for resource ${resourceId}:`, error);
    throw error;
  }
};

// ✅ PUT update an existing custom field
export const updateCustomField = async (
  resourceId: number,
  fieldId: number,
  payload: {
    field_label: string;
    field_type: string;
    is_required: boolean;
    field_options: string;
    default_value: string;
    placeholder: string;
    help_text: string;
    field_order: number;
    is_active: boolean;
  }
): Promise<CustomField> => {
  try {
    const response = await api.put(
      `${BASE_URL}/${resourceId}/fields/${fieldId}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating custom field ${fieldId} for resource ${resourceId}:`, error);
    throw error;
  }
};

export const deleteCustomField = async (
  resourceId: number,
  fieldId: number
): Promise<void> => {
  try {
    await api.delete(`${BASE_URL}/${resourceId}/fields/${fieldId}`);
  } catch (error) {
    console.error(`Error deleting custom field ${fieldId} for resource ${resourceId}:`, error);
    throw error;
  }
};