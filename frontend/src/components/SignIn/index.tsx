import { PROVIDERS_IDS, auth, getProvider } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import googleIcon from '../../assets/icons/google.svg'

export function SignIn() {
  const signInWithGoogle = () => {
    signInWithPopup(auth, getProvider(PROVIDERS_IDS.GOOGLE));
  }
  return (
    <div>
      <button
        onClick={signInWithGoogle}
      >
        <img src={googleIcon} height={16} />
        Entrar com Google
      </button>
    </div>
  );
}