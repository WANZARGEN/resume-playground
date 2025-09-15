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
                          {tech.highlight ? (
                            <span className="text-highlight">{tech.name}</span>
                          ) : (
                            tech.name
                          )}
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
                        <p className="work-header">{detail.title}</p>
                        <ul className="work-list">
                          {detail.items?.map((item, itemIndex) => {
                            // Safe handling of item data
                            if (!item) return null;

                            return (
                              <li key={itemIndex}>
                                {item.segments && Array.isArray(item.segments) && item.segments.length > 0 ? (
                                  item.segments.map((segment, segIndex) => {
                                    if (!segment) return null;
                                    if (segment.type === 'link') {
                                      return (
                                        <a
                                          key={segIndex}
                                          href={segment.url || segment.href}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline"
                                        >
                                          {segment.text}
                                        </a>
                                      )
                                    }
                                    return <span key={segIndex}>{segment.text}</span>
                                  })
                                ) : (
                                  item.text || ''
                                )}
                                {Array.isArray(item.subItems) && item.subItems.length > 0 && (
                                  <ul className="work-list-nested">
                                    {item.subItems.map((subItem, subItemIndex) => (
                                      <li key={subItemIndex}>{subItem}</li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            )
                          })}
                        </ul>
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