import { Education } from '../../types/resume'

interface Props {
  education: Education[]
}

export function EducationPreview({ education }: Props) {
  if (!education?.length) return null

  const sections: Record<string, { title: string; items: Education[] }> = {
    presentation: { title: 'Presentations & Seminars', items: [] },
    certificate: { title: 'Certificates', items: [] },
    education: { title: 'Education', items: [] },
    language: { title: 'Language Proficiency', items: [] },
  }

  // 각 항목을 해당 섹션에 분류
  education.forEach((item) => {
    if (item?.type && item.type in sections && Array.isArray(item.items)) {
      sections[item.type].items.push(item)
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
                    {section.items.map((item) => (
                      item.items.map((activity, itemIndex) => (
                        <li key={itemIndex}>
                          {activity.title && (
                            activity.url ? (
                              <a
                                href={activity.url}
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
                      ))
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