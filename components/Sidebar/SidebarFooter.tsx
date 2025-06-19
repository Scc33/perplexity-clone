"use client";

import { useState, useEffect } from "react";
import { UserProfile } from "../../types";
import { loadUserProfile } from "../../utils/UserProfileLocalStorage";
import Link from "next/link";

export default function SidebarFooter() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "User",
    email: "user@example.com",
  });

  useEffect(() => {
    const savedProfile = loadUserProfile();
    setProfile(savedProfile);
  }, []);

  return (
    <div className="p-4 border-t border-gray-700">
      <Link href="/profile">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">👤</span>
          </div>
          <div>
            <div className="text-sm font-medium">{profile.name}</div>
            <div className="text-xs text-gray-500">{profile.email}</div>
          </div>
        </div>
      </Link>
    </div>
  );
}
