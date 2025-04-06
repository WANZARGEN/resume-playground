export interface Contact {
  type?: 'email' | 'github'
  value?: string
  url?: string
  icon?: string
}

export interface TextStyle {
  type?: 'normal' | 'emphasis' | 'accent' | 'highlight' | 'link'
  text?: string
  href?: string
}

export interface Paragraph {
  segments?: TextStyle[]
}

export interface Profile {
  photo?: string
  name?: string
  position?: string
  contacts?: Contact[]
  paragraphs?: Paragraph[]
}

export interface TechStack {
  name?: string
  highlight?: boolean
}

export interface WorkDetail {
  title?: string
  description?: string
  details?: string[]
}

export interface Employment {
  company?: string
  position?: string
  period?: {
    start?: string
    end?: string
  }
  techStack?: TechStack[]
  details?: WorkDetail[]
}

export interface Activity {
  title?: string
  url?: string
  description?: string
}

export interface Education {
  type?: 'presentation' | 'certificate' | 'education' | 'language'
  title?: string
  url?: string
  description?: string
}

export interface Resume {
  profile?: Profile
  employments?: Employment[]
  education?: Education[]
} 