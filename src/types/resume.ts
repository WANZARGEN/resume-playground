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
  paragraphs?: Paragraph[]
}

export interface TechStack {
  name?: string
  highlight?: boolean
}

export interface WorkItem {
  text?: string
  segments?: TextStyle[]  // For rich text with links
  subItems?: string[]
}

export interface WorkDetail {
  title: string
  items: WorkItem[]
}

export interface Activity {
  title: string
  description?: string
}

export interface Education {
  type?: 'presentation' | 'certificate' | 'education' | 'language'
  items?: Activity[]
  school: string
  degree: string
  startDate: string
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
  techStack?: {
    name: string
    level?: number
  }[]
  details?: {
    title: string
    items: {
      text: string
      subItems?: string[]
    }[]
  }[]
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