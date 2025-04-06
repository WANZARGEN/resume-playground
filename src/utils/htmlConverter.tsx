import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { Resume } from '../types/resume'
import ResumePreview from '../components/preview/ResumePreview'

export const convertResumeToHtml = (data: Resume): string => {
  const content = ReactDOMServer.renderToString(<ResumePreview data={data} />)
  
  return `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>이력서 - ${data.profile.name}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print {
            @page {
              size: A4;
              margin: 0;
            }
            body {
              margin: 2cm;
            }
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `
} 