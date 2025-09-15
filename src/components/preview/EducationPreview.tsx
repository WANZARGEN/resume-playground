import { Education } from '../../types/resume'

interface Props {
  education: Education[]
  focusedEducation?: { educationIndex?: number; activityIndex?: number } | null
  onDoubleClick?: (focus: { educationIndex?: number; activityIndex?: number }) => void
}

export function EducationPreview({ education, focusedEducation, onDoubleClick }: Props) {
  if (!education?.length) return null

  const sections: Record<string, { title: string; items: { education: Education; originalIndex: number }[] }> = {
    presentation: { title: 'Presentations & Seminars', items: [] },
    certificate: { title: 'Certificates', items: [] },
    education: { title: 'Education', items: [] },
    language: { title: 'Language Proficiency', items: [] },
  }

  // 각 항목을 해당 섹션에 분류 (원본 인덱스 유지)
  education.forEach((item, index) => {
    if (item?.type && item.type in sections && Array.isArray(item.items)) {
      sections[item.type].items.push({ education: item, originalIndex: index })
    }
  })

  return (
    <section id="education-activities">
      <h2 className="section-title">Education & Activities</h2>

      {/* 항목이 있는 섹션만 렌더링 */}
      {Object.entries(sections).map(([key, section]) => {
        if (!section.items.length) return null

        return (
          <div key={key} className="section-entry">
            <h3 className="section-sub-title">{section.title}</h3>
            <ul className="spec-list">
              <li>
                <div className="spec-content-container">
                  <ul className="work-list">
                    {section.items.map(({ education: item, originalIndex }) => (
                      item.items.map((activity, itemIndex) => {
                        const isFocused = focusedEducation?.educationIndex === originalIndex &&
                                        focusedEducation?.activityIndex === itemIndex

                        return (
                          <li
                            key={itemIndex}
                            className={isFocused ? 'focused-item' : ''}
                            onDoubleClick={() => onDoubleClick?.({ educationIndex: originalIndex, activityIndex: itemIndex })}
                          >
                          {activity.title && (
                            (activity.url || activity.link) ? (
                              <a
                                href={activity.url || activity.link}
                                className="text-link"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {activity.title}
                              </a>
                            ) : (
                              activity.title
                            )
                          )}
                          {activity.description && ` - ${activity.description}`}
                        </li>
                        )
                      })
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        )
      })}
    </section>
  )
} 