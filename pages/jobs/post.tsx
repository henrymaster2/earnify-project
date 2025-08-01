import { useState } from 'react';

export default function PostJob() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    imageBase64: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, imageBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Submitting...');

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Job posted successfully!');
        setForm({
          title: '',
          description: '',
          company: '',
          location: '',
          imageBase64: '',
        });
      } else {
        setMessage(`Error: ${data.error || 'Failed to post job'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-blue-900 text-white p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-gray-900 p-6 rounded-2xl shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold mb-2 text-center">Post a Job</h2>

        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          required
        />

        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          rows={4}
          required
        />

        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={form.company}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Job Location"
          value={form.location}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Post Job
        </button>

        {message && <p className="text-center mt-2">{message}</p>}
      </form>
    </div>
  );
}
