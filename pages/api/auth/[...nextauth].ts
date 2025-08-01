import NextAuth, { type NextAuthOptions, type SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (
          credentials?.email === 'admin@example.com' &&
          credentials?.password === 'admin'
        ) {
          return { id: '1', name: 'Admin', email: 'admin@example.com' }; // ✅ id is string now
        }
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt' as SessionStrategy, // ✅ session.strategy typed correctly
  },
};

export default NextAuth(authOptions);
