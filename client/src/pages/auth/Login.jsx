import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { apiRequest } from "../../lib/api";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const passwordInputRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.identifier || !form.password) {
      setError("Please enter your login details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await apiRequest("/auth/login", {
        method: "POST",
        auth: false,
        body: { email: form.identifier.trim(), password: form.password },
      });
      const user = {
        ...result.user,
        name: result.user.fullName || result.user.name,
        token: result.token,
      };
      await login(user);
      navigate(`/${user.role}`, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectDemoAccount = (role) => {
    setForm({
      identifier: `${role}.demo@hostelhive.test`,
      password: "",
    });
    setError("");
    requestAnimationFrame(() => passwordInputRef.current?.focus());
  };

  return (
    <div className="min-h-screen bg-[#F3E8D0] lg:grid lg:grid-cols-2">

      {/* Left visual */}
      <div className="relative hidden overflow-hidden bg-[#5A1725] lg:flex lg:items-center lg:justify-center">

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#7A2638]" />

        <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full border-[80px] border-[#C69C5A]/20" />

        <div className="relative z-10 max-w-lg p-12 text-[#FFF9EF]">

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#C69C5A]">
            Hostel Hive
          </p>

          <h1 className="mt-5 text-5xl font-black leading-tight">
            Everything your hostel needs.
          </h1>

          <p className="mt-6 leading-8 text-[#F3E8D0]/80">
            Manage rooms, attendance, fees, visitors,
            complaints and hostel operations from one
            intelligent platform.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">

            {[
              ["Rooms", "Managed"],
              ["Attendance", "Tracked"],
              ["Payments", "Organised"],
              ["Complaints", "Resolved"],
            ].map(([title, subtitle]) => (
              <div
                key={title}
                className="rounded-2xl border border-[#FFF9EF]/10 bg-[#FFF9EF]/10 p-4 backdrop-blur-xl"
              >
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm text-[#F3E8D0]/70">
                  {subtitle}
                </p>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* Login */}
      <div className="flex items-center justify-center p-6 sm:p-10">

        <div className="w-full max-w-md">

          <Link to="/" className="mb-7 inline-flex items-center gap-3 rounded-xl text-sm font-bold text-[#5A1725]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5A1725] text-xs font-black text-[#FFF9EF]">HH</span>
            Hostel Hive
          </Link>

          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C69C5A]">
              Welcome Back
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#5A1725]">
              Sign in to your account
            </h2>

            <p className="mt-2 text-sm text-[#604B4F]">
              Access your hostel management portal.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[32px] border border-[#E3CFAD] bg-[#FFF9EF] p-6 shadow-[0_25px_70px_rgba(90,23,37,0.12)] sm:p-8"
          >

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-2xl border border-[#9B2C2C]/20 bg-[#9B2C2C]/10 p-4 text-sm text-[#9B2C2C]"
              >
                {error}
              </div>
            )}

            {/* Identifier */}
            <label className="block">
              <span className="text-sm font-semibold text-[#241719]">
                Email
              </span>

              <span className="mt-1 block text-xs text-[#604B4F]">
                Used to securely identify your account.
              </span>

              <div className="relative mt-3">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#604B4F]"
                />

                <input
                  value={form.identifier}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      identifier: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-[#E3CFAD] bg-[#F8EEDC] py-3.5 pl-12 pr-4 outline-none transition focus:border-[#5A1725] focus:ring-4 focus:ring-[#5A1725]/10"
                  placeholder="you@example.com"
                  type="email"
                  required
                />
              </div>
            </label>

            {/* Password */}
            <label className="mt-6 block">
              <span className="text-sm font-semibold text-[#241719]">
                Password
              </span>

              <span className="mt-1 block text-xs text-[#604B4F]">
                Keep your password private and secure.
              </span>

              <div className="relative mt-3">

                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#604B4F]"
                />

                <input
                  ref={passwordInputRef}
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-[#E3CFAD] bg-[#F8EEDC] py-3.5 pl-12 pr-12 outline-none transition focus:border-[#5A1725] focus:ring-4 focus:ring-[#5A1725]/10"
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#604B4F]"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>
            </label>

            <div className="mt-3 text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-[#5A1725] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-2xl bg-[#5A1725] py-3.5 font-bold text-[#FFF9EF] shadow-[0_12px_30px_rgba(90,23,37,0.25)] transition hover:-translate-y-1 hover:bg-[#7A2638]"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>

            {/* Development demo accounts */}
            {import.meta.env.DEV && (
              <div className="mt-6 border-t border-[#E3CFAD] pt-6">

                <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-[#604B4F]">
                  Development Accounts
                </p>
                <p className="mb-3 text-center text-xs text-[#604B4F]">
                  Choose an account, enter its password, then sign in to use saved features.
                </p>

                <div className="grid grid-cols-3 gap-2">

                  {["student", "warden", "owner"].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => selectDemoAccount(role)}
                      className="rounded-xl border border-[#E3CFAD] bg-[#F8EEDC] px-2 py-2 text-xs font-semibold capitalize text-[#5A1725] transition hover:-translate-y-0.5 hover:bg-[#E3CFAD]"
                    >
                      {role}
                    </button>
                  ))}

                </div>

              </div>
            )}

          </form>

          <p className="mt-6 text-center text-sm text-[#604B4F]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-[#5A1725] hover:underline"
            >
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;