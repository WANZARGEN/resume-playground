export interface Contact {
  type: 'email' | 'github'
  value: string
  url?: string
  icon?: string
}

export interface Profile {
  photo: string
  name: string
  position: string
  contacts: Contact[]
  introduction: string
}

export interface TechStack {
  name: string
  highlight?: boolean
}

export interface WorkDetail {
  title: string
  description: string
}

export interface Employment {
  company: string
  position: string
  period: {
    start: string
    end: string
  }
  techStack: TechStack[]
  details: WorkDetail[]
}

export interface Activity {
  type: 'presentation' | 'certificate' | 'education' | 'language'
  title: string
  url?: string
  description?: string
}

export interface Education {
  type: 'presentation' | 'certificate' | 'education' | 'language'
  title: string
  url?: string
  description?: string
  activities?: Activity[]
}

export interface Resume {
  profile: Profile
  employments: Employment[]
  education: Education[]
} 