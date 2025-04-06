import { Fragment } from 'react'
import { Profile } from '../../types/resume'
import { useImageUrl } from '../../hooks/useImageUrl'

interface NameCardProps {
  profile?: Profile
}

export const NameCard: React.FC<NameCardProps> = ({ profile }) => {
  const { getImageUrl } = useImageUrl()
  
  if (!profile) return null

  return (
    <header className="name-card">
      {profile.photo && (
        <img
          src={getImageUrl(profile.photo)}
          alt={`Profile photo of ${profile.name}`}
          className="profile-photo"
        />
      )}
      
      <div className="info">
        <h1 className="name">{profile.name}</h1>
        {profile.position && (
          <p className="position">{profile.position}</p>
        )}

        <hr className="info-divider" />

        {profile.contacts?.length ? (
          <div className="contact-list">
            {profile.contacts.map((contact, index) => (
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
  )
} 