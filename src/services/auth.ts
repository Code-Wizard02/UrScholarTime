import { auth } from "./../firebase";
import { signOut, onAuthStateChanged, User } from "firebase/auth";

export const logout = async () => {
  await signOut(auth);
};

export const onUserStateChanged = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
