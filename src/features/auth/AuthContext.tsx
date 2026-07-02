import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, isMockMode, signInWithGoogle, logoutUser, getProfile } from '../../services/firebase';
import { UserProfile } from '../../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndSetUser = async (uid: string, authUser: any) => {
    try {
      const profile = await getProfile(uid);
      if (profile) {
        setUser(profile as UserProfile);
      } else {
        // Fallback profile if Firestore fetching fails or document is not created yet
        setUser({
          uid,
          displayName: authUser.displayName || "Unknown Engineer",
          photoURL: authUser.photoURL || "https://api.dicebear.com/7.x/bottts/svg?seed=" + uid,
          email: authUser.email || "",
          reputationScore: 0,
          createdAt: new Date().toISOString(),
          isAdmin: false
        });
      }
    } catch (err) {
      console.error("Error setting user profile context:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMockMode) {
      const stored = localStorage.getItem("mock_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        fetchProfileAndSetUser(parsed.uid, parsed);
      } else {
        setUser(null);
        setLoading(false);
      }
      return;
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        await fetchProfileAndSetUser(firebaseUser.uid, firebaseUser);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      const authUser = await signInWithGoogle();
      await fetchProfileAndSetUser(authUser.uid, authUser);
    } catch (err) {
      console.error("Login failed:", err);
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = !!(user && user.isAdmin);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
