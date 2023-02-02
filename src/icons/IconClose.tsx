import React from 'react'

export function IconClose(props: { 
  color?: string;
	size?: number;
}) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      width={props.size ?? 24}
			height={props.size ?? 24}
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke={props.color ?? "white"} 
      className="w-6 h-6"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>  
  );
}
