import { useEffect } from 'react'
import { Resume } from '../types/resume'
import ProfileEditor from './editors/ProfileEditor'
import EmploymentEditor from './editors/EmploymentEditor'
import EducationEditor from './editors/EducationEditor'
import ResumePreview from './preview/ResumePreview'
import ResumeHeader from './ResumeHeader'
import { ResumeProvider, useResume } from '../contexts/ResumeContext'

interface Props {
  data: Resume
  onDownload: (data: Resume, format: 'json' | 'html') => void
  onSave: (data: Resume, directory: FileSystemDirectoryHandle) => void
  onLoad: () => void
  autoSaveDirectory: FileSystemDirectoryHandle | null
}

function ResumeEditorContent({ onDownload, onSave, onLoad }: Omit<Props, 'data' | 'autoSaveDirectory'>) {
  const { activeTab, editData, setEditData } = useResume()

  return (
    <div className="min-h-screen">
      <ResumeHeader onDownload={onDownload} onSave={onSave} onLoad={onLoad} />

      {/* 컨텐츠 */}
      <div className="max-w-[2400px] mx-auto px-8 py-8">
        {activeTab === 'edit' ? (
          <div className="flex gap-8">
            {/* 편집 영역 */}
            <div className="flex-1 space-y-8">
              <ProfileEditor data={editData.profile} onChange={(profile) => setEditData({ ...editData, profile })} />
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
    </div>
  )
}

function ResumeEditor({ data, onDownload, onSave, onLoad, autoSaveDirectory }: Props) {
  return (
    <ResumeProvider initialData={data} autoSaveDirectory={autoSaveDirectory}>
      <ResumeEditorContent onDownload={onDownload} onSave={onSave} onLoad={onLoad} />
    </ResumeProvider>
  )
}

export default ResumeEditor 