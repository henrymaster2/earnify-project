import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Signup() {
  const router = useRouter();
  const [referrerId, setReferrerId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const ref = router.query.ref;
    if (ref && !Array.isArray(ref)) {
      setReferrerId(parseInt(ref, 10));
    }
  }, [router.query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("/api/signup", {
        ...form,
        referrerId,
      });

      if (res.status === 200) {
        setSuccess("Signup successful! Redirecting...");
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-blue-950 via-slate-900 to-blue-900 text-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-white/10 text-white rounded-md placeholder-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-white/10 text-white rounded-md placeholder-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-white/10 text-white rounded-md placeholder-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition rounded-md font-semibold text-white"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Log in here
          </Link>
        </p>
        {referrerId && (
          <p className="text-center text-green-300 text-sm mt-2">
            You were referred by user ID <strong>{referrerId}</strong>
          </p>
        )}
      </div>
    </main>
  );
}
