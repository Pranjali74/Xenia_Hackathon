
import React from 'react';
import Watermark from './Watermark';

interface SecurePlayerProps {
  url: string;
  email: string;
  userId?: string;
  contentTitle?: string;
}

const SecurePlayer: React.FC<SecurePlayerProps> = ({ url, email, userId, contentTitle }) => {
  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group border border-gray-800">
      <video
        className="w-full h-full"
        controls
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Watermark email={email} userId={userId} contentTitle={contentTitle} />
      
      {/* Visual Blockers for context menu/dev tools focus */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default SecurePlayer;
