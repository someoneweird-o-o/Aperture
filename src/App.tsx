import React, { useState, useEffect } from "react";
import {
  Aperture,
  Repeat,
  Bookmark,
  Send,
  Bell,
  Grid,
  Upload,
  UserPlus,
  UserCheck,
  Search,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  Smartphone,
  Sun,
  Moon,
  Mail,
  Lock,
  ShieldAlert,
  CheckCircle2,
  Edit3,
  Camera,
  Heart,
} from "lucide-react";

export default function App() {
  const [theme, setTheme] = useState("dark"); // 'dark' | 'light'
  const [activeTab, setActiveTab] = useState("feed"); // 'feed' | 'saved' | 'search' | 'profile'
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Privacy Policy Agreement State (First Launch)
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(false);

  // Email Auth & 2FA Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authStep, setAuthStep] = useState("email"); // 'email' | '2fa'
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");

  // Edit Profile Modal State
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editHandle, setEditHandle] = useState("");
  const [editAvatar, setEditAvatar] = useState("");

  // Check Privacy Policy acceptance on initial load
  useEffect(() => {
    const accepted = localStorage.getItem("aperture_privacy_accepted");
    if (accepted === "true") {
      setHasAcceptedPrivacy(true);
    }
  }, []);

  const handleAcceptPrivacy = () => {
    triggerHaptic([20, 30, 20]);
    localStorage.setItem("aperture_privacy_accepted", "true");
    setHasAcceptedPrivacy(true);
  };

  // Haptic Feedback Helper
  const triggerHaptic = (pattern = 15) => {
    if (
      typeof window !== "undefined" &&
      "navigator" in window &&
      navigator.vibrate
    ) {
      navigator.vibrate(pattern);
    }
  };

  // Mock Database of Users
  const [users, setUsers] = useState([
    {
      id: "user_1",
      name: "Alex Rivera",
      handle: "@arivera",
      email: "alex@example.com",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
      followersCount: 89,
      following: ["user_2"],
      is2FAEnabled: true,
      authMethod: "Email",
    },
    {
      id: "user_2",
      name: "Elena Vance",
      handle: "@elena_vance",
      email: "elena@example.com",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
      followersCount: 125,
      following: [],
      is2FAEnabled: false,
      authMethod: "Email",
    },
    {
      id: "user_3",
      name: "Marcus Chen",
      handle: "@mchen_photos",
      email: "marcus@example.com",
      avatar:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&q=80",
      followersCount: 310,
      following: ["user_1"],
      is2FAEnabled: true,
      authMethod: "Email",
    },
  ]);

  // Current Active Logged-in User
  const [currentUser, setCurrentUser] = useState(users[0]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "Elena Vance started following you.",
      time: "10m ago",
      unread: true,
    },
    {
      id: 2,
      text: "Marcus Chen commented on your photo.",
      time: "2h ago",
      unread: true,
    },
  ]);

  const [posts, setPosts] = useState([
    {
      id: 1,
      authorId: "user_2",
      author: "Elena Vance",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&q=80",
      caption: "Serenity in the high peaks. Captured at dawn.",
      likes: 42,
      isLiked: false,
      comments: ["Incredible atmosphere.", "The light balance is perfection."],
      reposts: 24,
      saves: 142,
      isSaved: false,
      isReposted: false,
    },
  ]);

  const [newCaption, setNewCaption] = useState("");
  const [commentInputs, setCommentInputs] = useState({});

  const toggleTheme = () => {
    triggerHaptic(20);
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Open Edit Profile Modal
  const openEditProfileModal = () => {
    triggerHaptic(15);
    setEditName(currentUser.name);
    setEditHandle(currentUser.handle);
    setEditAvatar(currentUser.avatar);
    setShowEditProfileModal(true);
    setShowAccountMenu(false);
  };

  // Handle Avatar File Upload for Profile Edit
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    triggerHaptic(20);
    setEditAvatar(URL.createObjectURL(file));
  };

  // Save Profile Changes
  const handleSaveProfile = (e) => {
    e.preventDefault();
    triggerHaptic([30, 40, 30]);

    const formattedHandle = editHandle.startsWith("@")
      ? editHandle
      : `@${editHandle}`;

    const updatedUser = {
      ...currentUser,
      name: editName,
      handle: formattedHandle,
      avatar: editAvatar,
    };

    setCurrentUser(updatedUser);

    // Update global users list
    setUsers(users.map((u) => (u.id === currentUser.id ? updatedUser : u)));

    // Update posts authored by this user
    setPosts(
      posts.map((p) => {
        if (p.authorId === currentUser.id) {
          return { ...p, author: editName, avatar: editAvatar };
        }
        return p;
      })
    );

    // Update selected profile if viewing self
    if (selectedUserProfile && selectedUserProfile.id === currentUser.id) {
      setSelectedUserProfile(updatedUser);
    }

    setShowEditProfileModal(false);
  };

  // Email Sign-In Submission
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;
    triggerHaptic(30);
    setAuthStep("2fa");
  };

  // 2FA Verification & Account Swap
  const handleVerify2FA = (e) => {
    e.preventDefault();
    if (twoFactorCode.length < 4) return;

    triggerHaptic([30, 50, 30]);
    const newId = `user_${Date.now()}`;
    const username = emailInput.split("@")[0] || "User";

    const newAcc = {
      id: newId,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      handle: `@${username.toLowerCase()}`,
      email: emailInput,
      avatar:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&q=80",
      followersCount: 0,
      following: [],
      is2FAEnabled: true,
      authMethod: "Email",
    };

    setUsers([...users, newAcc]);
    setCurrentUser(newAcc);
    setShowAuthModal(false);
    setAuthStep("email");
    setEmailInput("");
    setPasswordInput("");
    setTwoFactorCode("");
    setShowAccountMenu(false);
  };

  const toggle2FAStatus = () => {
    triggerHaptic(25);
    const updated = { ...currentUser, is2FAEnabled: !currentUser.is2FAEnabled };
    setCurrentUser(updated);
    setUsers(users.map((u) => (u.id === currentUser.id ? updated : u)));
  };

  // Toggle Follow / Unfollow
  const toggleFollow = (targetUserId) => {
    triggerHaptic([20, 30, 20]);
    const isFollowing = currentUser.following.includes(targetUserId);
    const updatedFollowing = isFollowing
      ? currentUser.following.filter((id) => id !== targetUserId)
      : [...currentUser.following, targetUserId];

    const updatedCurrentUser = { ...currentUser, following: updatedFollowing };
    setCurrentUser(updatedCurrentUser);

    setUsers(
      users.map((u) => {
        if (u.id === currentUser.id) return updatedCurrentUser;
        if (u.id === targetUserId) {
          return {
            ...u,
            followersCount: isFollowing
              ? u.followersCount - 1
              : u.followersCount + 1,
          };
        }
        return u;
      })
    );

    if (selectedUserProfile && selectedUserProfile.id === targetUserId) {
      setSelectedUserProfile((prev) => ({
        ...prev,
        followersCount: isFollowing
          ? prev.followersCount - 1
          : prev.followersCount + 1,
      }));
    }
  };

  // Profile Navigation
  const viewProfile = (userId) => {
    triggerHaptic(15);
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser) {
      setSelectedUserProfile(targetUser);
      setActiveTab("profile");
    }
  };

  // Upload Post Image
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    triggerHaptic([40, 60, 40]);
    const newPost = {
      id: Date.now(),
      authorId: currentUser.id,
      author: currentUser.name,
      avatar: currentUser.avatar,
      image: URL.createObjectURL(file),
      caption: newCaption || "Captured moment.",
      likes: 0,
      isLiked: false,
      comments: [],
      reposts: 0,
      saves: 0,
      isSaved: false,
      isReposted: false,
    };

    setPosts([newPost, ...posts]);
    setNewCaption("");
  };

  const toggleLike = (id) => {
    triggerHaptic(20);
    setPosts(
      posts.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            isLiked: !p.isLiked,
            likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          };
        }
        return p;
      })
    );
  };

  const toggleSave = (id) => {
    triggerHaptic(25);
    setPosts(
      posts.map((p) =>
        p.id === id
          ? {
              ...p,
              isSaved: !p.isSaved,
              saves: p.isSaved ? p.saves - 1 : p.saves + 1,
            }
          : p
      )
    );
  };

  const toggleRepost = (id) => {
    triggerHaptic(25);
    setPosts(
      posts.map((p) =>
        p.id === id
          ? {
              ...p,
              isReposted: !p.isReposted,
              reposts: p.isReposted ? p.reposts - 1 : p.reposts + 1,
            }
          : p
      )
    );
  };

  const handleComment = (id) => {
    const text = commentInputs[id];
    if (!text?.trim()) return;
    triggerHaptic(15);
    setPosts(
      posts.map((p) =>
        p.id === id ? { ...p, comments: [...p.comments, text] } : p
      )
    );
    setCommentInputs({ ...commentInputs, [id]: "" });
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedPosts =
    activeTab === "saved"
      ? posts.filter((p) => p.isSaved)
      : activeTab === "profile" && selectedUserProfile
      ? posts.filter((p) => p.authorId === selectedUserProfile.id)
      : posts;

  const unreadCount = notifications.filter((n) => n.unread).length;
  const isDark = theme === "dark";

  const themeStyles = {
    bg: isDark ? "#090d16" : "#f8fafc",
    text: isDark ? "#f1f5f9" : "#0f172a",
    cardBg: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.85)",
    cardBorder: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
    headerBg: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.8)",
    subText: isDark ? "#94a3b8" : "#64748b",
    inputBg: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
    modalBg: isDark ? "#0f172a" : "#ffffff",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: themeStyles.bg,
        color: themeStyles.text,
        padding: "24px",
        fontFamily: "system-ui, sans-serif",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Keyframe Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-card {
          animation: fadeIn 0.35s ease-out forwards;
        }
        .btn-interact {
          transition: transform 0.1s ease, background-color 0.2s ease, opacity 0.2s ease;
        }
        .btn-interact:active {
          transform: scale(0.95);
        }
      `}</style>

      {/* Mandatory First-Launch Privacy Policy Modal */}
      {!hasAcceptedPrivacy && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: "16px",
          }}
        >
          <div
            className="animate-card"
            style={{
              width: "100%",
              maxWidth: "440px",
              background: themeStyles.modalBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              borderRadius: "24px",
              padding: "28px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "12px",
              }}
            >
              <ShieldAlert
                style={{ width: "40px", height: "40px", color: "#38bdf8" }}
              />
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>
                Terms & Privacy Policy
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  color: themeStyles.subText,
                  lineHeight: 1.6,
                }}
              >
                Welcome to <strong>Aperture</strong>. Before sharing and
                exploring photos, please review and accept our data privacy
                terms.
              </p>
            </div>

            <div
              style={{
                background: themeStyles.inputBg,
                border: `1px solid ${themeStyles.cardBorder}`,
                borderRadius: "16px",
                padding: "14px",
                margin: "20px 0",
                fontSize: "12px",
                color: themeStyles.subText,
                maxHeight: "140px",
                overflowY: "auto",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontWeight: 600,
                  color: "#f87171",
                }}
              >
                • Public Visibility: Any photos, captions, or content you upload
                to Aperture can be viewed by anyone using the app.
              </p>
              <p style={{ margin: "0 0 8px 0" }}>
                • We never sell your personal credentials to third parties.
              </p>
              <p style={{ margin: "0 0 8px 0" }}>
                • Image uploads are published to the global feed for all active
                users.
              </p>
              <p style={{ margin: 0 }}>
                • You can toggle Two-Factor Authentication anytime in your
                account settings.
              </p>
            </div>

            <button
              onClick={handleAcceptPrivacy}
              className="btn-interact"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: "#38bdf8",
                color: "#090d16",
                border: "none",
                borderRadius: "14px",
                padding: "14px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <CheckCircle2 style={{ width: "18px", height: "18px" }} />I Agree
              & Accept Terms
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "16px",
          }}
        >
          <div
            className="animate-card"
            style={{
              width: "100%",
              maxWidth: "400px",
              background: themeStyles.modalBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            <form
              onSubmit={handleSaveProfile}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <Edit3
                  style={{
                    width: "32px",
                    height: "32px",
                    color: "#38bdf8",
                    marginBottom: "8px",
                  }}
                />
                <h3 style={{ margin: 0, fontSize: "18px" }}>Edit Profile</h3>
                <p
                  style={{
                    margin: "4px 0 0 0",
                    fontSize: "12px",
                    color: themeStyles.subText,
                  }}
                >
                  Update your personal details and photo
                </p>
              </div>

              {/* Profile Image Picker */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={editAvatar}
                    alt="Preview"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #38bdf8",
                    }}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="btn-interact"
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      background: "#38bdf8",
                      color: "#090d16",
                      borderRadius: "50%",
                      padding: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Camera style={{ width: "14px", height: "14px" }} />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
                <span style={{ fontSize: "11px", color: themeStyles.subText }}>
                  Click icon to change picture
                </span>
              </div>

              {/* Display Name Input */}
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: themeStyles.subText,
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Username / Display Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    width: "100%",
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.cardBorder}`,
                    borderRadius: "12px",
                    padding: "10px 14px",
                    color: themeStyles.text,
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Handle Input */}
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: themeStyles.subText,
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Handle / ID
                </label>
                <input
                  type="text"
                  required
                  value={editHandle}
                  onChange={(e) => setEditHandle(e.target.value)}
                  style={{
                    width: "100%",
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.cardBorder}`,
                    borderRadius: "12px",
                    padding: "10px 14px",
                    color: themeStyles.text,
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-interact"
                style={{
                  background: "#38bdf8",
                  color: "#090d16",
                  border: "none",
                  borderRadius: "12px",
                  padding: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "14px",
                  marginTop: "8px",
                }}
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic(10);
                  setShowEditProfileModal(false);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: themeStyles.subText,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header
        style={{
          maxWidth: "560px",
          margin: "0 auto 24px auto",
          background: themeStyles.headerBg,
          backdropFilter: "blur(16px)",
          border: `1px solid ${themeStyles.cardBorder}`,
          borderRadius: "24px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: isDark ? "none" : "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
        }}
      >
        <h1
          onClick={() => {
            triggerHaptic(10);
            setActiveTab("feed");
            setSelectedUserProfile(null);
          }}
          className="btn-interact"
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: 300,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <Aperture
            style={{ width: "22px", height: "22px", color: "#38bdf8" }}
          />
          Aperture
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={toggleTheme}
            className="btn-interact"
            style={{
              background: themeStyles.inputBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: themeStyles.text,
            }}
          >
            {isDark ? (
              <Sun
                style={{ width: "18px", height: "18px", color: "#fbbf24" }}
              />
            ) : (
              <Moon
                style={{ width: "18px", height: "18px", color: "#0f172a" }}
              />
            )}
          </button>

          <button
            onClick={() => {
              triggerHaptic(15);
              setShowNotifications(!showNotifications);
              setShowAccountMenu(false);
              setNotifications(
                notifications.map((n) => ({ ...n, unread: false }))
              );
            }}
            className="btn-interact"
            style={{
              position: "relative",
              background: themeStyles.inputBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: themeStyles.text,
            }}
          >
            <Bell style={{ width: "18px", height: "18px" }} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "2px",
                  background: "#ef4444",
                  color: "#fff",
                  fontSize: "10px",
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              triggerHaptic(15);
              setShowAccountMenu(!showAccountMenu);
              setShowNotifications(false);
            }}
            className="btn-interact"
            style={{
              border: "2px solid rgba(56, 189, 248, 0.6)",
              borderRadius: "50%",
              padding: "2px",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
            }}
          >
            <img
              src={currentUser.avatar}
              alt="Profile"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </button>
        </div>
      </header>

      {/* Account Settings Menu */}
      {showAccountMenu && (
        <div
          className="animate-card"
          style={{
            maxWidth: "560px",
            margin: "0 auto 24px auto",
            background: themeStyles.modalBg,
            border: `1px solid ${themeStyles.cardBorder}`,
            borderRadius: "20px",
            padding: "16px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              borderBottom: `1px solid ${themeStyles.cardBorder}`,
              paddingBottom: "8px",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: "14px" }}>
              Account & Security
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={openEditProfileModal}
                className="btn-interact"
                style={{
                  background: themeStyles.inputBg,
                  border: `1px solid ${themeStyles.cardBorder}`,
                  color: themeStyles.text,
                  borderRadius: "12px",
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Edit3 style={{ width: "12px", height: "12px" }} /> Edit Profile
              </button>
              <button
                onClick={() => {
                  triggerHaptic(20);
                  setShowAuthModal(true);
                }}
                className="btn-interact"
                style={{
                  background: "#38bdf8",
                  color: "#090d16",
                  border: "none",
                  borderRadius: "12px",
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Sign In
              </button>
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600 }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: "12px", color: themeStyles.subText }}>
                  {currentUser.handle} • {currentUser.email}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: themeStyles.inputBg,
                padding: "10px 12px",
                borderRadius: "12px",
                border: `1px solid ${themeStyles.cardBorder}`,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <ShieldCheck
                  style={{
                    width: "18px",
                    height: "18px",
                    color: currentUser.is2FAEnabled
                      ? "#34d399"
                      : themeStyles.subText,
                  }}
                />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 500 }}>
                    Two-Factor Authentication
                  </div>
                  <div style={{ fontSize: "11px", color: themeStyles.subText }}>
                    {currentUser.is2FAEnabled
                      ? "2FA Protection Active"
                      : "2FA Disabled"}
                  </div>
                </div>
              </div>
              <button
                onClick={toggle2FAStatus}
                className="btn-interact"
                style={{
                  background: currentUser.is2FAEnabled
                    ? "rgba(239, 68, 68, 0.2)"
                    : "rgba(52, 211, 153, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: currentUser.is2FAEnabled ? "#f87171" : "#34d399",
                  borderRadius: "8px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                {currentUser.is2FAEnabled ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Authentication & 2FA Modal */}
      {showAuthModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "16px",
          }}
        >
          <div
            className="animate-card"
            style={{
              width: "100%",
              maxWidth: "400px",
              background: themeStyles.modalBg,
              border: `1px solid ${themeStyles.cardBorder}`,
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            {authStep === "email" ? (
              <form
                onSubmit={handleEmailSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: "8px" }}>
                  <Aperture
                    style={{
                      width: "36px",
                      height: "36px",
                      color: "#38bdf8",
                      marginBottom: "8px",
                    }}
                  />
                  <h3 style={{ margin: 0, fontSize: "18px" }}>
                    Sign in to Aperture
                  </h3>
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      fontSize: "12px",
                      color: themeStyles.subText,
                    }}
                  >
                    Enter your email and password to continue
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.cardBorder}`,
                    borderRadius: "12px",
                    padding: "10px 14px",
                  }}
                >
                  <Mail
                    style={{
                      width: "18px",
                      height: "18px",
                      color: themeStyles.subText,
                    }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      color: themeStyles.text,
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.cardBorder}`,
                    borderRadius: "12px",
                    padding: "10px 14px",
                  }}
                >
                  <Lock
                    style={{
                      width: "18px",
                      height: "18px",
                      color: themeStyles.subText,
                    }}
                  />
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      color: themeStyles.text,
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-interact"
                  style={{
                    background: "#38bdf8",
                    color: "#090d16",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "14px",
                    marginTop: "8px",
                  }}
                >
                  Continue
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(10);
                    setShowAuthModal(false);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: themeStyles.subText,
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <form
                onSubmit={handleVerify2FA}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <Smartphone
                    style={{
                      width: "32px",
                      height: "32px",
                      color: "#38bdf8",
                      marginBottom: "8px",
                    }}
                  />
                  <h3 style={{ margin: 0, fontSize: "18px" }}>
                    Two-Factor Verification
                  </h3>
                  <p
                    style={{
                      margin: "4px 0 0 0",
                      fontSize: "12px",
                      color: themeStyles.subText,
                    }}
                  >
                    Enter the 6-digit verification code
                  </p>
                </div>

                <input
                  type="text"
                  placeholder="000 000"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  maxLength={6}
                  style={{
                    width: "100%",
                    textAlign: "center",
                    letterSpacing: "4px",
                    fontSize: "20px",
                    padding: "10px",
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.cardBorder}`,
                    borderRadius: "12px",
                    color: themeStyles.text,
                    boxSizing: "border-box",
                  }}
                />

                <button
                  type="submit"
                  className="btn-interact"
                  style={{
                    background: "#38bdf8",
                    color: "#090d16",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Verify & Sign In
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      {showNotifications && (
        <div
          className="animate-card"
          style={{
            maxWidth: "560px",
            margin: "0 auto 24px auto",
            background: themeStyles.modalBg,
            border: `1px solid ${themeStyles.cardBorder}`,
            borderRadius: "20px",
            padding: "16px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              borderBottom: `1px solid ${themeStyles.cardBorder}`,
              paddingBottom: "8px",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: "14px" }}>Activity</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: themeStyles.inputBg,
                  padding: "10px 12px",
                  borderRadius: "12px",
                  fontSize: "13px",
                }}
              >
                <span>{n.text}</span>
                <span style={{ fontSize: "11px", color: themeStyles.subText }}>
                  {n.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto 24px auto",
          display: "flex",
          background: themeStyles.inputBg,
          padding: "4px",
          borderRadius: "16px",
          border: `1px solid ${themeStyles.cardBorder}`,
        }}
      >
        <button
          onClick={() => {
            triggerHaptic(10);
            setActiveTab("feed");
            setSelectedUserProfile(null);
          }}
          className="btn-interact"
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "12px",
            border: "none",
            background:
              activeTab === "feed"
                ? isDark
                  ? "rgba(255, 255, 255, 0.15)"
                  : "rgba(0, 0, 0, 0.1)"
                : "transparent",
            color:
              activeTab === "feed" ? themeStyles.text : themeStyles.subText,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "14px",
          }}
        >
          <Grid style={{ width: "16px", height: "16px" }} /> Feed
        </button>

        <button
          onClick={() => {
            triggerHaptic(10);
            setActiveTab("search");
            setSelectedUserProfile(null);
          }}
          className="btn-interact"
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "12px",
            border: "none",
            background:
              activeTab === "search"
                ? isDark
                  ? "rgba(255, 255, 255, 0.15)"
                  : "rgba(0, 0, 0, 0.1)"
                : "transparent",
            color:
              activeTab === "search" ? themeStyles.text : themeStyles.subText,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "14px",
          }}
        >
          <Search style={{ width: "16px", height: "16px" }} /> Search
        </button>

        <button
          onClick={() => {
            triggerHaptic(10);
            setActiveTab("saved");
            setSelectedUserProfile(null);
          }}
          className="btn-interact"
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "12px",
            border: "none",
            background:
              activeTab === "saved"
                ? isDark
                  ? "rgba(255, 255, 255, 0.15)"
                  : "rgba(0, 0, 0, 0.1)"
                : "transparent",
            color:
              activeTab === "saved" ? themeStyles.text : themeStyles.subText,
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "14px",
          }}
        >
          <Bookmark style={{ width: "16px", height: "16px" }} /> Saved (
          {posts.filter((p) => p.isSaved).length})
        </button>
      </div>

      <main
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* Search View */}
        {activeTab === "search" && (
          <section
            className="animate-card"
            style={{
              background: themeStyles.cardBg,
              backdropFilter: "blur(16px)",
              border: `1px solid ${themeStyles.cardBorder}`,
              borderRadius: "24px",
              padding: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: themeStyles.inputBg,
                border: `1px solid ${themeStyles.cardBorder}`,
                borderRadius: "14px",
                padding: "10px 14px",
                marginBottom: "16px",
              }}
            >
              <Search
                style={{
                  width: "18px",
                  height: "18px",
                  color: themeStyles.subText,
                }}
              />
              <input
                type="text"
                placeholder="Search creators by name or handle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  color: themeStyles.text,
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {filteredUsers.map((userItem) => {
                const isFollowing = currentUser.following.includes(userItem.id);
                const isSelf = currentUser.id === userItem.id;

                return (
                  <div
                    key={userItem.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: themeStyles.inputBg,
                      padding: "12px",
                      borderRadius: "16px",
                      border: `1px solid ${themeStyles.cardBorder}`,
                    }}
                  >
                    <div
                      onClick={() => viewProfile(userItem.id)}
                      className="btn-interact"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={userItem.avatar}
                        alt={userItem.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 600 }}>
                          {userItem.name}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: themeStyles.subText,
                          }}
                        >
                          {userItem.handle} • {userItem.followersCount}{" "}
                          followers
                        </div>
                      </div>
                    </div>

                    {!isSelf && (
                      <button
                        onClick={() => toggleFollow(userItem.id)}
                        className="btn-interact"
                        style={{
                          background: isFollowing
                            ? themeStyles.inputBg
                            : "#38bdf8",
                          color: isFollowing ? themeStyles.text : "#090d16",
                          border: `1px solid ${themeStyles.cardBorder}`,
                          borderRadius: "14px",
                          padding: "6px 14px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {isFollowing ? (
                          <UserCheck
                            style={{ width: "14px", height: "14px" }}
                          />
                        ) : (
                          <UserPlus style={{ width: "14px", height: "14px" }} />
                        )}
                        <span>{isFollowing ? "Following" : "Follow"}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Profile Header View */}
        {activeTab === "profile" && selectedUserProfile && (
          <section
            className="animate-card"
            style={{
              background: themeStyles.cardBg,
              backdropFilter: "blur(16px)",
              border: `1px solid ${themeStyles.cardBorder}`,
              borderRadius: "24px",
              padding: "20px",
            }}
          >
            <button
              onClick={() => {
                triggerHaptic(10);
                setActiveTab("feed");
              }}
              className="btn-interact"
              style={{
                background: "transparent",
                border: "none",
                color: themeStyles.subText,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                cursor: "pointer",
                marginBottom: "16px",
              }}
            >
              <ArrowLeft style={{ width: "16px", height: "16px" }} /> Back to
              Feed
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <img
                  src={selectedUserProfile.avatar}
                  alt={selectedUserProfile.name}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #38bdf8",
                  }}
                />
                <div>
                  <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
                    {selectedUserProfile.name}
                  </h2>
                  <div style={{ fontSize: "13px", color: "#38bdf8" }}>
                    {selectedUserProfile.handle}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: themeStyles.subText,
                      marginTop: "2px",
                    }}
                  >
                    {selectedUserProfile.followersCount} Followers
                  </div>
                </div>
              </div>

              {currentUser.id === selectedUserProfile.id ? (
                <button
                  onClick={openEditProfileModal}
                  className="btn-interact"
                  style={{
                    background: themeStyles.inputBg,
                    border: `1px solid ${themeStyles.cardBorder}`,
                    color: themeStyles.text,
                    borderRadius: "16px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Edit3 style={{ width: "14px", height: "14px" }} /> Edit
                </button>
              ) : (
                <button
                  onClick={() => toggleFollow(selectedUserProfile.id)}
                  className="btn-interact"
                  style={{
                    background: currentUser.following.includes(
                      selectedUserProfile.id
                    )
                      ? themeStyles.inputBg
                      : "#38bdf8",
                    color: currentUser.following.includes(
                      selectedUserProfile.id
                    )
                      ? themeStyles.text
                      : "#090d16",
                    border: `1px solid ${themeStyles.cardBorder}`,
                    borderRadius: "16px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {currentUser.following.includes(selectedUserProfile.id)
                    ? "Following"
                    : "Follow"}
                </button>
              )}
            </div>
          </section>
        )}

        {/* Photo Upload Area */}
        {activeTab === "feed" && (
          <section
            className="animate-card"
            style={{
              background: themeStyles.cardBg,
              backdropFilter: "blur(16px)",
              border: `1px solid ${themeStyles.cardBorder}`,
              borderRadius: "24px",
              padding: "20px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <input
                type="text"
                placeholder="Add a photo description or caption..."
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                style={{
                  width: "100%",
                  background: themeStyles.inputBg,
                  border: `1px solid ${themeStyles.cardBorder}`,
                  borderRadius: "14px",
                  padding: "10px 14px",
                  color: themeStyles.text,
                  boxSizing: "border-box",
                }}
              />

              <label
                className="btn-interact"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "12px",
                  background: isDark ? "#ffffff" : "#0f172a",
                  color: isDark ? "#000000" : "#ffffff",
                  borderRadius: "14px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                <Upload style={{ width: "18px", height: "18px" }} />
                <span>Upload photo from device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </section>
        )}

        {/* Feed Posts */}
        {displayedPosts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 0",
              color: themeStyles.subText,
            }}
          >
            <p>No photos found in this view.</p>
          </div>
        ) : (
          displayedPosts.map((post) => {
            const isFollowing = currentUser.following.includes(post.authorId);
            const isSelf = currentUser.id === post.authorId;

            return (
              <article
                key={post.id}
                className="animate-card"
                style={{
                  background: themeStyles.cardBg,
                  backdropFilter: "blur(16px)",
                  border: `1px solid ${themeStyles.cardBorder}`,
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: isDark
                    ? "none"
                    : "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div
                  style={{
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: `1px solid ${themeStyles.cardBorder}`,
                  }}
                >
                  <div
                    onClick={() => viewProfile(post.authorId)}
                    className="btn-interact"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={post.avatar}
                      alt={post.author}
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>
                      {post.author}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {!isSelf && (
                      <button
                        onClick={() => toggleFollow(post.authorId)}
                        className="btn-interact"
                        style={{
                          background: isFollowing
                            ? themeStyles.inputBg
                            : "#38bdf8",
                          color: isFollowing ? themeStyles.text : "#090d16",
                          border: `1px solid ${themeStyles.cardBorder}`,
                          borderRadius: "16px",
                          padding: "6px 12px",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {isFollowing ? (
                          <UserCheck
                            style={{ width: "14px", height: "14px" }}
                          />
                        ) : (
                          <UserPlus style={{ width: "14px", height: "14px" }} />
                        )}
                        <span>{isFollowing ? "Following" : "Follow"}</span>
                      </button>
                    )}
                  </div>
                </div>

                <div style={{ background: "#000" }}>
                  <img
                    src={post.image}
                    alt={post.caption}
                    style={{
                      width: "100%",
                      height: "380px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>

                <div
                  style={{
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      {/* Like Action */}
                      <button
                        onClick={() => toggleLike(post.id)}
                        className="btn-interact"
                        style={{
                          background: post.isLiked
                            ? "rgba(244, 63, 94, 0.2)"
                            : themeStyles.inputBg,
                          border: `1px solid ${themeStyles.cardBorder}`,
                          color: post.isLiked ? "#f43f5e" : themeStyles.subText,
                          borderRadius: "20px",
                          padding: "8px 14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        <Heart
                          style={{
                            width: "16px",
                            height: "16px",
                            fill: post.isLiked ? "#f43f5e" : "none",
                          }}
                        />
                        <span>{post.likes}</span>
                      </button>

                      {/* Repost Action */}
                      <button
                        onClick={() => toggleRepost(post.id)}
                        className="btn-interact"
                        style={{
                          background: post.isReposted
                            ? "rgba(16, 185, 129, 0.2)"
                            : themeStyles.inputBg,
                          border: `1px solid ${themeStyles.cardBorder}`,
                          color: post.isReposted
                            ? "#34d399"
                            : themeStyles.subText,
                          borderRadius: "20px",
                          padding: "8px 14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        <Repeat style={{ width: "16px", height: "16px" }} />
                        <span>{post.reposts}</span>
                      </button>

                      {/* Save Action */}
                      <button
                        onClick={() => toggleSave(post.id)}
                        className="btn-interact"
                        style={{
                          background: post.isSaved
                            ? "rgba(56, 189, 248, 0.2)"
                            : themeStyles.inputBg,
                          border: `1px solid ${themeStyles.cardBorder}`,
                          color: post.isSaved ? "#38bdf8" : themeStyles.subText,
                          borderRadius: "20px",
                          padding: "8px 14px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        <Bookmark
                          style={{
                            width: "16px",
                            height: "16px",
                            fill: post.isSaved ? "#38bdf8" : "none",
                          }}
                        />
                        <span>{post.saves}</span>
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      background: themeStyles.inputBg,
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: `1px solid ${themeStyles.cardBorder}`,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        color: themeStyles.text,
                        fontWeight: 300,
                        lineHeight: 1.5,
                      }}
                    >
                      <strong
                        style={{
                          fontWeight: 600,
                          color: themeStyles.text,
                          marginRight: "8px",
                        }}
                      >
                        {post.author}
                      </strong>
                      {post.caption}
                    </p>
                  </div>

                  <div
                    style={{
                      borderTop: `1px solid ${themeStyles.cardBorder}`,
                      paddingTop: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {post.comments.map((c, i) => (
                      <p
                        key={i}
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          color: themeStyles.subText,
                        }}
                      >
                        <strong
                          style={{
                            color: themeStyles.text,
                            marginRight: "6px",
                          }}
                        >
                          {currentUser.handle}
                        </strong>
                        {c}
                      </p>
                    ))}

                    <div
                      style={{ display: "flex", gap: "8px", paddingTop: "8px" }}
                    >
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs({
                            ...commentInputs,
                            [post.id]: e.target.value,
                          })
                        }
                        style={{
                          flexGrow: 1,
                          background: themeStyles.inputBg,
                          border: `1px solid ${themeStyles.cardBorder}`,
                          borderRadius: "12px",
                          padding: "6px 12px",
                          fontSize: "12px",
                          color: themeStyles.text,
                        }}
                      />
                      <button
                        onClick={() => handleComment(post.id)}
                        className="btn-interact"
                        style={{
                          background: themeStyles.inputBg,
                          border: `1px solid ${themeStyles.cardBorder}`,
                          borderRadius: "12px",
                          padding: "6px 12px",
                          cursor: "pointer",
                        }}
                      >
                        <Send
                          style={{
                            width: "14px",
                            height: "14px",
                            color: themeStyles.text,
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </main>
    </div>
  );
}
