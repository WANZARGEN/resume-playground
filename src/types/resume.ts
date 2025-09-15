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
  url?: string  // For link type
}

export interface Paragraph {
  segments?: TextStyle[]
}

export interface Profile {
  photo?: string
  name?: string
  position?: string
  contacts?: Contact[]
  paragraphs?: (Paragraph | string)[]  // Can be either segments object or markdown string
}

export interface TechStack {
  name?: string
  highlight?: boolean
}

export interface WorkItem {
  text?: string  // Can contain markdown syntax
  segments?: TextStyle[]  // For rich text with links (legacy)
  subItems?: string[]
}

export interface WorkDetail {
  title: string | TextSegment[]
  items: WorkItem[]
}

export interface Activity {
  title: string
  description?: string
  link?: string
  url?: string
  date?: string  // Format: "YYYY" or "YYYY.MM"
}

export interface Education {
  type?: 'presentation' | 'certificate' | 'education' | 'language'
  items?: Activity[]
  school?: string
  degree?: string
  startDate?: string
  endDate?: string
  description?: string
}

export interface Employment {
  company: string
  position: string
  period?: {
    start: string
    end?: string
  }
  techStack?: TechStack[]
  details?: WorkDetail[]
}

export interface ResumeContext {
  employments?: Employment[]
  education?: Education[]
}

export interface Resume {
  profile?: Profile
  employments?: Employment[]
  education?: Education[]
} 