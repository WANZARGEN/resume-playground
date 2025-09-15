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
  onProfileDoubleClick?: (paragraphIndex: number) => void
  onEmploymentDoubleClick?: (focus: { employmentIndex?: number; detailIndex?: number; itemIndex?: number; subItemIndex?: number }) => void
  onEducationDoubleClick?: (focus: { educationIndex?: number; activityIndex?: number }) => void
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

const PreviewArea = ({
  data,
  fullWidth = false,
  focusedParagraphIndex,
  focusedEmployment,
  focusedEducation,
  onProfileDoubleClick,
  onEmploymentDoubleClick,
  onEducationDoubleClick
}: PreviewAreaProps) => {
  const { selectedFormat } = useEditorUI()

  return (
    <div className={`min-w-[320px] ${fullWidth ? 'min-w-[1000px] mx-auto' : ''}`}>
      <ResumePreview
        data={data}
        format={selectedFormat.id}
        focusedParagraphIndex={focusedParagraphIndex}
        focusedEmployment={focusedEmployment}
        focusedEducation={focusedEducation}
        onProfileDoubleClick={onProfileDoubleClick}
        onEmploymentDoubleClick={onEmploymentDoubleClick}
        onEducationDoubleClick={onEducationDoubleClick}
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
  const editorRef = useRef<HTMLDivElement>(null)

  // Reverse Smart Scroll: 미리보기 더블클릭 시 편집 영역 스크롤
  const handleProfileDoubleClick = (paragraphIndex: number) => {
    // 포커스 설정
    setFocusedParagraphIndex(paragraphIndex)

    // 약간의 딜레이 후 스크롤 및 포커스
    setTimeout(() => {
      if (editorRef.current) {
        // ProfileEditor 내의 특정 paragraph input 찾기
        const paragraphInputs = editorRef.current.querySelectorAll('.profile-paragraph-input')
        if (paragraphInputs[paragraphIndex]) {
          const element = paragraphInputs[paragraphIndex] as HTMLElement
          const container = editorRef.current
          const elementRect = element.getBoundingClientRect()
          const containerRect = container.getBoundingClientRect()

          // 요소가 이미 보이는 영역에 있는지 확인
          const isInView = elementRect.top >= containerRect.top &&
                          elementRect.bottom <= containerRect.bottom

          // 보이지 않을 때만 스크롤
          if (!isInView) {
            const scrollTop = container.scrollTop + elementRect.top - containerRect.top - 50

            container.scrollTo({
              top: scrollTop,
              behavior: 'smooth'
            })
          }

          // 포커스 설정 (스크롤 후)
          setTimeout(() => {
            const input = element.querySelector('textarea') || element
            if (input instanceof HTMLElement) {
              input.focus()
            }
          }, 300)
        }
      }
    }, 50)
  }

  const handleEmploymentDoubleClick = (focus: { employmentIndex?: number; detailIndex?: number; itemIndex?: number; subItemIndex?: number }) => {
    // 포커스 설정
    setFocusedEmployment(focus)

    // 약간의 딜레이 후 스크롤 및 포커스
    setTimeout(() => {
      if (editorRef.current && focus.employmentIndex !== undefined) {
        // EmploymentEditor 내의 특정 셉션 찾기
      const employmentSections = editorRef.current.querySelectorAll('.employment-editor-section')
      if (employmentSections[focus.employmentIndex]) {
        const section = employmentSections[focus.employmentIndex]
        let targetElement: HTMLElement | null = section as HTMLElement

        // 더 구체적인 요소 찾기
        let focusElement: HTMLElement | null = null

        if (focus.detailIndex !== undefined && focus.detailIndex >= 0) {
          const detailSections = section.querySelectorAll('.detail-section')
          if (detailSections[focus.detailIndex]) {
            targetElement = detailSections[focus.detailIndex] as HTMLElement

            if (focus.itemIndex !== undefined) {
              const items = targetElement.querySelectorAll('.work-item-input')
              if (items[focus.itemIndex]) {
                targetElement = items[focus.itemIndex] as HTMLElement
                focusElement = targetElement // 특정 work item input에 직접 포커스
              }
            } else {
              // detail의 제목 input에 포커스
              focusElement = targetElement.querySelector('input[placeholder="업무 제목"]') as HTMLElement
            }
          }
        } else if (focus.detailIndex === -1) {
          // Tech stack section
          const techSection = section.querySelector('.tech-stack-section')
          if (techSection) {
            targetElement = techSection as HTMLElement
            focusElement = techSection.querySelector('input') as HTMLElement
          }
        } else {
          // employment level - 회사명 input에 포커스
          focusElement = section.querySelector('input[placeholder="회사명을 입력하세요"]') as HTMLElement
        }

        const container = editorRef.current
        const elementRect = targetElement.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        // 요소가 이미 보이는 영역에 있는지 확인
        const isInView = elementRect.top >= containerRect.top &&
                        elementRect.bottom <= containerRect.bottom

        // 보이지 않을 때만 스크롤
        if (!isInView) {
          const scrollTop = container.scrollTop + elementRect.top - containerRect.top - 50

          container.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          })
        }

        // 적절한 input에 포커스 (스크롤 후)
        setTimeout(() => {
          if (focusElement) {
            focusElement.focus()
          } else {
            // fallback: 첫 번째 input에 포커스
            const firstInput = targetElement?.querySelector('input, textarea') as HTMLElement
            if (firstInput) {
              firstInput.focus()
            }
          }
        }, 300)
      }
      }
    }, 50)
  }

  const handleEducationDoubleClick = (focus: { educationIndex?: number; activityIndex?: number }) => {
    // 포커스 설정
    setFocusedEducation(focus)

    // 약간의 딜레이 후 스크롤 및 포커스
    setTimeout(() => {
      if (editorRef.current && focus.educationIndex !== undefined) {
        // EducationEditor 내의 특정 셉션 찾기
      const educationSections = editorRef.current.querySelectorAll('.education-editor-section')
      if (educationSections[focus.educationIndex]) {
        const section = educationSections[focus.educationIndex]
        let targetElement: HTMLElement | null = section as HTMLElement

        if (focus.activityIndex !== undefined) {
          const activityInputs = section.querySelectorAll('.activity-item')
          if (activityInputs[focus.activityIndex]) {
            targetElement = activityInputs[focus.activityIndex] as HTMLElement
          }
        }

        const container = editorRef.current
        const elementRect = targetElement.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        // 요소가 이미 보이는 영역에 있는지 확인
        const isInView = elementRect.top >= containerRect.top &&
                        elementRect.bottom <= containerRect.bottom

        // 보이지 않을 때만 스크롤
        if (!isInView) {
          const scrollTop = container.scrollTop + elementRect.top - containerRect.top - 50

          container.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          })
        }

        // 첫 번째 input에 포커스 (스크롤 후)
        setTimeout(() => {
          const firstInput = targetElement?.querySelector('input, textarea') as HTMLElement
          if (firstInput) {
            firstInput.focus()
          }
        }, 300)
      }
      }
    }, 50)
  }

  // Smart Follow: 포커스 변경 시 미리보기 자동 스크롤
  useEffect(() => {
    if (activeTab !== 'split') return
    if (!previewRef.current) return

    // 약간의 딜레이를 주어 DOM 업데이트 후 실행
    const timeoutId = setTimeout(() => {
      if (!previewRef.current) return

      // 하이라이트된 요소를 직접 찾음
      const focusedElement = previewRef.current.querySelector('.focused-item, .focused-paragraph')

      if (focusedElement) {
        const container = previewRef.current
        const elementRect = focusedElement.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()

        // 요소가 이미 보이는 영역에 있는지 확인 (여유 공간 추가)
        const isInView = elementRect.top >= containerRect.top + 50 &&
                        elementRect.bottom <= containerRect.bottom - 50

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
    }, 100) // 100ms 딜레이로 DOM 업데이트 대기

    return () => clearTimeout(timeoutId)
  }, [focusedParagraphIndex, focusedEmployment, focusedEducation, activeTab])

  return (
    <div className="h-full bg-gray-50">
      <div className="h-full max-w-[2400px] mx-auto px-6 py-6">
        {activeTab === 'edit-only' && (
          <div className="h-full overflow-auto">
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
        )}

        {activeTab === 'split' && (
          <div className="h-full">
            <Split
              sizes={[30, 70]}
              minSize={320}
              gutterSize={10}
              style={{ display: 'flex', width: '100%', height: '100%' }}
              direction="horizontal"
            >
              <div ref={editorRef} style={{ height: '100%', overflow: 'auto' }}>
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
                  onProfileDoubleClick={handleProfileDoubleClick}
                  onEmploymentDoubleClick={handleEmploymentDoubleClick}
                  onEducationDoubleClick={handleEducationDoubleClick}
                />
              </div>
            </Split>
          </div>
        )}
        
        {activeTab === 'preview-only' && (
          <div className="h-full overflow-auto">
            <PreviewArea
              data={data}
              fullWidth
              focusedParagraphIndex={focusedParagraphIndex}
              focusedEmployment={focusedEmployment}
              focusedEducation={focusedEducation}
            />
          </div>
        )}
      </div>
      <StyleGuidePin />
    </div>
  )
} 