import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-tr from-blue-950 via-slate-900 to-blue-900 text-gray-100 px-4 py-6 flex flex-col">
      
      <header className="flex flex-col sm:flex-row justify-between items-center gap-3 border-b border-blue-500 pb-4">
        <h1 className="text-3xl font-extrabold text-blue-300 tracking-tight">Earnify</h1>
        <nav className="space-x-4 text-md font-medium">
          <Link
            href="/login"
            className="text-blue-200 hover:text-white hover:bg-blue-600 px-3 py-1 rounded transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="text-indigo-200 hover:text-white hover:bg-indigo-600 px-3 py-1 rounded transition"
          >
            Sign Up
          </Link>
          <Link
            href="/about"
            className="text-slate-200 hover:text-white hover:bg-slate-600 px-3 py-1 rounded transition"
          >
            About
          </Link>
        </nav>
      </header>

      
      <section className="flex-1 flex flex-col justify-center items-center text-center mt-12 sm:mt-20">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
          Welcome to <br className="hidden sm:block" />
          <span className="whitespace-nowrap">Your Preferred Site</span>
        </h2>
        <p className="mt-5 text-base sm:text-lg text-gray-300 max-w-md sm:max-w-2xl">
          Earn coins by watching ads, playing games, discovering jobs, and building your future — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link
            href="/signup"
            className="bg-gradient-to-r from-indigo-500 to-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow hover:shadow-lg transition"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="bg-white text-blue-700 border border-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition"
          >
            Learn More
          </Link>
        </div>
      </section>
    </main>
  );
}
