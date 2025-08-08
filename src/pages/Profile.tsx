import React, { useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserIcon, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [email, setEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Not signed in.</div>;
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (ev) => {
      if (typeof ev.target?.result === "string") {
        setPhotoURL(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (auth.currentUser) {
        // Update display name and photo
        await updateProfile(auth.currentUser, {
          displayName,
          photoURL: photoURL || undefined,
        });
        // Update email if changed
        if (email && email !== user.email) {
          await updateEmail(auth.currentUser, email);
        }
        // Update password if provided
        if (newPassword) {
          await updatePassword(auth.currentUser, newPassword);
        }
        setSuccess("Profile updated!");
        setNewPassword("");
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-2">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-blue-500" />
            Profile & Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSave}>
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-400"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-blue-200">
                    <UserIcon className="w-10 h-10 text-gray-400" />
                  </div>
                )}
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full p-1"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Change photo"
                >
                  <Camera className="w-4 h-4" />
                </Button>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                />
              </div>
              <div className="text-sm text-gray-700 mt-1">{user.email}</div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1" htmlFor="displayName">
                Display Name
              </label>
              <Input
                id="displayName"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1" htmlFor="newPassword">
                New Password
              </label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            {success && <div className="text-green-600 text-xs text-center">{success}</div>}
            {error && <div className="text-red-500 text-xs text-center">{error}</div>}
          </form>
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => navigate("/")}
          >
            ← Back to App
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;