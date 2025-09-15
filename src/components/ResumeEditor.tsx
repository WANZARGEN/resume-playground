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
import { useState, useEffect, useRef } from 'react'

interface EditAreaProps {
  data: Resume
  handleProfileChange: (profile: Profile) => void
  handleEmploymentChange: (employments: Employment[]) => void
  handleEducationChange: (education: Education[]) => void
  onFocusChange: (index: number | null) => void
  onEmploymentFocus: (focus: { employmentIndex?: number; detailIndex?: number; itemIndex?: number; subItemIndex?: number } | null) => void
  onEducationFocus: (focus: { educationIndex?: number; activityIndex?: number } | null) => void
}

interface PreviewAreaProps {
  data: Resume
  fullWidth?: boolean
  focusedParagraphIndex?: number | null
  focusedEmployment?: { employmentIndex?: number; detailIndex?: number; itemIndex?: number; subItemIndex?: number } | null
  focusedEducation?: { educationIndex?: number; activityIndex?: number } | null
}

const EditArea = ({ data, handleProfileChange, handleEmploymentChange, handleEducationChange, onFocusChange, onEmploymentFocus, onEducationFocus }: EditAreaProps) => {
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
        onFocusChange={onEmploymentFocus}
      />
      <EducationEditor
        data={data.education}
        onChange={handleEducationChange}
        onFocusChange={onEducationFocus}
      />
    </div>
  )
}

const PreviewArea = ({ data, fullWidth = false, focusedParagraphIndex, focusedEmployment, focusedEducation }: PreviewAreaProps) => {
  const { selectedFormat } = useEditorUI()

  return (
    <div className={`min-w-[320px] ${fullWidth ? 'min-w-[1000px] mx-auto' : ''}`}>
      <ResumePreview
        data={data}
        format={selectedFormat.id}
        focusedParagraphIndex={focusedParagraphIndex}
        focusedEmployment={focusedEmployment}
        focusedEducation={focusedEducation}
      />
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
  const [focusedEmployment, setFocusedEmployment] = useState<{
    employmentIndex?: number
    detailIndex?: number
    itemIndex?: number
    subItemIndex?: number
  } | null>(null)
  const [focusedEducation, setFocusedEducation] = useState<{
    educationIndex?: number
    activityIndex?: number
  } | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  // Smart Follow: 포커스 변경 시 미리보기 자동 스크롤
  useEffect(() => {
    if (activeTab !== 'split') return

    const scrollToElement = () => {
      if (!previewRef.current) return

      // 하이라이트된 요소를 직접 찾음
      const focusedElement = previewRef.current.querySelector('.focused-item, .focused-paragraph')

      if (focusedElement) {
        const container = previewRef.current
        const elementRect = focusedElement.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        // 요소가 이미 보이는 영역에 있는지 확인
        const isInView = elementRect.top >= containerRect.top &&
                        elementRect.bottom <= containerRect.bottom

        // 보이지 않을 때만 스크롤
        if (!isInView) {
          const scrollTop = container.scrollTop + elementRect.top - containerRect.top - 100 // 100px offset from top

          container.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          })
        }
      } else {
        // 하이라이트된 요소가 없는 경우 섹션으로 스크롤
        let sectionSelector = null

        if (focusedParagraphIndex !== null) {
          sectionSelector = '#profile'
        } else if (focusedEmployment?.employmentIndex !== undefined) {
          // 특정 회사 섹션으로 스크롤 (인덱스 기반)
          const employmentSections = previewRef.current.querySelectorAll('#employment-history .section-entry')
          const targetSection = employmentSections[focusedEmployment.employmentIndex]
          if (targetSection) {
            const container = previewRef.current
            const elementRect = targetSection.getBoundingClientRect()
            const containerRect = container.getBoundingClientRect()
            const scrollTop = container.scrollTop + elementRect.top - containerRect.top - 100

            container.scrollTo({
              top: scrollTop,
              behavior: 'smooth'
            })
          }
          return
        } else if (focusedEducation?.educationIndex !== undefined) {
          sectionSelector = '#education-activities'
        }

        if (sectionSelector) {
          const element = previewRef.current.querySelector(sectionSelector)
          if (element) {
            const container = previewRef.current
            const elementRect = element.getBoundingClientRect()
            const containerRect = container.getBoundingClientRect()
            const scrollTop = container.scrollTop + elementRect.top - containerRect.top - 100

            container.scrollTo({
              top: scrollTop,
              behavior: 'smooth'
            })
          }
        }
      }
    }

    // 렌더링 후 스크롤
    setTimeout(scrollToElement, 50)
  }, [focusedParagraphIndex, focusedEmployment, focusedEducation, activeTab])

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
            onEmploymentFocus={setFocusedEmployment}
            onEducationFocus={setFocusedEducation}
          />
        )}

        {activeTab === 'split' && (
          <div style={{ height: 'calc(100vh - 120px)' }}>
            <Split
              sizes={[30, 70]}
              minSize={320}
              gutterSize={10}
              style={{ display: 'flex', width: '100%', height: '100%' }}
              direction="horizontal"
            >
              <div style={{ height: '100%', overflow: 'auto' }}>
                <EditArea
                  data={data}
                  handleProfileChange={handleProfileChange}
                  handleEmploymentChange={handleEmploymentChange}
                  handleEducationChange={handleEducationChange}
                  onFocusChange={setFocusedParagraphIndex}
                  onEmploymentFocus={setFocusedEmployment}
                  onEducationFocus={setFocusedEducation}
                />
              </div>
              <div ref={previewRef} style={{ height: '100%', overflow: 'auto' }} className="preview-scroll-container">
                <PreviewArea
                  data={data}
                  focusedParagraphIndex={focusedParagraphIndex}
                  focusedEmployment={focusedEmployment}
                  focusedEducation={focusedEducation}
                />
              </div>
            </Split>
          </div>
        )}
        
        {activeTab === 'preview-only' && (
          <PreviewArea
            data={data}
            fullWidth
            focusedParagraphIndex={focusedParagraphIndex}
            focusedEmployment={focusedEmployment}
            focusedEducation={focusedEducation}
          />
        )}
      </div>
      <StyleGuidePin />
    </div>
  )
} 