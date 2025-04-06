import { useEditorUI } from '../contexts/EditorUIContext'
import { useResumeActions } from '../hooks/useResumeActions'
import { EmploymentEditor } from './editors/EmploymentEditor'
import { EducationEditor } from './editors/EducationEditor'
import { Resume, Profile, Employment, Education } from '../types/resume'
import { ProfileEditor } from './editors/ProfileEditor'
import { ResumePreview } from './preview/ResumePreview'

interface EditAreaProps {
  data: Resume
  handleProfileChange: (profile: Profile) => void
  handleEmploymentChange: (employments: Employment[]) => void
  handleEducationChange: (education: Education[]) => void
}

interface PreviewAreaProps {
  data: Resume
  fullWidth?: boolean
}

const EditArea = ({ data, handleProfileChange, handleEmploymentChange, handleEducationChange }: EditAreaProps) => (
  <div className="space-y-6 bg-white shadow-lg rounded-lg p-4">
    <ProfileEditor
      data={data.profile}
      onChange={handleProfileChange}
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

const PreviewArea = ({ data, fullWidth = false }: PreviewAreaProps) => {
  const { selectedFormat } = useEditorUI()
  
  return (
    <div className={`overflow-hidden ${fullWidth ? 'min-w-[1000px] mx-auto' : 'min-w-[800px]'}`}>
      <ResumePreview data={data} format={selectedFormat.id} />
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

  return (
    <div className="max-w-[2400px] mx-auto py-6">
      {activeTab === 'edit-only' && (
        <EditArea
          data={data}
          handleProfileChange={handleProfileChange}
          handleEmploymentChange={handleEmploymentChange}
          handleEducationChange={handleEducationChange}
        />
      )}
      
      {activeTab === 'split' && (
        <div className="flex gap-8">
          <EditArea
            data={data}
            handleProfileChange={handleProfileChange}
            handleEmploymentChange={handleEmploymentChange}
            handleEducationChange={handleEducationChange}
          />
          <PreviewArea data={data} />
        </div>
      )}
      
      {activeTab === 'preview-only' && (
        <PreviewArea data={data} fullWidth />
      )}
    </div>
  )
} 