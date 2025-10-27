import React from 'react';

const EnvTest: React.FC = () => {
  return (
    <div className="p-4 bg-yellow-100 rounded-lg">
      <h3 className="font-bold mb-2">Environment Variables Test</h3>
      <p>VITE_OPENAI_API_KEY: {import.meta.env.VITE_OPENAI_API_KEY ? '✅ Set' : '❌ Not set'}</p>
      <p className="text-xs mt-2 text-gray-600">
        Note: The key itself is hidden for security. This only checks if it's loaded.
      </p>
    </div>
  );
};

export default EnvTest;
