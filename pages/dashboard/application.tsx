import { useEffect, useState } from 'react';

interface Application {
  id: number;
  resume: string;
  status: string;
  createdAt: string;
  job: {
    title: string;
    company: string;
    createdAt: string;
  };
}

export default function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      const res = await fetch('/api/applications/myApplications');
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
      setLoading(false);
    }
    fetchApplications();
  }, []);

  if (loading) return <p>Loading your applications...</p>;
  if (applications.length === 0) return <p>You have no job applications yet.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Job Applications</h1>
      <ul className="space-y-4">
        {applications.map((app) => (
          <li key={app.id} className="p-4 border rounded shadow-sm">
            <p><strong>Job:</strong> {app.job.title} at {app.job.company}</p>
            <p><strong>Applied on:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span className={
              app.status === 'verified' ? 'text-green-600' :
              app.status === 'denied' ? 'text-red-600' :
              'text-yellow-600'
            }>{app.status}</span></p>
          </li>
        ))}
      </ul>
    </div>
  );
}
