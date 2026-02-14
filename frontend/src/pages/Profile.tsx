import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { clearAuthSession, getAuthSession, setAuthSession } from "../lib/session";
import { supabase } from "../lib/supabase";

interface ProfileData {
  id?: string;
  name: string;
  email: string;
  role: string;
  company?: string;
  github?: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string;
  avatar_url?: string;
}

function decodeTokenPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export default function Profile() {
  const navigate = useNavigate();
  const session = getAuthSession();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  const [profileData, setProfileData] = useState<ProfileData>({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    role: session?.user?.role || "",
    company: session?.user?.company || "",
    github: session?.user?.github || "",
    phone: "",
    location: "",
    bio: "",
    skills: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (!session) return;
    loadProfile();
  }, [session]);

  const loadProfile = async () => {
    if (!session?.user?.email) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', session.user.email)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfileData({
          id: data.id,
          name: data.name || session.user.name,
          email: data.email || session.user.email,
          role: data.role || session.user.role,
          company: data.company || session.user.company || "",
          github: data.github || session.user.github || "",
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || "",
          skills: data.skills || "",
          avatar_url: data.avatar_url || "",
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user?.email) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.email.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      // Update profile data with new avatar URL
      setProfileData(prev => ({ ...prev, avatar_url: urlData.publicUrl }));
      
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!session?.user?.email) return;

    setLoading(true);
    setError("");
    setSaveSuccess(false);

    try {
      // Upsert profile data
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          email: session.user.email,
          name: profileData.name,
          role: profileData.role,
          company: profileData.company || null,
          github: profileData.github || null,
          phone: profileData.phone || null,
          location: profileData.location || null,
          bio: profileData.bio || null,
          skills: profileData.skills || null,
          avatar_url: profileData.avatar_url || null,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'email'
        });

      if (upsertError) throw upsertError;

      // Update session with new data
      const updatedSession = {
        ...session,
        user: {
          ...session.user,
          name: profileData.name,
          company: profileData.company,
          github: profileData.github,
        }
      };
      setAuthSession(updatedSession);

      setSaveSuccess(true);
      setIsEditing(false);
      
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadProfile(); // Reload original data
    setError("");
  };

  if (!session) {
    return <Navigate to="/candidate/login" replace />;
  }

  const payload = decodeTokenPayload(session.token);
  const expiresAt =
    payload && typeof payload.exp === "number"
      ? new Date(payload.exp * 1000).toLocaleString()
      : "Not available";

  const handleSignOut = () => {
    clearAuthSession();
    navigate(session.role === "candidate" ? "/candidate/login" : "/recruiter/login");
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-white">
      <Sidebar />
      <main className="flex-1 p-8 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-white/50 mt-1">Manage your account information and preferences.</p>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 rounded-xl border border-purple-400/30 text-purple-300 hover:bg-purple-500/10 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {saveSuccess && (
          <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Profile updated successfully!
          </div>
        )}

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        {/* Profile Photo Section */}
        <section className="mb-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold mb-4">Profile Photo</h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                {profileData.avatar_url ? (
                  <img
                    src={profileData.avatar_url}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-white/10"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-3xl font-bold">
                    {profileData.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              {isEditing && (
                <div>
                  <label className="px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/5 transition-colors cursor-pointer inline-block">
                    {uploading ? "Uploading..." : "Upload Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-white/40 mt-2">JPG, PNG or GIF. Max 5MB.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                ) : (
                  <p className="text-white">{profileData.name}</p>
                )}
              </div>

              <div>
                <label className="block text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                  Email
                </label>
                <p className="text-white/60 text-sm">{profileData.email}</p>
                <p className="text-white/30 text-xs mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                ) : (
                  <p className="text-white">{profileData.phone || "Not set"}</p>
                )}
              </div>

              <div>
                <label className="block text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, Country"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                ) : (
                  <p className="text-white">{profileData.location || "Not set"}</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold mb-4">Professional Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                  Role
                </label>
                <p className="text-white capitalize">{profileData.role}</p>
              </div>

              <div>
                <label className="block text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                  Company/College
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.company}
                    onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Your company/College name"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                ) : (
                  <p className="text-white">{profileData.company || "Not set"}</p>
                )}
              </div>

              <div>
                <label className="block text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                  GitHub Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.github}
                    onChange={(e) => setProfileData(prev => ({ ...prev, github: e.target.value }))}
                    placeholder="username"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                ) : (
                  <p className="text-white">{profileData.github || "Not set"}</p>
                )}
              </div>

              <div>
                <label className="block text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                  Skills
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.skills}
                    onChange={(e) => setProfileData(prev => ({ ...prev, skills: e.target.value }))}
                    placeholder="React, Node.js, Python..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                ) : (
                  <p className="text-white">{profileData.skills || "Not set"}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Bio Section */}
        <section className="mb-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold mb-4">Bio</h2>
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
              />
            ) : (
              <p className="text-white/80 whitespace-pre-wrap">{profileData.bio || "No bio added yet."}</p>
            )}
          </div>
        </section>

        {/* Session Information */}
        <section className="mb-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold mb-4">Session Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/50">Status:</span>
                <span className="ml-2 text-green-400">Active</span>
              </div>
              <div>
                <span className="text-white/50">Expires:</span>
                <span className="ml-2 text-white">{expiresAt}</span>
              </div>
            </div>
          </div>
        </section>

        <button
          onClick={handleSignOut}
          className="px-5 py-2.5 rounded-xl border border-red-400/30 text-red-300 hover:bg-red-500/10 transition-colors"
        >
          Sign Out
        </button>
      </main>
    </div>
  );
}