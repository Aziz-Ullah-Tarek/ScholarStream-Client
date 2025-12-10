import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import axios from 'axios';
import { auth } from '../firebase/firebase.config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('student');
  const [loading, setLoading] = useState(true);

  // Save user to MongoDB
  const saveUserToDatabase = async (user) => {
    try {
      await axios.post('http://localhost:5000/api/users', {
        email: user.email,
        name: user.displayName || 'Anonymous',
        photoURL: user.photoURL || '',
        role: 'student', // Default role
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error saving user to database:', error);
    }
  };

  // Get user role from MongoDB
  const getUserRole = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/check-role/${email}`);
      setUserRole(response.data.role || 'student');
      return response.data.role;
    } catch (error) {
      console.error('Error getting user role:', error);
      setUserRole('student');
      return 'student';
    }
  };

  // Register with Email & Password
  const registerUser = async (email, password, name, photoURL) => {
    setLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: name,
      photoURL: photoURL
    });
    return userCredential;
  };

  // Login with Email & Password
  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Login
  const googleLogin = () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  // Logout
  const logoutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  // Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Save user to database if not exists
        await saveUserToDatabase(currentUser);
        // Get user role
        await getUserRole(currentUser.email);
      } else {
        setUserRole('student');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    userRole,
    loading,
    registerUser,
    loginUser,
    googleLogin,
    logoutUser,
    getUserRole
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};
