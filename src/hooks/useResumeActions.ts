import { useCallback } from 'react'
import { Resume, Profile, Employment, Education } from '../types/resume'
import { useResumeData } from '../contexts/ResumeDataContext'

export function useResumeActions() {
  const { data, setData } = useResumeData()

  const handleProfileChange = useCallback((profile: Profile) => {
    setData((prev: Resume): Resume => ({
      ...prev,
      profile,
    }))
  }, [setData])

  const handleEmploymentChange = useCallback((employments: Employment[]) => {
    setData((prev: Resume): Resume => ({
      ...prev,
      employments,
    }))
  }, [setData])

  const handleEducationChange = useCallback((education: Education[]) => {
    setData((prev: Resume): Resume => ({
      ...prev,
      education,
    }))
  }, [setData])

  const handlePhotoChange = useCallback((photo: string) => {
    setData((prev: Resume): Resume => ({
      ...prev,
      profile: {
        ...prev.profile,
        photo,
      },
    }))
  }, [setData])

  const handleContactsChange = useCallback((contacts: string[]) => {
    setData((prev: Resume): Resume => ({
      ...prev,
      profile: {
        ...prev.profile,
        contacts,
      },
    }))
  }, [setData])

  return {
    data,
    handleProfileChange,
    handleEmploymentChange,
    handleEducationChange,
    handlePhotoChange,
    handleContactsChange,
  }
} 