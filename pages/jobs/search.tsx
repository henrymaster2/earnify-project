import { useEffect, useState } from 'react';
import axios from 'axios';

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
}

export default function JobSearch() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [statusMap, setStatusMap] = useState<Record<number, string>>({});

  useEffect(() => {
    axios.get('/api/jobs/list').then(res => setJobs(res.data.jobs));
  }, []);

  const handleApply = async (jobId: number) => {
    const resume = prompt('Enter your resume:');
    if (!resume) return;

    try {
      await axios.post('/api/jobs/apply', { jobId, resume });
      alert('Application submitted!');
      fetchStatus(jobId);
    } catch (err) {
      alert('You may have already applied or there was an error.');
    }
  };

  const fetchStatus = async (jobId: number) => {
    try {
      const res = await axios.get(`/api/jobs/status?jobId=${jobId}`);
      const status = res.data?.status || 'Pending';
      setStatusMap(prev => ({ ...prev, [jobId]: status }));
    } catch {
      setStatusMap(prev => ({ ...prev, [jobId]: 'Not applied' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Job Listings</h1>
      <div className="max-w-3xl mx-auto space-y-6">
        {jobs.map(job => (
          <div key={job.id} className="bg-white/10 rounded-xl p-4 shadow-lg">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-sm mt-1">{job.description}</p>
            <p className="text-sm italic mt-1 text-gray-300">Location: {job.location}</p>

            <div className="mt-4 space-x-4">
              {statusMap[job.id] ? (
                <span className="text-green-400">Status: {statusMap[job.id]}</span>
              ) : (
                <>
                  <button
                    onClick={() => handleApply(job.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => fetchStatus(job.id)}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded"
                  >
                    Check Status
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
