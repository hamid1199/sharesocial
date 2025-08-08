import React, { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";

type Mode = "signin" | "signup";

const AuthForm: React.FC = () => {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xs mx-auto mt-10 bg-white rounded-xl shadow p-6 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-center mb-2">{mode === "signin" ? "Sign In" : "Sign Up"}</h2>
      <Button variant="outline" onClick={handleGoogle} disabled={loading} className="flex items-center gap-2 justify-center">
        <FcGoogle className="w-5 h-5" />
        Continue with Google
      </Button>
      <form className="flex flex-col gap-2" onSubmit={handleEmailAuth}>
        <Input
          type="email"
          placeholder="Email"
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <Input
          type="password"
          placeholder="Password"
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </Button>
      </form>
      <div className="text-center text-sm">
        {mode === "signin" ? (
          <>
            Don't have an account?{" "}
            <button className="text-blue-600 hover:underline" onClick={() => setMode("signup")}>Sign Up</button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button className="text-blue-600 hover:underline" onClick={() => setMode("signin")}>Sign In</button>
          </>
        )}
      </div>
      {error && <div className="text-red-500 text-xs text-center">{error}</div>}
    </div>
  );
};

export default AuthForm;