import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { EmailResetData } from "../../form-models/emailResetData";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateEmail,
} from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export const EmailResetForm = () => {
  const [user] = useAuthState(auth);

  const schema = yup.object().shape({
    currentEmail: yup
      .string()
      .required("You must enter your current email address.")
      .email("It must be an email address."),
    newEmail: yup
      .string()
      .required("You must enter a new email address.")
      .email("It must be an email address."),
    password: yup.string().required("You must enter your password."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailResetData>({
    resolver: yupResolver(schema),
  });

  const handleEmailReset = async (data: EmailResetData) => {
    if (!user) {
      return;
    }

    const credential = await signInWithEmailAndPassword(
      auth,
      data.currentEmail,
      data.password
    );

    await updateEmail(credential.user, data.newEmail);

    await sendEmailVerification(credential.user);
  };

  return (
    <div>
      <h2>Reset Email</h2>
      <form onSubmit={handleSubmit(handleEmailReset)}>
        <div>
          <label htmlFor="email">Current Email</label>
          <div>Enter your current email address.</div>
          {errors?.currentEmail && (
            <div style={{ color: "red" }}>{errors.currentEmail.message}</div>
          )}
          <input type="text" id="email" {...register("currentEmail")} />
        </div>
        <div>
          <label htmlFor="new-email">New Email</label>
          <div>Enter your new email address.</div>
          {errors?.newEmail && (
            <div style={{ color: "red" }}>{errors.newEmail.message}</div>
          )}
          <input type="text" id="new-email" {...register("newEmail")} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <div>Enter your password.</div>
          {errors?.password && (
            <div style={{ color: "red" }}>{errors.password.message}</div>
          )}
          <input type="password" id="password" {...register("password")} />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};
