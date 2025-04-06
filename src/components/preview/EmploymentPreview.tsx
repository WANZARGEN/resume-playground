import { Employment } from '../../types/resume'

interface Props {
  employments: Employment[]
}

export function EmploymentPreview({ employments }: Props) {
  if (!employments?.length) return null

  return (
    <section id="employment-history">
      <h2 className="section-title">Employment History</h2>

      <div className="section-entries">
        {employments.map((employment, index) => (
          <div key={index} className="section-entry">
            <h3 className="section-sub-title">{employment.company}</h3>
            {(employment.position || employment.period) && (
              <div className="meta-info">
                {employment.position && <span>{employment.position}</span>}
                {employment.position && employment.period && <div className="meta-divider" />}
                {employment.period && (
                  <span>
                    {employment.period.start} ― {employment.period.end}
                  </span>
                )}
              </div>
            )}

            <ul className="spec-list">
              {employment.techStack?.length ? (
                <li>
                  <p className="spec-label">사용 기술</p>
                  <div className="spec-content-container">
                    <p className="tech-list">
                      {employment.techStack.map((tech, techIndex) => (
                        <span key={techIndex} className="tech-item">
                          {tech.name}
                        </span>
                      ))}
                    </p>
                  </div>
                </li>
              ) : null}

              {employment.details?.length ? (
                <li>
                  <p className="spec-label">주요 업무</p>
                  <div className="spec-content-container">
                    {employment.details.map((detail, detailIndex) => (
                      <div key={detailIndex}>
                        {detail.title && <p className="work-header">{detail.title}</p>}
                        {detail.description && (
                          <p className="text-gray-600">{detail.description}</p>
                        )}
                        {detail.items?.length && (
                          <ul className="work-list">
                            {detail.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                {item}
                                {detail.subItems?.[itemIndex]?.length && (
                                  <ul className="work-list-nested">
                                    {detail.subItems[itemIndex].map((subItem, subItemIndex) => (
                                      <li key={subItemIndex}>{subItem}</li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </li>
              ) : null}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
} 