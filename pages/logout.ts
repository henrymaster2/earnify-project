import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    document.cookie = 'token=; Max-Age=0; path=/';
    router.replace('/');
  }, [router]);

  return null;
}
