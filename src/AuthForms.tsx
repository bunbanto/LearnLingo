import { yupResolver } from "@hookform/resolvers/yup";
import type { User } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "./config";

type FormProps = {
  onSuccess: () => void;
};

type LoginValues = {
  email: string;
  password: string;
};

type RegisterValues = LoginValues & {
  name: string;
};

const loginSchema: yup.ObjectSchema<LoginValues> = yup.object({
  email: yup.string().trim().email("Enter a valid email").required("Required"),
  password: yup.string().min(6, "Min 6 characters").required("Required"),
});

const registerSchema: yup.ObjectSchema<RegisterValues> = yup.object({
  name: yup.string().trim().min(2, "Min 2 characters").required("Required"),
  email: yup.string().trim().email("Enter a valid email").required("Required"),
  password: yup.string().min(6, "Min 6 characters").required("Required"),
});

export const LoginForm = ({ onSuccess }: FormProps) => {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(
        auth,
        values.email.trim(),
        values.password,
      );
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="auth-title">Log In</h2>
      <p className="auth-text">
        Welcome back. Enter your credentials to continue learning.
      </p>

      <label className="auth-label">
        Email
        <input className="auth-input" type="email" {...register("email")} />
        {errors.email && <span>{errors.email.message}</span>}
      </label>

      <label className="auth-label">
        Password
        <input
          className="auth-input"
          type="password"
          {...register("password")}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </label>

      {error && <div className="auth-error">{error}</div>}

      <button className="auth-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
};

export const RegisterForm = ({ onSuccess }: FormProps) => {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: RegisterValues) => {
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        values.email.trim(),
        values.password,
      );
      const user: User | null = result.user;
      if (user) {
        await updateProfile(user, { displayName: values.name.trim() });
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="auth-title">Registration</h2>
      <p className="auth-text">
        Create an account to save favorite teachers and book trial lessons.
      </p>

      <label className="auth-label">
        Name
        <input className="auth-input" type="text" {...register("name")} />
        {errors.name && <span>{errors.name.message}</span>}
      </label>

      <label className="auth-label">
        Email
        <input className="auth-input" type="email" {...register("email")} />
        {errors.email && <span>{errors.email.message}</span>}
      </label>

      <label className="auth-label">
        Password
        <input
          className="auth-input"
          type="password"
          {...register("password")}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </label>

      {error && <div className="auth-error">{error}</div>}

      <button className="auth-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Sign up"}
      </button>
    </form>
  );
};
