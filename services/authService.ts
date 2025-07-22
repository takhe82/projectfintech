import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User } from '../types';

export const signUp = async (email: string, password: string, role: 'client' | 'merchant', displayName?: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const user: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      role,
      walletBalance: 0,
      createdAt: new Date(),
      displayName
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), user);
    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    const userData = userDoc.data() as User;
    // Convert Firestore timestamp to Date if needed
    if (userData.createdAt && typeof userData.createdAt !== 'object') {
      userData.createdAt = new Date(userData.createdAt);
    }
    return userData;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) return null;

    const userData = userDoc.data() as User;
    // Convert Firestore timestamp to Date if needed
    if (userData.createdAt && typeof userData.createdAt !== 'object') {
      userData.createdAt = new Date(userData.createdAt);
    }
    return userData;
  } catch (error) {
    return null;
  }
};