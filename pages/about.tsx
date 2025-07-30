// pages/about.tsx

import React from 'react';
import Head from 'next/head';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lottie-player': any;
    }
  }
}

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About Us | Earnify</title>
        <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
      </Head>
      <div className="relative h-screen w-screen bg-gray-900 text-white overflow-hidden">
        {/* Background animation */}
        <lottie-player
          autoplay
          loop
          mode="normal"
          src="https://assets7.lottiefiles.com/packages/lf20_w51pcehl.json"
          class="absolute top-0 left-0 w-full h-full z-0 opacity-20"
        ></lottie-player>

        {/* Content Overlay */}
        <div className="relative z-10 flex items-center justify-center h-full text-center px-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-400">Earnify</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              Earnify is your one-stop hub for converting simple tasks into real rewards. Whether you're watching ads,
              downloading apps, referring friends, or spinning for luck — you’re always earning.
            </p>
            <p className="mt-4 text-sm text-gray-400">
              Join a growing community of students, workers, and traders earning from every click.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
