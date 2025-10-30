import React from 'react';
import { useUserStore } from '../../store/user';

export default function AppHeader() {
  const user = useUserStore((s) => s.user);
  const clear = useUserStore((s) => s.clear);
  return (
    <header className="h-12 border-b flex items-center justify-between px-4 bg-white">
      <div className="font-semibold">VidFlow</div>
      <div className="flex items-center gap-3">
        {user && <span className="text-sm text-gray-600">{user.name}</span>}
        <button
          onClick={clear}
          className="rounded bg-gray-100 hover:bg-gray-200 text-sm px-3 py-1"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
