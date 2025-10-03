import React from 'react';

const AboutPage = () => {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">About Matty AI</h1>
      <p className="text-gray-600 leading-7 mb-6">
        Matty AI is a lightweight, browser-based design tool that helps you create simple graphics fast.
        It runs entirely in your browser with a clean, focused UI so you can sketch ideas, add shapes and text,
        and export your result without distractions.
      </p>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-1">Fast</h3>
          <p className="text-sm text-gray-600">Minimal UI and quick actions to keep you in flow.</p>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-1">Simple</h3>
          <p className="text-sm text-gray-600">No clutter—just the tools you need.</p>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-1">Export-ready</h3>
          <p className="text-sm text-gray-600">Download PNG, JPG, or PDF in a click.</p>
        </div>
      </div>
      <p className="text-gray-600 leading-7">
        We’re iterating quickly. If you have feedback or feature requests, reach out from your profile or
        share your thoughts with us. Thanks for trying Matty AI!
      </p>
    </div>
  );
};

export default AboutPage;


