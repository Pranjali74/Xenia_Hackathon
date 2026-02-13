
import React, { useEffect, useState } from 'react';

interface WatermarkProps {
  email: string;
  userId?: string;
  contentTitle?: string;
}

const Watermark: React.FC<WatermarkProps> = ({ email, userId, contentTitle }) => {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimestamp(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden select-none unselectable">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-16 opacity-[0.05] p-10 transform -rotate-12 scale-150">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center justify-center whitespace-nowrap">
            <p className="text-2xl font-black text-white">{email}</p>
            <p className="text-sm font-semibold text-white">{userId ? `ID:${userId}` : ''}</p>
            {contentTitle && <p className="text-xs font-bold text-white">{contentTitle}</p>}
            <p className="text-lg font-bold text-white">{timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watermark;
