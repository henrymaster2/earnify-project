import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { parse } from 'cookie';
import { useState } from 'react';

interface Application {
  id: number;
  name: string;
  email: string;
  resume: string;
  status: string;
  createdAt: string;
  job: {
    title: string;
    company: string;
    createdAt: string;
  };
}

export default function AdminApplications({ applications }: { applications: Application[] }) {
  const [appState, setAppState] = useState(applications);

  const handleUpdateStatus = async (applicationId: number, newStatus: "verified" | "denied") => {
    try {
      const res = await fetch('/api/applications/updateStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicationId, status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setAppState((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-center mb-10">Job Applications</h1>

        {appState.length === 0 ? (
          <p className="text-center text-gray-300 text-xl">No applications found.</p>
        ) : (
          <div className="grid gap-8">
            {appState.map((app) => (
              <div
                key={app.id}
                className="backdrop-blur-md bg-white/10 text-white p-6 rounded-2xl shadow-xl border border-white/20"
              >
                <p className="mb-2 text-lg"><span className="font-semibold">Name:</span> {app.name}</p>
                <p className="mb-2 text-lg"><span className="font-semibold">Email:</span> {app.email}</p>
                <p className="mb-2 text-lg"><span className="font-semibold">Resume:</span> {app.resume}</p>
                <p className="mb-2 text-lg"><span className="font-semibold">Job:</span> {app.job.title} at {app.job.company}</p>
                <p className="mb-2 text-lg"><span className="font-semibold">Job Posted:</span> {new Date(app.job.createdAt).toLocaleString()}</p>
                <p className="mb-2 text-lg"><span className="font-semibold">Applied on:</span> {new Date(app.createdAt).toLocaleString()}</p>
                <p className="mb-4 text-lg">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`font-bold ${
                      app.status === "verified"
                        ? "text-green-400"
                        : app.status === "denied"
                        ? "text-red-400"
                        : "text-yellow-300"
                    }`}
                  >
                    {app.status}
                  </span>
                </p>

                {app.status === "pending" && (
                  <div className="flex gap-4">
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                      onClick={() => handleUpdateStatus(app.id, "verified")}
                    >
                      Verify
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
                      onClick={() => handleUpdateStatus(app.id, "denied")}
                    >
                      Deny
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user || !user.isAdmin) {
      throw new Error('Unauthorized');
    }

    const rawApplications = await prisma.jobApplication.findMany({
      include: {
        job: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const applications = rawApplications.map((app) => ({
      id: app.id,
      name: app.user.name,
      email: app.user.email,
      resume: app.resume,
      status: app.status,
      createdAt: app.createdAt.toISOString(),
      job: {
        title: app.job.title,
        company: app.job.company,
        createdAt: app.job.createdAt.toISOString(),
      },
    }));

    return {
      props: { applications },
    };
  } catch (err) {
    console.error('Auth failed:', err);
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }
};
