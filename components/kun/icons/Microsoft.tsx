import React from 'react'
import type { SVGProps } from 'react'

export const Microsoft = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.2em"
      height="1.2em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13.5 15.5c0-.943 0-1.414.293-1.707s.764-.293 1.707-.293H20c.943 0 1.414 0 1.707.293S22 14.557 22 15.5V20c0 .943 0 1.414-.293 1.707S20.943 22 20 22h-4.5c-.943 0-1.414 0-1.707-.293S13.5 20.943 13.5 20zM2 4c0-.943 0-1.414.293-1.707S3.057 2 4 2h4.5c.943 0 1.414 0 1.707.293S10.5 3.057 10.5 4v4.5c0 .943 0 1.414-.293 1.707s-.764.293-1.707.293H4c-.943 0-1.414 0-1.707-.293S2 9.443 2 8.5zm0 11.5c0-.943 0-1.414.293-1.707S3.057 13.5 4 13.5h4.5c.943 0 1.414 0 1.707.293s.293.764.293 1.707V20c0 .943 0 1.414-.293 1.707S9.443 22 8.5 22H4c-.943 0-1.414 0-1.707-.293S2 20.943 2 20zM13.5 4c0-.943 0-1.414.293-1.707S14.557 2 15.5 2H20c.943 0 1.414 0 1.707.293S22 3.057 22 4v4.5c0 .943 0 1.414-.293 1.707s-.764.293-1.707.293h-4.5c-.943 0-1.414 0-1.707-.293S13.5 9.443 13.5 8.5z"
        color="currentColor"
      ></path>
    </svg>
  )
}
