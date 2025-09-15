import { Profile, TextStyle } from '../../types/resume'

interface Props {
  profile: Profile
  focusedParagraphIndex?: number | null
}

function StyledText({ style }: { style: TextStyle }) {
  const { type = 'normal', text = '', href } = style
  
  switch (type) {
    case 'emphasis':
      return <span className="text-emphasis">{text}</span>
    case 'accent':
      return <span className="text-accent">{text}</span>
    case 'highlight':
      return <span className="text-highlight">{text}</span>
    case 'link':
      return <a href={href} className="text-link" target="_blank" rel="noopener noreferrer">{text}</a>
    default:
      return <>{text}</>
  }
}

export default function ProfilePreview({ profile, focusedParagraphIndex }: Props) {
  if (!profile.paragraphs?.length) return null

  return (
    <section id="profile" className="text-gray-800">
      <h2 className="section-title">Profile</h2>
      <article className="space-y-4 text-gray-700">
        {profile.paragraphs.map((paragraph, index) => (
          <div
            key={index}
            className={focusedParagraphIndex === index ? 'focused-paragraph' : ''}
          >
            <p className="paragraph">
              {paragraph.segments?.map((segment, sIndex) => (
                <StyledText key={sIndex} style={segment} />
              ))}
            </p>
          </div>
        ))}
      </article>
    </section>
  )
} 