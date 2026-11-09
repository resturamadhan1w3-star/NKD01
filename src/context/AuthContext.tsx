import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { AdminUser } from '../types/index.ts';

interface AuthContextType {
  user: FirebaseUser | null;
  guestId: string;
  isAgeVerified: boolean;
  verifyAge: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  userSignOut: () => Promise<void>;
  
  // Admin Auth
  admin: AdminUser | null;
  adminToken: string | null;
  adminLogin: (token: string, adminData: AdminUser) => void;
  adminLogout: () => void;
  updateAdminPasswordStatus: (mustChange: boolean, newToken?: string) => void;
  isAdminAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [guestId, setGuestId] = useState<string>('');
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(true); // will be checked on mount
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // Initialize Guest ID and Age Gate
  useEffect(() => {
    let gid = localStorage.getItem('ndk_guest_id');
    if (!gid) {
      gid = 'guest_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('ndk_guest_id', gid);
    }
    setGuestId(gid);

    const verified = localStorage.getItem('ndk_age_verified');
    setIsAgeVerified(verified === 'true');

    // Admin token restore
    const savedToken = localStorage.getItem('ndk_admin_token');
    const savedAdmin = localStorage.getItem('ndk_admin_data');
    if (savedToken && savedAdmin) {
      try {
        setAdminToken(savedToken);
        setAdmin(JSON.parse(savedAdmin));
        // Verify with server in background
        fetch('/api/admin/me', {
          headers: { Authorization: `Bearer ${savedToken}` },
        })
          .then((res) => {
            if (!res.ok) {
              adminLogout();
            }
          })
          .catch(() => {});
      } catch {
        adminLogout();
      }
    }

    // Firebase Auth Listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const verifyAge = async () => {
    try {
      localStorage.setItem('ndk_age_verified', 'true');
      setIsAgeVerified(true);
      await fetch('/api/public/verify-age', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: guestId }),
      });
    } catch (err) {
      console.error('Age verification error:', err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      // If popup was blocked or failed, alert user gracefully
      throw err;
    }
  };

  const userSignOut = async () => {
    try {
      await fbSignOut(auth);
      setUser(null);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  const adminLogin = (token: string, adminData: AdminUser) => {
    setAdminToken(token);
    setAdmin(adminData);
    localStorage.setItem('ndk_admin_token', token);
    localStorage.setItem('ndk_admin_data', JSON.stringify(adminData));
  };

  const adminLogout = () => {
    setAdminToken(null);
    setAdmin(null);
    localStorage.removeItem('ndk_admin_token');
    localStorage.removeItem('ndk_admin_data');
  };

  const updateAdminPasswordStatus = (mustChange: boolean, newToken?: string) => {
    if (admin) {
      const updated = { ...admin, mustChangePassword: mustChange };
      setAdmin(updated);
      localStorage.setItem('ndk_admin_data', JSON.stringify(updated));
    }
    if (newToken) {
      setAdminToken(newToken);
      localStorage.setItem('ndk_admin_token', newToken);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        guestId: user ? user.uid : guestId,
        isAgeVerified,
        verifyAge,
        signInWithGoogle,
        userSignOut,
        admin,
        adminToken,
        adminLogin,
        adminLogout,
        updateAdminPasswordStatus,
        isAdminAuthenticated: !!adminToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
