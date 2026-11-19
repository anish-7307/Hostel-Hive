import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiRequest } from "../../lib/api";
import { useNavigate } from "react-router-dom";

function AuthPlaceholder() {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegister = location.pathname === "/register";
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());

    try {
      const result = await apiRequest("/auth/register", {
        method: "POST",
        auth: false,
        body,
      });
      setSuccess(result.message || "Registration successful. Sign in to continue.");
      event.currentTarget.reset();
      window.setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3E8D0] p-6">
      {isRegister ? (
        <form onSubmit={handleRegister} className="w-full max-w-2xl rounded-[32px] border border-[#E3CFAD] bg-[#FFF9EF] p-7 shadow-[0_25px_70px_rgba(90,23,37,0.15)] sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C69C5A]">Hostel Hive</p>
          <h1 className="mt-2 text-3xl font-bold text-[#5A1725]">Student Registration</h1>
          <p className="mt-2 text-sm text-[#604B4F]">Create a student account to submit and track hostel requests.</p>
          {error && <div role="alert" className="mt-5 rounded-2xl bg-[#FBEAEA] px-4 py-3 text-sm text-[#9B2C2C]">{error}</div>}
          {success && <div role="status" className="mt-5 rounded-2xl bg-[#EAF3ED] px-4 py-3 text-sm text-[#28644B]">{success}</div>}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <FormField label="Full name" name="fullName" required />
            <FormField label="Student ID" name="studentId" />
            <FormField label="Email" name="email" type="email" required />
            <FormField label="Phone number" name="phone" type="tel" required />
            <FormField label="Emergency contact" name="emergencyContact" type="tel" required />
            <FormField label="Password (minimum 6 characters)" name="password" type="password" required minLength={6} />
            <FormField label="Course" name="course" />
            <FormField label="Year" name="year" />
            <FormField label="College" name="college" />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <Link to="/login" className="text-sm font-bold text-[#5A1725] hover:underline">Back to login</Link>
            <button type="submit" disabled={saving} className="rounded-2xl bg-[#5A1725] px-6 py-3 font-bold text-white disabled:opacity-60">{saving ? "Creating account..." : "Create Account"}</button>
          </div>
        </form>
      ) : (
        <div className="w-full max-w-lg rounded-[32px] border border-[#E3CFAD] bg-[#FFF9EF] p-10 text-center shadow-[0_25px_70px_rgba(90,23,37,0.15)]">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C69C5A]">Hostel Hive</p>
          <h1 className="mt-3 text-3xl font-bold text-[#5A1725]">Password Recovery</h1>
          <p className="mt-3 leading-7 text-[#604B4F]">Password recovery is not available yet. Contact your hostel administrator to reset your account password.</p>
          <Link to="/login" className="mt-8 inline-flex rounded-2xl bg-[#5A1725] px-6 py-3 font-semibold text-[#FFF9EF] transition hover:-translate-y-1 hover:bg-[#7A2638]">Back to Login</Link>
        </div>
      )}
    </div>
  );
}

function FormField({ label, name, type = "text", required = false, minLength }) {
  return (
    <label className="block text-sm font-semibold text-[#241719]">
      {label}
      <input name={name} type={type} required={required} minLength={minLength} className="form-control mt-2" />
    </label>
  );
}

export default AuthPlaceholder;
