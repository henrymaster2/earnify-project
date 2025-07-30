import { useState } from 'react';
import { useRouter } from 'next/router';

export default function PostJob() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSuccess('Job posted successfully!');
      setForm({ title: '', description: '', company: '', location: '' });
      setTimeout(() => router.push('/jobs'), 2000);
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to post job');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">📝 Post a Job</h1>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Job Description"
          rows={5}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
          required
        />
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company Name"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
          required
        />
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white"
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded text-white font-semibold"
        >
          Post Job
        </button>
        {error && <p className="text-red-400 mt-2">{error}</p>}
        {success && <p className="text-green-400 mt-2">{success}</p>}
      </form>
    </div>
  );
}
