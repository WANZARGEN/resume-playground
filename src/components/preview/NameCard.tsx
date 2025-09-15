import { Fragment } from 'react'
import { Profile } from '../../types/resume'
import { useImageUrl } from '../../hooks/useImageUrl'
import { parseMarkdownText } from '../../utils/markdownParser'

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
        <h1 className="name">
          {profile.name && parseMarkdownText(profile.name).map((segment, segIndex) => {
            if (segment.type === 'link') {
              return (
                <a
                  key={segIndex}
                  href={segment.url}
                  className="text-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {segment.text}
                </a>
              )
            } else if (segment.type === 'emphasis') {
              return <span key={segIndex} className="text-emphasis">{segment.text}</span>
            } else if (segment.type === 'accent') {
              return <span key={segIndex} className="text-accent">{segment.text}</span>
            } else if (segment.type === 'highlight') {
              return <span key={segIndex} className="text-highlight">{segment.text}</span>
            }
            return <span key={segIndex}>{segment.text}</span>
          })}
        </h1>
        {profile.position && (
          <p className="position">
            {parseMarkdownText(profile.position).map((segment, segIndex) => {
              if (segment.type === 'link') {
                return (
                  <a
                    key={segIndex}
                    href={segment.url}
                    className="text-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {segment.text}
                  </a>
                )
              } else if (segment.type === 'emphasis') {
                return <span key={segIndex} className="text-emphasis">{segment.text}</span>
              } else if (segment.type === 'accent') {
                return <span key={segIndex} className="text-accent">{segment.text}</span>
              } else if (segment.type === 'highlight') {
                return <span key={segIndex} className="text-highlight">{segment.text}</span>
              }
              return <span key={segIndex}>{segment.text}</span>
            })}
          </p>
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