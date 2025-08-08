import React from "react";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProfileButton: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <Button
      variant="ghost"
      className="absolute top-4 left-4 flex items-center gap-2 px-2 py-1"
      onClick={() => navigate("/profile")}
      aria-label="Profile"
    >
      {user.photoURL ? (
        <img
          src={user.photoURL}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover border border-blue-300"
        />
      ) : (
        <UserIcon className="w-6 h-6 text-blue-500" />
      )}
      <span className="hidden sm:inline text-sm font-medium">{user.displayName || "Profile"}</span>
    </Button>
  );
};

export default ProfileButton;