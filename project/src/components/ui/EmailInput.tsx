import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, User, Mail } from 'lucide-react';
import { Contact } from '../../services/contactsService';

interface EmailInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  contacts: Contact[];
  required?: boolean;
  error?: string | null;
}

const EmailInput: React.FC<EmailInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  contacts,
  required = false,
  error = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && value.length > 0) {
      // Get the current text being typed (after the last comma)
      const emails = value.split(',');
      const currentInput = emails[emails.length - 1].trim();
      
      if (currentInput.length > 0) {
        const filtered = contacts.filter(contact =>
          contact.email.toLowerCase().includes(currentInput.toLowerCase()) ||
          contact.name.toLowerCase().includes(currentInput.toLowerCase())
        ).slice(0, 10); // Limit to 10 suggestions
        setFilteredContacts(filtered);
        setIsOpen(filtered.length > 0);
      } else {
        setFilteredContacts([]);
        setIsOpen(false);
      }
    } else {
      setFilteredContacts([]);
      setIsOpen(false);
    }
  }, [value, contacts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleContactSelect = (contact: Contact) => {
    // Split current value by commas and trim each part
    const emails = value.split(',').map(email => email.trim()).filter(Boolean);
    
    // Remove the last incomplete email (the one being typed)
    if (emails.length > 0) {
      const lastEmail = emails[emails.length - 1];
      // If the last email doesn't contain @ or is incomplete, replace it
      if (!lastEmail.includes('@') || lastEmail.length < 3) {
        emails[emails.length - 1] = contact.email;
      } else {
        // Otherwise, add as new email
        emails.push(contact.email);
      }
    } else {
      // If no emails exist, add the first one
      emails.push(contact.email);
    }
    
    // Join with commas and add space after each comma for readability
    const newValue = emails.join(', ');
    onChange(newValue);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' && filteredContacts.length > 0) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <div className="relative w-full">
      <label htmlFor={label} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="email"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            w-full rounded-md border px-3 py-2 text-sm shadow-sm pr-10
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
            }
            focus:outline-none focus:ring-1
          `}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Mail className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {isOpen && filteredContacts.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => handleContactSelect(contact)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-50 dark:focus:bg-gray-700 focus:outline-none border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {contact.name || 'Unknown'}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {contact.email}
                  </div>
                  {contact.company && (
                    <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                      {contact.company}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
      
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Separate multiple email addresses with commas
      </p>
    </div>
  );
};

export default EmailInput;