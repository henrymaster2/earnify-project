import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';
import * as cookie from 'cookie';
import { PrismaClient } from '@prisma/client';
import { useState } from 'react';
import Image from 'next/image';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'myearnifysecretkey';

type Props = {
  id: number;
  name: string;
  email: string;
  coins: number;
  phone?: string | null;
  profilePic?: string | null;
};

export default function Profile({ id, name, email, coins, phone, profilePic }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(profilePic || null);
  const [uploading, setUploading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(phone || '');
  const [savingPhone, setSavingPhone] = useState(false);

  const referralLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/signup?ref=${id}`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('/api/upload-profile-pic', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setPreview(data.path);
      alert('Profile picture updated!');
    } catch (err) {
      console.error(err);
      alert('Failed to upload picture.');
    } finally {
      setUploading(false);
    }
  };

  const handlePhoneSave = async () => {
    if (!phoneNumber.trim()) return alert('Please enter a phone number');
    setSavingPhone(true);

    try {
      const res = await fetch('/api/update-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      if (!res.ok) throw new Error('Failed to update phone');
      alert('Phone number updated!');
    } catch (err) {
      console.error(err);
      alert('Error updating phone number.');
    } finally {
      setSavingPhone(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-gray-900 to-black text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white/10 p-6 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/10">
        
        {/* Header */}
        <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
          My Profile
        </h1>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-32 h-32">
            <Image
              src={preview || '/profile.png'}
              alt="Profile"
              fill
              className="rounded-full border-4 border-teal-400 object-cover shadow-lg shadow-teal-500/30"
            />
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                         file:font-semibold file:bg-gradient-to-r file:from-blue-500 file:to-teal-400 
                         hover:file:opacity-90 cursor-pointer"
            />
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-gradient-to-r from-green-500 to-emerald-400 hover:opacity-90 px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Change Picture'}
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-4 text-lg">
          <p><span className="font-semibold text-teal-300">Name:</span> {name}</p>
          <p><span className="font-semibold text-teal-300">Email:</span> {email}</p>
          <p><span className="font-semibold text-teal-300">Coins:</span> {coins}</p>

          {/* Phone Editable Field */}
          <div>
            <label className="font-semibold text-teal-300 block mb-1">Phone:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 bg-black/50 p-2 rounded-lg text-sm border border-white/20"
              />
              <button
                onClick={handlePhoneSave}
                disabled={savingPhone}
                className="bg-gradient-to-r from-blue-500 to-teal-400 hover:opacity-90 px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
              >
                {savingPhone ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="mt-8 bg-white/10 p-5 rounded-lg shadow-md border border-white/10">
          <p className="font-semibold mb-3 text-teal-300">Your Referral Link:</p>
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 bg-black/50 p-2 rounded-lg text-sm border border-white/20"
            />
            <button
              onClick={() => navigator.clipboard.writeText(referralLink)}
              className="bg-gradient-to-r from-yellow-400 to-orange-300 hover:opacity-90 text-black px-4 py-2 rounded-lg font-semibold"
            >
              Copy
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = context.req.headers.cookie;
    if (!cookies) throw new Error('No cookies found');

    const { token } = cookie.parse(cookies);
    if (!token) throw new Error('No token found');

    const decoded: any = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, coins: true, phone: true, profilePic: true },
    });

    if (!user) throw new Error('User not found');

    return { props: user };
  } catch (error) {
    console.error('Profile page error:', error);
    return { redirect: { destination: '/login', permanent: false } };
  }
};
