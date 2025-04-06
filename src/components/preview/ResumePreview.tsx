import { Fragment } from 'react'
import { Resume } from '../../types/resume'
import '../../styles/resume-preview.css'

interface Props {
  data: Resume
}

export default function ResumePreview({ data }: Props) {
  if (!data) return null

  return (
    <div className="resume-preview">
      {/* 네임카드 */}
      <header className="name-card">
        {data.profile.photo && (
          <img
            src={data.profile.photo}
            alt={`Profile photo of ${data.profile.name}`}
            className="profile-photo"
          />
        )}
        
        <div className="info">
          <h1 className="name">{data.profile.name}</h1>
          <p className="position">{data.profile.position}</p>

          <hr className="info-divider" />

          <div className="contact-list">
            {(data.profile.contacts || []).map((contact, index) => (
              <Fragment key={contact.type}>
                {index > 0 && <div className="contact-divider" />}
                <a
                  href={contact.value}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contact.type === 'email' ? (
                    <span>✉️</span>
                  ) : contact.type === 'github' ? (
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                      alt="GitHub icon"
                    />
                  ) : null}
                  <span>{contact.value}</span>
                </a>
              </Fragment>
            ))}
          </div>
        </div>
      </header>

      <main className="p-8 pb-12 space-y-8">
        {/* Profile */}
        {data.profile.introduction && (
          <>
            <section id="profile" className="text-gray-800">
              <h2 className="section-title">Profile</h2>
              <article className="space-y-4 text-gray-700">
                <p className="paragraph whitespace-pre-wrap">
                  {data.profile.introduction}
                </p>
              </article>
            </section>

            <hr className="section-divider" />
          </>
        )}

        {/* Employment History */}
        {(data.employments || []).length > 0 && (
          <>
            <section id="employment-history">
              <h2 className="section-title">Employment History</h2>

              <div className="section-entries">
                {data.employments.map((employment, index) => (
                  <div key={index} className="section-entry">
                    <h3 className="section-sub-title">{employment.company}</h3>
                    <div className="meta-info">
                      <span>{employment.position}</span>
                      <div className="meta-divider" />
                      <span>
                        {employment.period.start} ― {employment.period.end}
                      </span>
                    </div>

                    <ul className="spec-list">
                      {(employment.techStack || []).length > 0 && (
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
                      )}

                      {(employment.details || []).length > 0 && (
                        <li>
                          <p className="spec-label">주요 업무</p>
                          <div className="spec-content-container">
                            {employment.details.map((detail, detailIndex) => (
                              <div key={detailIndex}>
                                <p className="work-header">{detail.title}</p>
                                <p className="text-gray-600">
                                  {detail.description}
                                </p>
                              </div>
                            ))}
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <hr className="section-divider" />
          </>
        )}

        {/* Education & Activities */}
        {(data.education || []).length > 0 && (
          <section id="education-activities">
            <h2 className="section-title">Education & Activities</h2>

            {(() => {
              const sections: Record<string, { title: string; items: typeof data.education }> = {
                presentation: { title: 'Presentations & Seminars', items: [] as typeof data.education },
                certificate: { title: 'Certificates', items: [] as typeof data.education },
                education: { title: 'Education', items: [] as typeof data.education },
                language: { title: 'Language Proficiency', items: [] as typeof data.education },
              }

              // 각 항목을 해당 섹션에 분류
              data.education.forEach((item) => {
                if (item.type in sections) {
                  sections[item.type].items.push(item)
                }
              })

              // 항목이 있는 섹션만 렌더링
              return Object.entries(sections).map(([key, section]) => {
                if (section.items.length === 0) return null

                return (
                  <div key={key} className="section-entry">
                    <h3 className="section-sub-title">{section.title}</h3>
                    <ul className="spec-list">
                      <li>
                        <div className="spec-content-container">
                          <ul className="work-list">
                            {section.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                {item.url ? (
                                  <a
                                    href={item.url}
                                    className="text-link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {item.title}
                                  </a>
                                ) : (
                                  item.title
                                )}
                                {item.description && ` - ${item.description}`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </div>
                )
              })
            })()}
          </section>
        )}
      </main>
    </div>
  )
} 