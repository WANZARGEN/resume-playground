import ReactDOMServer from 'react-dom/server'
import { Resume } from '../types/resume'
import { ResumePreview } from '../components/preview/ResumePreview'

export const convertResumeToHtml = (data: Resume): string => {
  const content = ReactDOMServer.renderToString(<ResumePreview data={data} format="pdf" />)
  
  return `
    <!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.profile?.name} 이력서</title>
        <!-- fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap" rel="stylesheet">
        <!-- tailwindcss -->
        <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
        <style type="text/tailwindcss">
          @theme {
            --font-sans: 'Noto Sans KR', sans-serif;
            --font-mono: monospace;
          }
          @layer utilities {
            .container {
              max-width: 1024px !important;
            }
          }
          @layer components {
            .section-title {
              @apply text-2xl font-bold mb-4 text-gray-800;
            }
            .section-sub-title {
              @apply text-xl font-semibold mt-6 mb-2 text-gray-700;
            }
            .section-divider {
              @apply my-8 border-gray-200;
            }

            .paragraph {
              @apply leading-relaxed;
            }
            /* 주요 강조: 가장 강한 강조가 필요한 핵심 키워드나 문구 */
            .text-emphasis {
              @apply font-bold;
            }
            /* 보조 강조: 중요한 키워드나 문구 */
            .text-accent {
              @apply drop-shadow-md text-black;
            }
            /* 하이라이트: 코드 블록이나 텍스트 하이라이팅 */
            .text-highlight {
              @apply bg-zinc-200 rounded-sm text-black;
              padding: 2px 4px; 
            }
            /* 하이퍼링크: 링크 텍스트 */
            .text-link {
              @apply text-blue-800 decoration-blue-800/30 hover:underline;
            }

            /* 섹션의 메타 정보: 직위, 기간 등의 부가 정보 */
            .meta-info {
              @apply flex items-stretch gap-2 text-gray-500 mb-4;
            }
            /* 메타 정보 구분자 */
            .meta-divider {
              @apply my-1 border-r border-gray-300 self-stretch;
            }

            /* 스펙 리스트: 사용 기술, 주요 업무 등의 리스트 */
            .spec-list {
              @apply space-y-4;
            }
            /* 각 스펙 항목의 레이블 */
            .spec-label {
              @apply font-medium mb-2 text-gray-700;
            }
            /* 각 스펙 항목의 내용 컨테이너 */
            .spec-content-container {
              @apply space-y-4 px-1;
            }

            /* 기술 스택 컨테이너 */
            .tech-list {
              @apply text-gray-600 whitespace-normal flex flex-wrap items-center;
            }
            .tech-item {
              @apply relative font-mono font-medium inline-flex items-center;
            }
            .tech-item:not(:last-child)::after {
              @apply content-['⋅'] mx-1 font-bold;
            }
            
            /* 주요 업무 헤더 */
            .work-header {
              @apply text-gray-700 font-semibold mb-2;
            }
            /* 주요 업무 리스트 */
            .work-list {
              @apply list-disc pl-6 space-y-1 text-gray-600;
            }
            /* 세부 업무 리스트 */
            .work-list-nested {
              @apply pl-6 mt-1 space-y-1;
              list-style: circle
            }
          }

          /* name card 스타일 */
          .name-card {
            @apply text-center bg-gray-900 text-gray-100 rounded-t-2xl p-8 pb-4 shadow-lg;
          }
          .name-card .profile-photo {
            @apply rounded-full w-32 h-32 object-cover mx-auto shadow-xl;
          }
          .name-card .info .name {
            @apply text-4xl font-medium mt-2 mb-2;
          }
          .name-card .info .position {
            @apply text-gray-300 flex items-center justify-center;
          }
          .name-card .info .info-divider {
            @apply my-4 border-gray-700;
          }
          .name-card .info .contact-list {
            @apply flex items-center justify-center flex-wrap gap-x-10 gap-y-4 text-gray-300 text-sm;
          }
          .name-card .info .contact-list a {
            @apply hover:text-white flex items-center gap-1;
          }
          .name-card .info .contact-list img {
            @apply w-4 h-4 invert;
          }
          .name-card .info .contact-list .contact-divider {
            @apply h-3 border-r border-gray-300 hidden;
          }

          @media print {
            body {
              @apply p-8;
            }
            main {
              @apply p-0 pb-12 shadow-none;
            }

            .text-link {
              @apply no-underline;
            }

            /* PDF 출력용 name card 추가 스타일 */
            .name-card {
              @apply flex items-center p-0 my-12 gap-10 text-left bg-white text-gray-900 shadow-none;
            }
            .name-card .profile-photo {
              @apply m-0 grayscale w-26 h-26 shadow-lg;
            }
            .name-card .info {
              @apply flex flex-col;
            }
            .name-card .info .name {
              @apply mt-0;
            }
            .name-card .info .position {
              @apply block text-xl text-gray-700 mb-3;
            }
            .name-card .info .info-divider {
              @apply hidden;
            }
            .name-card .info .contact-list {
              @apply justify-start gap-3 text-gray-500;
            }
            .name-card .info .contact-list img {
              @apply w-4 h-4 invert-0;
            }
            .name-card .info .contact-list .contact-divider {
              @apply block;
            }
          }
        </style>
      </head>
      <body class="container mx-auto p-4 font-sans tracking-tight">
        ${content}
      </body>
    </html>
  `
} 