import Link from "next/link";
import { FaSearch, FaPlus, FaBriefcase, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/router";

export default function JobsMenuPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-blue-800 py-4 shadow-md flex items-center justify-between px-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 hover:text-blue-300 transition"
        >
          <FaArrowLeft size={18} /> Back
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <FaBriefcase /> Jobs
        </h1>
        <div className="w-6" /> {/* Spacer to balance header */}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center gap-8 px-4 py-10">
        <Link
          href="/jobs/search"
          className="bg-blue-700 hover:bg-blue-600 px-8 py-4 rounded-xl font-semibold shadow-lg w-full max-w-xs text-center transition flex items-center justify-center gap-3"
        >
          <FaSearch size={20} /> View Available Jobs
        </Link>

        <Link
          href="/jobs/post"
          className="bg-green-700 hover:bg-green-600 px-8 py-4 rounded-xl font-semibold shadow-lg w-full max-w-xs text-center transition flex items-center justify-center gap-3"
        >
          <FaPlus size={20} /> Post a Job
        </Link>
      </main>
    </div>
  );
}
