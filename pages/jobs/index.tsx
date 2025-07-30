import { useEffect, useState } from 'react';

type Job = {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  createdAt: string;
  imageBase64?: string | null;
};

export default function JobListPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      setJobs(data);
    };
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-black text-white py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-blue-300 drop-shadow-lg">
        🔍 Available Jobs
      </h1>

      <div className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-blue-800/80 backdrop-blur-md p-5 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 border border-blue-700"
          >
            <h2 className="text-xl font-bold text-white mb-2">{job.title}</h2>
            <p className="text-sm text-blue-200 mb-1 font-semibold">🏢 {job.company}</p>
            <p className="text-sm text-blue-200 mb-1">📍 {job.location}</p>
            <p className="text-sm text-gray-300 mt-2 mb-3">{job.description}</p>

            {job.imageBase64 && (
              <img
                src={job.imageBase64}
                alt="Job image"
                className="w-full max-h-48 object-cover rounded-lg mt-3 border border-blue-600"
              />
            )}

            <p className="text-xs text-gray-400 mt-4">
              🕒 Posted: {new Date(job.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
