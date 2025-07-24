import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Plus } from 'lucide-react';
import { getCustomFields,createCustomField, updateCustomField, deleteCustomField, CustomField } from '../../services/customFieldsService';
import { getResources } from '../../services/permissionsService';
import DeleteModal from '../../components/modals/DeleteModal';

const formatDateToDDMMYYYY = (isoDate: string) => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

const formatDateForInput = (formattedDate: string) => {
  if (!formattedDate) return '';
  const [day, month, year] = formattedDate.split("/");
  return `${year}-${month}-${day}`;
};


const CustomFieldModal = ({
  visible,
  onClose,
  onSave,
  title,
  fieldName,
  setFieldName,
  fieldType,
  setFieldType,
  defaultValue,
  setDefaultValue,
  isLoading,
  isEditing,
  selectOptions,
  setSelectOptions
}) => {

  
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" onClick={onClose} />
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="relative w-full max-w-xl rounded-xl bg-white dark:bg-[#1f2937] border dark:border-gray-700 p-6 shadow-2xl transition">
          <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>

          <div className="space-y-5">
            <Input
              label="Custom Field Name"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              placeholder="Enter field name"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Field Type</label>
              <select
                value={fieldType}
                onChange={(e) => setFieldType(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white px-2 py-2"
                required
              >
                <option value="" disabled hidden> Select field type </option>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="boolean">Boolean</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="url">URL</option>
                <option value="textarea">TextArea</option>
                <option value="select">Select</option>
              </select>
            </div>

          {fieldType.toLowerCase() === 'select' ? (
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Options (Select one as default)
              </label>
              {(selectOptions || []).map((opt, idx) => {
                const safeOpt = typeof opt === 'string' ? opt : '';
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="defaultValue"
                      checked={defaultValue === safeOpt}
                      onChange={() => setDefaultValue(safeOpt)}
                    />
                    <Input
                      value={safeOpt}
                      onChange={(e) => {
                        const updated = [...selectOptions];
                        updated[idx] = e.target.value;
                        setSelectOptions(updated);

                        if (defaultValue === safeOpt) {
                          setDefaultValue(e.target.value);
                        }
                      }}
                      placeholder={`Option ${idx + 1}`}
                    />
                    {selectOptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updated = selectOptions.filter((_, i) => i !== idx);
                          setSelectOptions(updated);
                          if (defaultValue === safeOpt) {
                            setDefaultValue('');
                          }
                        }}
                        className="text-red-500 text-xs px-1"
                      >
                        ❌
                      </button>
                    )}
                    {idx === selectOptions.length - 1 && (
                      <button
                        type="button"
                        onClick={() => setSelectOptions([...selectOptions, ''])}
                        className="text-blue-600 text-xl font-bold px-2"
                      >
                        +
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : fieldType.toLowerCase() === 'date' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Default Value
              </label>

              <input
                type="date"
                value={formatDateForInput(defaultValue)}
                onChange={(e) => {
                  const selected = e.target.value;
                  const formatted = selected ? formatDateToDDMMYYYY(selected) : '';
                  setDefaultValue(formatted);
                }}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white px-2 py-2"
              />
            </div>
          ) : (
            <Input
              label="Default Value"
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
              placeholder="Optional default value"
            />
          )}


            <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button 
              onClick={onSave} 
              disabled={
                !fieldName.trim() ||
                !fieldType ||
                isLoading ||
                (fieldType.toLowerCase() === 'select' && selectOptions.every(opt => !opt.trim()))
              }
            >

              {isLoading
                ? isEditing
                  ? 'Updating...'
                  : 'Creating...'
                : isEditing
                  ? 'Update Custom Field'
                  : 'Create Custom Field'}
            </Button>
          </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const CustomFields: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  type Resource = {
  id: number;
  name: string;
};

const [resources, setResources] = useState<Resource[]>([]);
const [fields, setFields] = useState<Record<number, CustomField[]>>({});
const [currentResource, setCurrentResource] = useState<Resource | null>(null);

  
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState('');
  const [defaultValue, setDefaultValue] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuFieldId, setMenuFieldId] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<CustomField | null>(null);
  const [selectOptions, setSelectOptions] = useState<string[]>(['']);
  const [isDeleting, setIsDeleting] = useState(false); 

 useEffect(() => {
  // Only reset selectOptions when modal opens for non-select fields
  // AND when we're not editing an existing field
  if (modalVisible && fieldType.toLowerCase() !== 'select' && !editingField) {
    setSelectOptions(['']);
  }
}, [modalVisible, fieldType, editingField]);


  // Close menu on outside click
  useEffect(() => {
    const closeMenu = () => setMenuFieldId(null);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  // Handle edit field
// Handle edit field - FIXED VERSION
const handleEdit = (field: any) => {
  console.log("Editing field:", field);

  const lowerType = field.field_type?.toLowerCase?.() || 'text';
  console.log('lowerType:', lowerType);
  console.log('options string:', field.field_options);

  setEditingField(field);
  setFieldName(field.field_label || field.field_name || field.name);
  setFieldType(lowerType);
  setDefaultValue(field.default_value || field.default || '');

  // ✅ FIXED: Properly restore select options
  if (lowerType === 'select') {
    const optionsRaw = field.field_options || field.options || '';
    console.log('optionsRaw:', optionsRaw);
    
    if (optionsRaw && typeof optionsRaw === 'string' && optionsRaw.trim()) {
      const options = optionsRaw.split(',').map(o => o.trim()).filter(Boolean);
      console.log('parsed options:', options);
      setSelectOptions(options.length > 0 ? options : ['']);
    } else {
      setSelectOptions(['']);
    }
  } else {
    setSelectOptions(['']);
  }

 const matchedResource = resources.find(r => r.id === field.resource_id);
if (matchedResource) setCurrentResource(matchedResource);

  setModalVisible(true);
  setError(null);
};

  const handleDelete = (field: CustomField) => {
    setFieldToDelete(field);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!fieldToDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteCustomField(fieldToDelete.resource_id, fieldToDelete.id);

      // Remove field from local state
      setFields(prev => ({
  ...prev,
  [fieldToDelete.resource_id]: prev[fieldToDelete.resource_id].filter(f => f.id !== fieldToDelete.id)
}));


  

      setDeleteModalVisible(false);
      setFieldToDelete(null);
    } catch (err: any) {
      console.error('Error deleting custom field:', err);
      if (err.response?.data?.message) {
        setError(`Error: ${err.response.data.message}`);
      } else {
        setError('Failed to delete custom field. Please try again.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

 const openModal = (resource: Resource) => {
  setCurrentResource(resource);
  setEditingField(null);
  setModalVisible(true);
  setFieldName('');
  setFieldType('');
  setDefaultValue('');
  setError(null);
};


  const saveField = async () => {
    if (!currentResource || !fieldName.trim() || !fieldType) return;


    setIsLoading(true);
    setError(null);

    try {
      if (!currentResource || !fieldName.trim() || !fieldType) return;
const resourceId = currentResource.id;

    const optionsString =
  fieldType.toLowerCase() === 'select'
    ? selectOptions
        .map(opt => (typeof opt === 'string' ? opt.trim() : ''))
        .filter(opt => opt !== '')
        .join(',')
    : '';
      if (fieldType.toLowerCase() === 'select' && !optionsString) {
  setError('Please enter at least one option for Select fields or null.');
  setIsLoading(false);
  return;
}


  console.log('selectOptions before save:', selectOptions);

      if (editingField) {
        // Update existing field
        const payload = {
          field_label: fieldName.trim(),
          field_type: fieldType.toUpperCase(),
          is_required: editingField.is_required,
          field_options: optionsString,
          default_value: defaultValue,
          placeholder: editingField.placeholder,
          help_text: editingField.help_text,
          field_order: editingField.field_order,
          is_active: editingField.is_active
        };

        console.log('Updating field with payload:', payload);

        const updatedField = await updateCustomField(resourceId, editingField.id, payload);

        setFields(prev => ({
          ...prev,
          [resourceId]: prev[resourceId].map(field => 
            field.id === editingField.id ? updatedField : field
          )
        }));
      } else {
        // Create new field
        const safeFieldName = fieldName.trim().replace(/\s+/g, '_').toLowerCase();

        const payload = {
          field_name: safeFieldName,
          field_label: fieldName.trim(),
          field_type: fieldType.toUpperCase(),
          is_required: false,
          field_options: optionsString,
          default_value: defaultValue,
          placeholder: '',
          help_text: '',
          field_order: 0,
          is_active: true
        };

        console.log('Creating field with payload:', payload);

        const newField = await createCustomField(resourceId, payload);

        setFields(prev => ({
          ...prev,
          [resourceId]: [...(prev[resourceId] || []), newField]
        }));
      }

      // Reset and close modal
      setModalVisible(false);
      setEditingField(null);
      setFieldName('');
      setFieldType('');
      setDefaultValue('');
    } catch (err: any) {
      console.error('Error saving custom field:', err);
      if (err.response?.data?.message) {
        setError(`Error: ${err.response.data.message}`);
      } else {
        setError(`Failed to ${editingField ? 'update' : 'create'} custom field. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

const loadFields = async () => {
  try {
    setError(null);

    const results = await Promise.allSettled(
      resources.map((resource) =>
        getCustomFields(resource.id).then((fields) => ({
          id: resource.id,
          fields
        }))
      )
    );

    const updated: Record<number, CustomField[]> = {};

    results.forEach((result, index) => {
      const resource = resources[index];
      if (result.status === 'fulfilled') {
        updated[resource.id] = result.value.fields;
      } else {
        console.error(`Error loading fields for ${resource.name}:`, result.reason);
        updated[resource.id] = [];
      }
    });

    setFields(updated);
  } catch (err: any) {
    console.error('Error loading fields:', err);
    setError(`Failed to load custom fields: ${err.message || 'Unknown error'}`);
  } finally {
    setIsInitialLoading(false);
  }
};


const renderSection = (resource: Resource) => (
  <div
    key={resource.id}
    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md px-6 pt-4 pb-2 mt-6"
  >
    {/* Section Title & Add Button */}
    <div className="flex items-center justify-between py-2 pb-3">
      <h2 className="text-xl font-bold capitalize dark:text-white">
        {resource.name}
      </h2>
      <Button size="sm" onClick={() => openModal(resource)}>
        <Plus className="w-4 h-4 mr-1" />
        Add Field
      </Button>
    </div>

    {/* Fields */}
    {(!fields[resource.id] || fields[resource.id].length === 0) ? (
  <p className="text-sm text-gray-500 dark:text-gray-400 py-4 ">
    No custom fields added yet.
  </p>
) : (
  <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {fields[resource.id].map((field) => (
          <div
            key={field.id}
            className="flex items-start justify-between py-2"
          >
            {/* Field Details */}
          <div className="grid grid-cols-1 sm:grid-cols-[300px_1fr] gap-y-1 gap-x-24 pl-4 flex-1">

              <p className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap flex items-center gap-2">
                <span className="text-xl text-gray-700 dark:text-white">•</span>
                {field.field_label || field.field_name}
              </p>
  
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {field.field_type === 'TRUE/FALSE'
                    ? 'Stores a true or false value'
                    : `Stores a ${field.field_type.toLowerCase()} value${
                        field.default_value
                          ? ` (default: "${field.default_value}")`
                          : ' '
                      }`}
              </p>
            </div>

            {/* Actions */}
            <div className="relative ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuFieldId(field.id === menuFieldId ? null : field.id);
                }}
                className="text-gray-800 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none text-[24px] px-2"
              >
                &#8942;
              </button>

              {menuFieldId === field.id && (
                <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setMenuFieldId(null);
                      handleEdit(field);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      setMenuFieldId(null);
                      handleDelete(field);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);


  useEffect(() => {
  const fetchResources = async () => {
    try {
      const res = await getResources();

      // ✅ Filter only required resources
      const allowedNames = ['jobs', 'candidates', 'submissions', 'phone'];

      const filtered = res.filter((r) =>
        allowedNames.includes(r.name?.toLowerCase())
      );

      console.log('Filtered resources:', filtered);

      setResources(filtered);
    } catch (e) {
      console.error('Failed to load resources:', e);
    }
  };

  fetchResources();
}, []);


console.log('Resources from getResources():', resources);

useEffect(() => {
  if (resources.length > 0) {
    loadFields(); // ✅ Safe call after resources load
  }
}, [resources]);


  return (
    <div className="space-y-6">
      <PageHeader
        title="Custom Fields"
        subtitle="Add and manage custom fields across different modules"
      />

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {isInitialLoading ? (
        <div className="flex items-center justify-center py-20 space-x-3">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-base text-gray-600 dark:text-gray-300">
            Loading custom fields...
          </p>
        </div>

      ) : (
        <div className="space-y-6">
          {Array.isArray(resources) && resources.map(renderSection)}
        </div>
      )}

      <CustomFieldModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingField(null);
        }}
        onSave={saveField}
        title={editingField ? "Edit Custom Field" : "New Custom Field"}
        fieldName={fieldName}
        setFieldName={setFieldName}
        fieldType={fieldType}
        setFieldType={setFieldType}
        defaultValue={defaultValue}
        setDefaultValue={setDefaultValue}
        isLoading={isLoading}
        isEditing={!!editingField}
        selectOptions={selectOptions}                
        setSelectOptions={setSelectOptions}  
      />

      {deleteModalVisible && fieldToDelete && (
        <DeleteModal
          title="Delete Custom Field"
          message={
            <>
              Are you sure you want to delete the field{' '}
              <span className="font-bold text-base text-gray-800 dark:text-white">
                {fieldToDelete.field_label || fieldToDelete.field_name}
              </span>
              ?
            </>
          }
          onCancel={() => {
            setDeleteModalVisible(false);
            setFieldToDelete(null);
          }}
          onConfirm={async () => {
            try {
              await deleteCustomField(fieldToDelete.resource_id, fieldToDelete.id);
              setFields(prev => ({
              ...prev,
              [fieldToDelete.resource_id]: prev[fieldToDelete.resource_id].filter(
                (field) => field.id !== fieldToDelete.id
              )
            }));

              setDeleteModalVisible(false);
              setFieldToDelete(null);
              return true;
            } catch (err) {
              console.error('Delete failed:', err);
              return false;
            }
          }}
        />
      )}

    </div>
  );
};

export default CustomFields;