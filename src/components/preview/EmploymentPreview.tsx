import { Employment } from '../../types/resume'
import { formatPeriodWithDuration } from '../../utils/dateUtils'

interface Props {
  employments: Employment[]
  focusedEmployment?: { employmentIndex?: number; detailIndex?: number; itemIndex?: number; subItemIndex?: number } | null
  onDoubleClick?: (focus: { employmentIndex?: number; detailIndex?: number; itemIndex?: number; subItemIndex?: number }) => void
}

export function EmploymentPreview({ employments, focusedEmployment, onDoubleClick }: Props) {
  if (!employments?.length) return null

  return (
    <section id="employment-history">
      <h2 className="section-title">Employment History</h2>

      <div className="section-entries">
        {employments.map((employment, index) => {
          const isEmploymentFocused = focusedEmployment?.employmentIndex === index &&
                                     focusedEmployment?.detailIndex === undefined &&
                                     focusedEmployment?.itemIndex === undefined

          return (
            <div
              key={index}
              className={`section-entry ${isEmploymentFocused ? 'focused-item' : ''}`}
              onDoubleClick={() => onDoubleClick?.({ employmentIndex: index })}
            >
              <h3 className="section-sub-title">{employment.company}</h3>
              {(employment.position || employment.period) && (
                <div className="meta-info">
                {employment.position && <span>{employment.position}</span>}
                {employment.position && employment.period && <div className="meta-divider" />}
                {employment.period && (
                  <span>
                    {formatPeriodWithDuration(employment.period.start, employment.period.end)}
                  </span>
                )}
              </div>
            )}

            <ul className="spec-list">
              {employment.techStack?.length ? (
                <li
                  className={focusedEmployment?.employmentIndex === index && focusedEmployment?.detailIndex === -1 ? 'focused-item' : ''}
                  onDoubleClick={(e) => {
                    e.stopPropagation()
                    onDoubleClick?.({ employmentIndex: index, detailIndex: -1 })
                  }}
                    >
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
                    {employment.details.map((detail, detailIndex) => {
                      const isDetailFocused = focusedEmployment?.employmentIndex === index &&
                                            focusedEmployment?.detailIndex === detailIndex &&
                                            focusedEmployment?.itemIndex === undefined

                      return (
                        <div
                          key={detailIndex}
                          className={isDetailFocused ? 'focused-item' : ''}
                          onDoubleClick={(e) => {
                            e.stopPropagation()
                            onDoubleClick?.({ employmentIndex: index, detailIndex })
                          }}
                                    >
                          <p className="work-header">{detail.title}</p>
                          <ul className="work-list">
                            {detail.items?.map((item, itemIndex) => {
                            // Safe handling of item data
                            if (!item) return null;

                            const isItemFocused = focusedEmployment?.employmentIndex === index &&
                                                focusedEmployment?.detailIndex === detailIndex &&
                                                focusedEmployment?.itemIndex === itemIndex

                            return (
                              <li
                                key={itemIndex}
                                className={isItemFocused ? 'focused-item' : ''}
                                onDoubleClick={(e) => {
                                  e.stopPropagation()
                                  onDoubleClick?.({ employmentIndex: index, detailIndex, itemIndex })
                                }}
                                                >
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
                                    {item.subItems.map((subItem, subItemIndex) => {
                                      const isSubItemFocused = focusedEmployment?.employmentIndex === index &&
                                                              focusedEmployment?.detailIndex === detailIndex &&
                                                              focusedEmployment?.itemIndex === itemIndex &&
                                                              focusedEmployment?.subItemIndex === subItemIndex

                                      return (
                                        <li
                                          key={subItemIndex}
                                          className={isSubItemFocused ? 'focused-item' : ''}
                                          onDoubleClick={(e) => {
                                            e.stopPropagation()
                                            onDoubleClick?.({ employmentIndex: index, detailIndex, itemIndex, subItemIndex })
                                          }}
                                                                    >
                                          {subItem}
                                        </li>
                                      )
                                    })}
                                  </ul>
                                )}
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )
                  })}
                  </div>
                </li>
              ) : null}
            </ul>
          </div>
          )
        })}
      </div>
    </section>
  )
} 