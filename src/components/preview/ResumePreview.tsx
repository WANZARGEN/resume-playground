import { Fragment } from 'react'
import { Resume } from '../../types/resume'
import { ProfilePreview } from './ProfilePreview'
import { EmploymentPreview } from './EmploymentPreview'
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
        {data.profile?.photo && (
          <img
            src={data.profile.photo}
            alt={`Profile photo of ${data.profile.name}`}
            className="profile-photo"
          />
        )}
        
        <div className="info">
          <h1 className="name">{data.profile?.name}</h1>
          {data.profile?.position && (
            <p className="position">{data.profile.position}</p>
          )}

          <hr className="info-divider" />

          {data.profile?.contacts?.length ? (
            <div className="contact-list">
              {data.profile.contacts.map((contact, index) => (
                <Fragment key={contact.type}>
                  {index > 0 && <div className="contact-divider" />}
                  <a
                    href={contact.url || contact.value}
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
          ) : null}
        </div>
      </header>

      <main className="p-8 pb-12 space-y-8">
        {/* Profile */}
        {data.profile && <ProfilePreview profile={data.profile} />}

        <hr className="section-divider" />

        {/* Employment History */}
        {data.employments?.length && (
          <>
            <EmploymentPreview employments={data.employments} />
            <hr className="section-divider" />
          </>
        )}

        {/* Education & Activities */}
        {data.education?.length ? (
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
                if (item.type && item.type in sections) {
                  sections[item.type].items.push(item)
                }
              })

              // 항목이 있는 섹션만 렌더링
              return Object.entries(sections).map(([key, section]) => {
                if (!section.items.length) return null

                return (
                  <div key={key} className="section-entry">
                    <h3 className="section-sub-title">{section.title}</h3>
                    <ul className="spec-list">
                      <li>
                        <div className="spec-content-container">
                          <ul className="work-list">
                            {section.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                {item.title && (
                                  item.url ? (
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
                                  )
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
        ) : null}
      </main>
    </div>
  )
} 