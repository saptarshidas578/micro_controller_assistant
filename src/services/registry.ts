import { db, isMockMode } from './firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { 
  allBoards, allComponents, allLibraries, 
  seedManufacturers, seedProtocols, allCategories 
} from '../utils/registrySeedData';
import { BoardSpec, ComponentSpec, Library, Manufacturer, ProtocolSpec } from '../types';

// ==========================================
// 1. DATA ACCESSORS (READ ONLY)
// ==========================================

export const fetchBoards = async (): Promise<BoardSpec[]> => {
  // Currently serving local data as primary seed. If in live Firebase, can fetch from Firestore.
  return allBoards;
};

export const fetchBoardById = async (id: string): Promise<BoardSpec | null> => {
  const board = allBoards.find(b => b.id === id);
  return board || null;
};

export const fetchComponents = async (): Promise<ComponentSpec[]> => {
  return allComponents;
};

export const fetchComponentById = async (id: string): Promise<ComponentSpec | null> => {
  const component = allComponents.find(c => c.id === id);
  return component || null;
};

export const fetchLibraries = async (): Promise<Library[]> => {
  return allLibraries;
};

export const fetchManufacturers = async (): Promise<Manufacturer[]> => {
  return seedManufacturers;
};

export const fetchProtocols = async (): Promise<ProtocolSpec[]> => {
  return seedProtocols;
};

export const fetchCategories = async (): Promise<string[]> => {
  return allCategories;
};

// ==========================================
// 2. USER BOOKMARKS & RECENTLY VIEWED (READ & WRITE)
// ==========================================

interface UserActivityRecord {
  bookmarks: string[]; // List of board or component IDs
  recentlyViewed: string[]; // List of recently viewed IDs
}

const DEFAULT_ACTIVITY: UserActivityRecord = { bookmarks: [], recentlyViewed: [] };

export const fetchUserActivity = async (userId: string): Promise<UserActivityRecord> => {
  if (isMockMode) {
    const raw = localStorage.getItem(`user_activity_${userId}`);
    return raw ? JSON.parse(raw) : DEFAULT_ACTIVITY;
  }

  try {
    const docRef = doc(db, 'user_activity', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserActivityRecord;
    } else {
      await setDoc(docRef, DEFAULT_ACTIVITY);
      return DEFAULT_ACTIVITY;
    }
  } catch (error) {
    console.error("Error fetching user activity from Firestore:", error);
    return DEFAULT_ACTIVITY;
  }
};

export const toggleBookmark = async (userId: string, itemId: string): Promise<string[]> => {
  const activity = await fetchUserActivity(userId);
  const isBookmarked = activity.bookmarks.includes(itemId);
  const updatedBookmarks = isBookmarked 
    ? activity.bookmarks.filter(id => id !== itemId)
    : [...activity.bookmarks, itemId];

  if (isMockMode) {
    const updated = { ...activity, bookmarks: updatedBookmarks };
    localStorage.setItem(`user_activity_${userId}`, JSON.stringify(updated));
    return updatedBookmarks;
  }

  try {
    const docRef = doc(db, 'user_activity', userId);
    await updateDoc(docRef, {
      bookmarks: isBookmarked ? arrayRemove(itemId) : arrayUnion(itemId)
    });
  } catch (error) {
    console.error("Error toggling bookmark in Firestore:", error);
  }
  return updatedBookmarks;
};

export const addRecentlyViewed = async (userId: string, itemId: string): Promise<string[]> => {
  const activity = await fetchUserActivity(userId);
  // Remove duplicate and append to front (max 10 items)
  const filtered = activity.recentlyViewed.filter(id => id !== itemId);
  const updatedRecently = [itemId, ...filtered].slice(0, 10);

  if (isMockMode) {
    const updated = { ...activity, recentlyViewed: updatedRecently };
    localStorage.setItem(`user_activity_${userId}`, JSON.stringify(updated));
    return updatedRecently;
  }

  try {
    const docRef = doc(db, 'user_activity', userId);
    await updateDoc(docRef, {
      recentlyViewed: updatedRecently
    });
  } catch (error) {
    console.error("Error updating recently viewed in Firestore:", error);
  }
  return updatedRecently;
};
