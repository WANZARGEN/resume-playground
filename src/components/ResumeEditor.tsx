import { useEditorUI } from '../contexts/EditorUIContext'
import { useResumeActions } from '../hooks/useResumeActions'
import { EmploymentEditor } from './editors/EmploymentEditor'
import { EducationEditor } from './editors/EducationEditor'
import { Resume, Profile, Employment, Education } from '../types/resume'
import { ProfileEditor } from './editors/ProfileEditor'
import { ResumePreview } from './preview/ResumePreview'
import Split from 'react-split'
import './split.css'
import StyleGuidePin from './common/StyleGuidePin'
import { useState } from 'react'

interface EditAreaProps {
  data: Resume
  handleProfileChange: (profile: Profile) => void
  handleEmploymentChange: (employments: Employment[]) => void
  handleEducationChange: (education: Education[]) => void
  onFocusChange: (index: number | null) => void
}

interface PreviewAreaProps {
  data: Resume
  fullWidth?: boolean
  focusedParagraphIndex?: number | null
}

const EditArea = ({ data, handleProfileChange, handleEmploymentChange, handleEducationChange, onFocusChange }: EditAreaProps) => {
  const resumeContext = {
    employments: data.employments,
    education: data.education
  };

  return (
    <div className="space-y-6 bg-white shadow-lg rounded-lg p-4 min-w-[320px]">
      <ProfileEditor
        data={data.profile}
        onChange={handleProfileChange}
        onFocusChange={onFocusChange}
        resumeContext={resumeContext}
      />
      <EmploymentEditor
        data={data.employments}
        onChange={handleEmploymentChange}
      />
      <EducationEditor
        data={data.education}
        onChange={handleEducationChange}
      />
    </div>
  )
}

const PreviewArea = ({ data, fullWidth = false, focusedParagraphIndex }: PreviewAreaProps) => {
  const { selectedFormat } = useEditorUI()
  
  return (
    <div className={`min-w-[320px] ${fullWidth ? 'min-w-[1000px] mx-auto' : ''}`}>
      <ResumePreview data={data} format={selectedFormat.id} focusedParagraphIndex={focusedParagraphIndex} />
    </div>
  )
}

export default function ResumeEditor() {
  const { activeTab } = useEditorUI()
  const {
    data,
    handleProfileChange,
    handleEmploymentChange,
    handleEducationChange,
  } = useResumeActions()
  const [focusedParagraphIndex, setFocusedParagraphIndex] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[2400px] mx-auto px-6 py-6">
        {activeTab === 'edit-only' && (
          <EditArea
            data={data}
            handleProfileChange={handleProfileChange}
            handleEmploymentChange={handleEmploymentChange}
            handleEducationChange={handleEducationChange}
            onFocusChange={setFocusedParagraphIndex}
          />
        )}
        
        {activeTab === 'split' && (
          <Split 
            sizes={[30, 70]}
            minSize={320}
            gutterSize={10}
            style={{ display: 'flex', width: '100%' }}
          >
            <EditArea
              data={data}
              handleProfileChange={handleProfileChange}
              handleEmploymentChange={handleEmploymentChange}
              handleEducationChange={handleEducationChange}
              onFocusChange={setFocusedParagraphIndex}
            />
            <PreviewArea data={data} focusedParagraphIndex={focusedParagraphIndex} />
          </Split>
        )}
        
        {activeTab === 'preview-only' && (
          <PreviewArea data={data} fullWidth />
        )}
      </div>
      <StyleGuidePin />
    </div>
  )
} 