import React, { useState } from 'react';

interface DeleteModalProps {
  title: string;
  message: string;
  onConfirm: () => Promise<boolean>; // expects true/false
  onCancel: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  title,
  message,
  onConfirm,
  onCancel
}) => {
  const [error, setError] = useState('');
  const [isDenied, setIsDenied] = useState(false);

  const handleConfirm = async () => {
    const success = await onConfirm();
    if (!success) {
      setError('Access denied — You do not have required permissions.');
      setIsDenied(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-600 p-6 rounded-xl shadow-2xl w-full max-w-md transition-all duration-200">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h2>
        <p className="text-gray-700 dark:text-white">{message}</p>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDenied}
            className={`px-4 py-2 rounded-md text-white font-semibold transition ${
              isDenied
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            Delete
          </button>
        </div>

        {error && (
          <div className="mt-4 text-center">
            <p className="text-red-600 dark:text-red-400 text-sm font-semibold">{error}</p>
          </div>
        )}
      </div>


    </div>
  );
};

export default DeleteModal;
