import { Fragment } from 'react'
import { Resume } from '../../types/resume'
import { ProfilePreview } from './ProfilePreview'
import { EmploymentPreview } from './EmploymentPreview'
import { EducationPreview } from './EducationPreview'
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
            src={data.profile.photo.startsWith('http') ? data.profile.photo : `${import.meta.env.BASE_URL}${data.profile.photo}`}
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
        {!!data.employments?.length && (
          <>
            <EmploymentPreview employments={data.employments} />
            <hr className="section-divider" />
          </>
        )}

        {/* Education & Activities */}
        {!!data.education?.length && (
          <>
            <EducationPreview education={data.education} />
            <hr className="section-divider" />
          </>
        )}
      </main>
    </div>
  )
} 