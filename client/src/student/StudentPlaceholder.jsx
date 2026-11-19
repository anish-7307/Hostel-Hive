import { useLocation } from "react-router-dom";

function StudentPlaceholder() {
  const location = useLocation();

  const pageName = location.pathname
    .split("/")
    .pop()
    .replace(/^\w/, (letter) => letter.toUpperCase());

  return (
    <div className="min-h-screen bg-[#F3E8D0] p-8">
      <div className="rounded-2xl bg-[#FFF9EF] p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-[#5A1725]">
          {pageName}
        </h1>

        <p className="mt-3 text-[#604B4F]">
          This page is under development.
        </p>
      </div>
    </div>
  );
}

export default StudentPlaceholder;