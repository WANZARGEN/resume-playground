import { useResume } from '../contexts/ResumeContext'
import ProfileEditor from './editors/ProfileEditor'
import EmploymentEditor from './editors/EmploymentEditor'
import EducationEditor from './editors/EducationEditor'
import ResumePreview from './preview/ResumePreview'

export default function ResumeEditor() {
  const { activeTab, editData, setEditData } = useResume()

  return (
    <div className="max-w-[2400px] mx-auto px-8 py-8">
      {activeTab === 'edit' ? (
        <div className="flex gap-8">
          {/* 편집 영역 */}
          <div className="flex-1 space-y-8">
            <ProfileEditor 
              data={editData.profile} 
              onChange={(profile) => setEditData({ ...editData, profile })} 
            />
            <EmploymentEditor
              data={editData.employments}
              onChange={(employments) => setEditData({ ...editData, employments })}
            />
            <EducationEditor
              data={editData.education}
              onChange={(education) => setEditData({ ...editData, education })}
            />
          </div>

          {/* 미리보기 영역 */}
          <div className="min-w-[800px] bg-white shadow-lg rounded-lg overflow-hidden">
            <ResumePreview data={editData} />
          </div>
        </div>
      ) : (
        /* 미리보기 전체화면 */
        <div className="bg-white shadow-lg rounded-lg overflow-hidden min-w-[1000px] mx-auto">
          <ResumePreview data={editData} />
        </div>
      )}
    </div>
  )
} 