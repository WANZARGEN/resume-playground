import { useEffect } from 'react'
import { Resume } from '../../types/resume'
import { ProfilePreview } from './ProfilePreview'
import { EmploymentPreview } from './EmploymentPreview'
import { EducationPreview } from './EducationPreview'
import '../../styles/resume-preview.css'
import { NameCard } from './NameCard'

interface ResumePreviewProps {
  data: Resume
  format?: 'html' | 'pdf' | 'json'
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, format = 'html' }) => {
  useEffect(() => {
    if (format === 'pdf') {
      document.body.classList.add('print-preview')
      document.documentElement.classList.add('pdf-mode')
    } else {
      document.body.classList.remove('print-preview')
      document.documentElement.classList.remove('pdf-mode')
    }
    return () => {
      document.body.classList.remove('print-preview')
      document.documentElement.classList.remove('pdf-mode')
    }
  }, [format])

  if (format === 'json') {
    return (
      <div className="bg-gray-900 text-gray-100 p-6 rounded-xl font-mono text-sm overflow-auto">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    )
  }

  const isPdfMode = format === 'pdf'

  return (
    <div className={`resume-preview ${isPdfMode ? 'pdf-preview' : ''}`}>
      <NameCard profile={data.profile} />
      <div className={`${isPdfMode ? 'px-12 py-8' : 'p-8'} space-y-8`}>
        {data.profile && <ProfilePreview profile={data.profile} />}
        <hr className="section-divider" />
        {data.employments && <EmploymentPreview employments={data.employments} />}
        <hr className="section-divider" />
        {data.education && <EducationPreview education={data.education} />}
      </div>
    </div>
  )
} 