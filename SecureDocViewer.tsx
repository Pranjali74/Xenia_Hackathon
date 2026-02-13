
import React from 'react';
import Watermark from './Watermark';

interface SecureDocViewerProps {
  url: string;
  email: string;
  userId?: string;
  contentTitle?: string;
}

const SecureDocViewer: React.FC<SecureDocViewerProps> = ({ url, email, userId, contentTitle }) => {
  // Append toolbar options to try and hide download in standard browsers
  const secureUrl = `${url}#toolbar=0&navpanes=0&scrollbar=0`;

  return (
    <div className="relative w-full h-[800px] bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
      <iframe
        src={secureUrl}
        className="w-full h-full border-none"
        title="Secure Document Viewer"
        onContextMenu={(e) => e.preventDefault()}
      />
      
      {/* Watermark Overlay */}
      <Watermark email={email} userId={userId} contentTitle={contentTitle} />

      {/* Interactive Shield: Block some interactions but allow scroll */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-transparent z-40" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-transparent z-40" />
    </div>
  );
};

export default SecureDocViewer;
