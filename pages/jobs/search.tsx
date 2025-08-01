// pages/search.tsx

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Job {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

interface ApplicationStatus {
  [jobId: number]: boolean;
}

export default function JobSearchPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>({});
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: null as File | null,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchJobs();
    fetchApplicationStatus();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get('/api/jobs/list');
      setJobs(res.data.jobs);
    } catch (err) {
      console.error('Error fetching jobs', err);
    }
  };

  const fetchApplicationStatus = async () => {
    try {
      const res = await axios.get('/api/jobs/status');
      const statusMap: ApplicationStatus = {};
      res.data.applications.forEach((app: any) => {
        statusMap[app.jobId] = true;
      });
      setApplicationStatus(statusMap);
    } catch (err) {
      console.error('Error fetching application status', err);
    }
  };

  const handleApplyClick = (jobId: number) => {
    setSelectedJobId(jobId);
    setMessage('');
    setFormData({ name: '', email: '', resume: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.resume || selectedJobId === null) {
      setMessage('Please fill all fields.');
      return;
    }

    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('resume', formData.resume);
    form.append('jobId', selectedJobId.toString());

    try {
      const res = await axios.post('/api/jobs/apply', form);
      if (res.data.success) {
        setMessage('Application submitted!');
        setApplicationStatus((prev) => ({ ...prev, [selectedJobId]: true }));
        setSelectedJobId(null);
      } else {
        setMessage('Failed to apply.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error submitting application.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Available Jobs</h1>
      <div className="max-w-3xl mx-auto space-y-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-sm mt-2">{job.description}</p>

            {applicationStatus[job.id] ? (
              <p className="mt-4 text-green-400">✅ You have applied</p>
            ) : (
              <button
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                onClick={() => handleApplyClick(job.id)}
              >
                Apply
              </button>
            )}

            {selectedJobId === job.id && (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full p-2 rounded bg-white/20 border border-white/30"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-2 rounded bg-white/20 border border-white/30"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full"
                  onChange={(e) =>
                    setFormData({ ...formData, resume: e.target.files?.[0] || null })
                  }
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
                >
                  Submit Application
                </button>
                {message && <p className="text-sm text-yellow-400">{message}</p>}
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
