import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <div className="mb-6 text-center">
          <Link to="/">
            <h1 className="text-2xl font-bold">VidFlow</h1>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
