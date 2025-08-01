import { useEffect, useState } from 'react';
import axios from 'axios';

type Application = {
  id: number;
  resume: string;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  job: { title: string };
};

export default function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/api/admin/applications');
      setApplications(res.data);
    } catch (error) {
      console.error('Error fetching applications', error);
    }
  };

  const handleUpdate = async (id: number, status: 'approved' | 'rejected') => {
    try {
      setLoading(true);
      console.log(`Updating application ${id} to ${status}`);
      const res = await axios.put('/api/admin/applications', {
        id: Number(id),
        status: status.toLowerCase(),
      });

      console.log('Update response:', res.data);

      // Update the state without full reload
      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status: status } : app
        )
      );
    } catch (error) {
      console.error('Error updating status', error);
      alert('Update failed. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Job Applications</h1>

      {applications.length === 0 && <p>No applications found.</p>}

      <div className="space-y-6">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white/10 rounded-xl p-4 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div className="space-y-1">
              <p>
                <strong>User:</strong> {app.user.name} ({app.user.email})
              </p>
              <p>
                <strong>Job:</strong> {app.job.title}
              </p>
              <p>
                <strong>Resume:</strong> {app.resume}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span
                  className={
                    app.status === 'approved'
                      ? 'text-green-400'
                      : app.status === 'rejected'
                      ? 'text-red-400'
                      : 'text-yellow-400'
                  }
                >
                  {app.status}
                </span>
              </p>
            </div>
            <div className="mt-4 md:mt-0 space-x-2">
              <button
                className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded-md"
                onClick={() => handleUpdate(app.id, 'approved')}
                disabled={loading}
              >
                Approve
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded-md"
                onClick={() => handleUpdate(app.id, 'rejected')}
                disabled={loading}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
