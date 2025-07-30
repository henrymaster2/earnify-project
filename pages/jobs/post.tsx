import { useState } from 'react';
import { useRouter } from 'next/router';

export default function PostJobPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.company || !form.location) {
      setError('Please fill in all fields.');
      return;
    }

    let imageBase64 = null;
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        imageBase64 = reader.result;
        await submitToApi(imageBase64 as string);
      };
      reader.readAsDataURL(imageFile);
    } else {
      await submitToApi(null);
    }
  };

  const submitToApi = async (imageBase64: string | null) => {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, imageBase64 }),
      });

      if (!response.ok) throw new Error('Failed to post job');

      router.push('/jobs');
    } catch (err) {
      setError('Something went wrong. Try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-gray-900 rounded-xl shadow-lg p-8 space-y-5">
        <h1 className="text-3xl font-bold text-center">Post a Job</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleInputChange}
            className="w-full p-3 rounded-md bg-gray-800 text-white"
          />
          <textarea
            name="description"
            placeholder="Job Description"
            value={form.description}
            onChange={handleInputChange}
            className="w-full p-3 rounded-md bg-gray-800 text-white"
          />
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={form.company}
            onChange={handleInputChange}
            className="w-full p-3 rounded-md bg-gray-800 text-white"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleInputChange}
            className="w-full p-3 rounded-md bg-gray-800 text-white"
          />

          <div>
            <label className="block mb-1 text-sm font-medium">Upload Job Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-white"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 h-32 object-cover rounded-lg"
              />
            )}
          </div>

          {error && <p className="text-red-400">{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md font-semibold transition w-full"
          >
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}
