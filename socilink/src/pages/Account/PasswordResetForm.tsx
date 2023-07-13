import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export const PasswordResetForm = () => {
  const [user] = useAuthState(auth);

  const handlePasswordReset = async () => {
    if (!user) {
      return;
    }

    console.log(user.email);
    await sendPasswordResetEmail(auth, user.email as string);
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <div>
        <label htmlFor="current-email">Forgot your password?</label>
        <div>Reset your password here by clicking the button.</div>
        <button onClick={handlePasswordReset}>Send Reset Email</button>
      </div>
    </div>
  );
};
