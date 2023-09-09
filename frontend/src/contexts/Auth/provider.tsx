import { useAuthState } from "react-firebase-hooks/auth";
import { AuthContext } from "./context";
import { PROVIDERS_IDS, auth, firestore, getProvider } from "../../config/firebase";
import { User, signInWithPopup } from "firebase/auth";
import { useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";



interface AuthContextProviderProps {
  children: React.ReactNode;
}


export function AuthContextProvider({children}:AuthContextProviderProps) {

  const [user,loading] = useAuthState(auth);

  const pingUser = async (user:User) => {
    const userRef = doc(firestore, 'users', user.uid)
    const userSnap = await getDoc(userRef)
    if(!userSnap.exists()){
      await setDoc(doc(firestore, 'users',user.uid),{
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        avatarUrl: user.photoURL,
        lastOnline: new Date(),
      })
    } else {
      await updateDoc(userRef,{
        lastOnline: new Date(),
      })
    }
  }

  useEffect(()=>{
    let pingInterval:NodeJS.Timeout;
    if(user){
      pingUser(user)
      pingInterval = setInterval(()=>{
        pingUser(user)
      }, 60 * 1000)
    }
    return () => {
      if(pingInterval) clearInterval(pingInterval)
    }
  },[user])

  const signIn = async () => {
    const user = await signInWithPopup(auth, getProvider(PROVIDERS_IDS.GOOGLE));
    return user
  }

  const signOut = async () => {
    if(!user) return;
    const userRef = doc(firestore, 'users', user.uid)
    const userSnap = await getDoc(userRef)
    if(userSnap.exists()){
      await updateDoc(userRef,{
        online: false
      })
    }
    await auth.signOut();
  }

  return (
    <AuthContext.Provider value={{
      user,
      signIn,
      signOut,
      isAuthenticating:loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}