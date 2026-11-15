import { Link } from "react-router-dom";

function Forbidden() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3E8D0] p-6">
      <div className="w-full max-w-lg rounded-[32px] border border-[#E3CFAD] bg-[#FFF9EF] p-10 text-center shadow-[0_25px_70px_rgba(90,23,37,0.15)]">

        <p className="text-7xl font-black text-[#5A1725]">
          403
        </p>

        <h1 className="mt-4 text-2xl font-bold text-[#241719]">
          Access Restricted
        </h1>

        <p className="mt-3 leading-7 text-[#604B4F]">
          You don't have permission to access this section.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex rounded-2xl bg-[#5A1725] px-6 py-3 font-semibold text-[#FFF9EF] transition hover:-translate-y-1 hover:bg-[#7A2638]"
        >
          Go Home
        </Link>

      </div>
    </div>
  );
}

export default Forbidden;