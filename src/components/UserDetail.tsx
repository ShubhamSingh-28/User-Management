import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchUsers } from "../api/user";
import type { userType as User } from "../type";
import { UserSkeleton } from "./UserSkeleton";

// Import icons for visual detail
import { User as UserIcon, Mail, Phone, Home, ArrowLeft } from 'lucide-react';

export default function UserDetail() {
  const { id } = useParams();
  const loc = useLocation();
  // Ensure cachedUser is correctly typed and handled
  const cachedUser = (loc.state as { user?: User } | undefined)?.user;

  const [user, setUser] = useState<User | null>(cachedUser || null);
  const [loading, setLoading] = useState(!cachedUser);
  const [error, setError] = useState<string | null>(null);

  // Load user if not cached
  useEffect(() => {
    if (cachedUser) return; // skip API call

    async function load() {
      try {
        // NOTE: In a real-world app, you'd call a specific fetchUser(id) API endpoint
        // instead of fetching the whole list. We keep the current logic for consistency.
        const list = await fetchUsers(); 
        const found = list.find((u) => String(u.id) === id);

        if (!found) throw new Error("User not found");

        setUser(found);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, cachedUser]); // Dependency array updated to include cachedUser

  // --- Rendering States ---
  if (loading) return <UserSkeleton />;
  
  if (error) return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-xl text-center">
      <p className="text-red-700 font-medium">Error: {error}</p>
    </div>
  );
  
  if (!user) return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
      <p className="text-yellow-700 font-medium">No user data found for ID: {id}.</p>
    </div>
  );

  // --- User Details Display ---
  return (
    // Modern container styling with shadow and rounded corners
    <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-8 mt-10 border border-gray-100">
      
      {/* Header and Back Button */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <UserIcon className="w-6 h-6 mr-2 text-blue-600" />
          User Profile
        </h1>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center cursor-pointer text-sm text-gray-600 hover:text-blue-600 transition duration-150"
          title="Go Back"
        >
          <ArrowLeft className="w-4 cursor-pointer h-4 mr-1" />
          Back
        </button>
      </div>

      {/* Detail Grid */}
      <div className="grid gap-5">

        {/* Name */}
        <DetailItem 
          icon={UserIcon} 
          label="Full Name" 
          value={user.name} 
          valueClass="text-2xl font-extrabold text-gray-900"
        />
        
        {/* Email */}
        <DetailItem 
          icon={Mail} 
          label="Email Address" 
          value={user.email} 
          link={`mailto:${user.email}`}
        />

        {/* Phone */}
        <DetailItem 
          icon={Phone} 
          label="Phone Number" 
          value={user.phone} 
          link={`tel:${user.phone}`}
        />

        {/* Address (if available) */}
        {user.address && (
          <DetailItem 
            icon={Home} 
            label="Address" 
            value={`${user.address.street}, ${user.address.city}`}
          />
        )}
      </div>

      {/* Footer / Spacer */}
      <div className="mt-8 border-t pt-4 text-xs text-gray-400">
        User ID: {user.id}
      </div>

    </div>
  );
}


// Reusable Detail Item Component
interface DetailItemProps {
    icon: React.ElementType;
    label: string;
    value: string;
    link?: string;
    valueClass?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon: Icon, label, value, link, valueClass = 'text-lg font-medium text-gray-700' }) => (
    <div className="flex items-start p-3 bg-gray-50 rounded-xl border border-gray-200">
        {/* Icon */}
        <div className="flex-shrink-0 pt-1">
            <Icon className="w-5 h-5 text-blue-500" />
        </div>
        
        {/* Label and Value */}
        <div className="ml-4 overflow-hidden">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
                {label}
            </p>
            {link ? (
                <a 
                    href={link} 
                    className={`block text-blue-600 hover:text-blue-700 hover:underline transition truncate ${valueClass}`}
                >
                    {value}
                </a>
            ) : (
                <p className={`truncate ${valueClass}`}>{value}</p>
            )}
        </div>
    </div>
);