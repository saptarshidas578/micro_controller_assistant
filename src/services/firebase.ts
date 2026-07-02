import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if config values exist
const hasValidConfig =
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
  firebaseConfig.projectId;

let app;
let auth: any = null;
let db: any = null;
let isMockMode = false;

if (hasValidConfig) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.warn("Firebase initialization failed. Falling back to local mock mode.", error);
    isMockMode = true;
  }
} else {
  console.info("Missing Firebase environment variables. App is running in Local Demo Mode (LocalStorage-backed).");
  isMockMode = true;
}

export { auth, db, isMockMode };

// --- GOOGLE AUTHENTICATION MOCK / REAL CLIENTS ---
export const signInWithGoogle = async () => {
  if (isMockMode) {
    // Simulate local sign in
    const mockUser = {
      uid: "mock_user_123",
      displayName: "Mock Engineer",
      email: "engineer@local.demo",
      photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=mock_engineer",
    };
    localStorage.setItem("mock_user", JSON.stringify(mockUser));
    
    // Auto profile setup in localStorage mock
    const profile = {
      uid: mockUser.uid,
      displayName: mockUser.displayName,
      email: mockUser.email,
      photoURL: mockUser.photoURL,
      reputationScore: 100,
      createdAt: new Date().toISOString(),
      isAdmin: true, // Allow accessing admin panel in demo
    };
    localStorage.setItem(`user_profile_${mockUser.uid}`, JSON.stringify(profile));
    
    return mockUser;
  }

  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  
  // Auto profile setup in Firestore
  const user = result.user;
  const userDocRef = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userDocRef);
  
  if (!userSnapshot.exists()) {
    await setDoc(userDocRef, {
      uid: user.uid,
      displayName: user.displayName || "Unknown Engineer",
      email: user.email || "",
      photoURL: user.photoURL || "",
      reputationScore: 0,
      createdAt: new Date().toISOString(),
      isAdmin: false,
    });
  }

  return user;
};

export const logoutUser = async () => {
  if (isMockMode) {
    localStorage.removeItem("mock_user");
    return;
  }
  await signOut(auth);
};

// --- MOCK DATABASE HELPER APIS ---
export const getProfile = async (uid: string) => {
  if (isMockMode) {
    const raw = localStorage.getItem(`user_profile_${uid}`);
    return raw ? JSON.parse(raw) : null;
  }
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};
