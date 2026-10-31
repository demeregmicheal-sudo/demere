import React from 'react';

export const GeezCross: React.FC<{ className?: string; size?: number }> = ({ className = 'w-6 h-6 text-amber-500', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Traditional Lalibela / Axumite cross stylized geometry */}
      <path d="M11 2h2v4h4v2h-4v3h3v-2h2v2h2v2h-2v2h-2v-2h-3v3h4v2h-4v4h-2v-4H7v-2h4v-3H8v2H6v-2H4v-2h2v-2h2v2h3V8H7V6h4V2z" />
      <circle cx="12" cy="12" r="1.5" fill="#fcfaf7" />
    </svg>
  );
};
