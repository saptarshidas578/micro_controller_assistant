import { db, isMockMode } from './firebase';
import { 
  collection, doc, getDoc, getDocs, 
  query, where, setDoc, updateDoc, deleteDoc 
} from 'firebase/firestore';
import { Project } from '../types';

// Helper to generate IDs
const generateUUID = () => {
  return 'proj_' + Math.random().toString(36).substr(2, 9);
};

// ==========================================
// 1. READ / WRITE ACTIONS
// ==========================================

export const fetchUserProjects = async (userId: string): Promise<Project[]> => {
  if (isMockMode) {
    const raw = localStorage.getItem(`user_projects_${userId}`);
    return raw ? JSON.parse(raw) : [];
  }

  try {
    const q = query(collection(db, 'projects'), where('ownerId', '==', userId));
    const snap = await getDocs(q);
    const projects: Project[] = [];
    snap.forEach((doc) => {
      projects.push(doc.data() as Project);
    });
    return projects;
  } catch (error) {
    console.error("Error fetching projects from Firestore:", error);
    return [];
  }
};

export const fetchProjectById = async (projectId: string): Promise<Project | null> => {
  if (isMockMode) {
    // Search across all local users for demo simplicity
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('user_projects_')) {
        const list: Project[] = JSON.parse(localStorage.getItem(key) || '[]');
        const found = list.find(p => p.id === projectId);
        if (found) return found;
      }
    }
    return null;
  }

  try {
    const docRef = doc(db, 'projects', projectId);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as Project) : null;
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    return null;
  }
};

export const saveProjectDraft = async (userId: string, ownerName: string, project: Omit<Project, 'id' | 'ownerId' | 'ownerName' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
  const newProject: Project = {
    ...project,
    id: generateUUID(),
    ownerId: userId,
    ownerName: ownerName,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (isMockMode) {
    const list = await fetchUserProjects(userId);
    const updatedList = [newProject, ...list];
    localStorage.setItem(`user_projects_${userId}`, JSON.stringify(updatedList));
    return newProject;
  }

  try {
    const docRef = doc(db, 'projects', newProject.id);
    await setDoc(docRef, newProject);
  } catch (error) {
    console.error("Error saving project draft to Firestore:", error);
  }
  return newProject;
};

export const updateProjectDraft = async (projectId: string, updates: Partial<Project>): Promise<Project | null> => {
  const existing = await fetchProjectById(projectId);
  if (!existing) return null;

  const updatedProject: Project = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  if (isMockMode) {
    const userId = existing.ownerId;
    const list = await fetchUserProjects(userId);
    const updatedList = list.map(p => p.id === projectId ? updatedProject : p);
    localStorage.setItem(`user_projects_${userId}`, JSON.stringify(updatedList));
    return updatedProject;
  }

  try {
    const docRef = doc(db, 'projects', projectId);
    await updateDoc(docRef, updates as any);
  } catch (error) {
    console.error("Error updating project in Firestore:", error);
  }
  return updatedProject;
};

export const deleteProjectDraft = async (projectId: string): Promise<boolean> => {
  const existing = await fetchProjectById(projectId);
  if (!existing) return false;

  if (isMockMode) {
    const userId = existing.ownerId;
    const list = await fetchUserProjects(userId);
    const updatedList = list.filter(p => p.id !== projectId);
    localStorage.setItem(`user_projects_${userId}`, JSON.stringify(updatedList));
    return true;
  }

  try {
    const docRef = doc(db, 'projects', projectId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting project in Firestore:", error);
    return false;
  }
};

export const duplicateProjectDraft = async (userId: string, projectId: string): Promise<Project | null> => {
  const existing = await fetchProjectById(projectId);
  if (!existing) return null;

  const duplicated: Project = {
    ...existing,
    id: generateUUID(),
    title: `${existing.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (isMockMode) {
    const list = await fetchUserProjects(userId);
    const updatedList = [duplicated, ...list];
    localStorage.setItem(`user_projects_${userId}`, JSON.stringify(updatedList));
    return duplicated;
  }

  try {
    const docRef = doc(db, 'projects', duplicated.id);
    await setDoc(docRef, duplicated);
    return duplicated;
  } catch (error) {
    console.error("Error duplicating project in Firestore:", error);
    return null;
  }
};
