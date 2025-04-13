import React, { ChangeEvent } from 'react'
import { Contact, Profile, TextStyle } from '../../types/resume'
import { Button } from '../common/Button'
import { TextInput } from '../common/TextInput'
import { Select } from '../common/Select'
import { useImageUrl } from '../../hooks/useImageUrl'
import { AutoCompleteEditor } from '../common/AutoCompleteEditor'

interface ProfileEditorProps {
  data?: Profile;
  onChange: (profile: Profile) => void;
}

function parseText(text: string): TextStyle[] {
  const segments: TextStyle[] = []
  
  const patterns = [
    { regex: /\*\*(.+?)\*\*/g, type: 'emphasis' as const },
    { regex: /\#\#(.+?)\#\#/g, type: 'accent' as const },
    { regex: /\`(.+?)\`/g, type: 'highlight' as const },
    { regex: /\[(.+?)\]\((.+?)\)/g, type: 'link' as const },
  ]

  // 먼저 특수 패턴 위치를 모두 찾아서 정렬
  const matches: Array<{ start: number; end: number; content: string; type: TextStyle['type']; href?: string }> = []
  
  patterns.forEach(({ regex, type }) => {
    let match
    while ((match = regex.exec(text)) !== null) {
      if (type === 'link') {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          content: match[1],
          type,
          href: match[2]
        })
      } else {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          content: match[1],
          type
        })
      }
    }
  })

  // 시작 위치 기준으로 정렬
  matches.sort((a, b) => a.start - b.start)

  // 텍스트 파싱
  let lastIndex = 0
  matches.forEach(match => {
    // 이전 일반 텍스트 추가
    if (match.start > lastIndex) {
      segments.push({
        type: 'normal',
        text: text.substring(lastIndex, match.start)
      })
    }
    
    // 스타일 적용된 텍스트 추가
    segments.push({
      type: match.type,
      text: match.content,
      ...(match.href ? { href: match.href } : {})
    })
    
    lastIndex = match.end
  })

  // 마지막 일반 텍스트 추가
  if (lastIndex < text.length) {
    segments.push({
      type: 'normal',
      text: text.substring(lastIndex)
    })
  }

  return segments
}

function stringifySegments(segments: TextStyle[] = []): string {
  return segments.map(segment => {
    const { type = 'normal', text = '', href } = segment
    switch (type) {
      case 'emphasis':
        return `**${text}**`
      case 'accent':
        return `##${text}##`
      case 'highlight':
        return `\`${text}\``
      case 'link':
        return `[${text}](${href})`
      default:
        return text
    }
  }).join('')
}

const contactTypes = [
  { value: 'email', label: '이메일' },
  { value: 'github', label: 'GitHub' }
]

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ data, onChange }) => {
  const { getImageUrl } = useImageUrl()
  
  const emptyProfile: Profile = {
    photo: '',
    name: '',
    position: '',
    contacts: [],
    paragraphs: []
  };
  
  const profile = data || emptyProfile;

  const handleChange = (field: keyof Profile, value: any) => {
    onChange({
      ...profile,
      [field]: value
    })
  }

  const handleParagraphChange = (index: number, text: string) => {
    const segments = parseText(text)
    const newParagraphs = [...(profile.paragraphs || [])]
    newParagraphs[index] = { segments }
    handleChange('paragraphs', newParagraphs)
  }

  const addParagraph = () => {
    const newParagraphs = [...(profile.paragraphs || []), { segments: [{ type: 'normal', text: '' }] }]
    handleChange('paragraphs', newParagraphs)
  }

  const removeParagraph = (index: number) => {
    const newParagraphs = [...(profile.paragraphs || [])]
    newParagraphs.splice(index, 1)
    handleChange('paragraphs', newParagraphs)
  }

  const handleContactChange = (index: number, field: keyof Contact, value: Contact[keyof Contact]) => {
    const newContacts = [...(profile.contacts || [])]
    newContacts[index] = { ...newContacts[index], [field]: value }
    handleChange('contacts', newContacts)
  }

  const addContact = () => {
    const newContacts = [...(profile.contacts || []), { type: 'email' }]
    handleChange('contacts', newContacts)
  }

  const removeContact = (index: number) => {
    const newContacts = [...(profile.contacts || [])]
    newContacts.splice(index, 1)
    handleChange('contacts', newContacts)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      handleChange('photo', reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handlePhotoDelete = () => {
    handleChange('photo', '')
    // 파일 입력 필드 초기화
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">기본 정보</h2>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            프로필 사진
          </label>
          <div className="flex items-center gap-4">
            {profile.photo && (
              <div className="relative group">
                <img
                  src={getImageUrl(profile.photo)}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="absolute -top-3 -right-3">
                  <Button
                    onClick={handlePhotoDelete}
                    variant="danger"
                    size="sm"
                    className="rounded-full w-7 h-7 flex items-center justify-center !p-0"
                  >
                    <span className="sr-only">프로필 사진 삭제</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </div>
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
          <TextInput
            value={profile.name || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
            placeholder="이름을 입력하세요"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">직무</label>
          <TextInput
            value={profile.position || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('position', e.target.value)}
            placeholder="직무를 입력하세요"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">연락처</label>
            <Button onClick={addContact} variant="secondary" size="sm">
              연락처 추가
            </Button>
          </div>
          <div className="space-y-4">
            {(profile.contacts || []).map((contact, index) => (
              <div key={index} className="relative bg-gray-50 rounded-lg p-4">
                <div className="flex gap-2">
                  <Select
                    value={contact.type || 'email'}
                    onChange={(value) => handleContactChange(index, 'type', value as Contact['type'])}
                    options={contactTypes}
                    placeholder="연락처 유형"
                    size="sm"
                    className="min-w-24"
                  />
                  <TextInput
                    value={contact.value || ''}
                    onChange={(e) => handleContactChange(index, 'value', e.target.value as Contact[keyof Contact])}
                    placeholder={contact.type === 'email' ? '이메일 주소' : 'GitHub 사용자명'}
                    wrapperClassName="grow"
                    inputSize="sm"
                  />
                  <Button className="shrink-0" onClick={() => removeContact(index)} variant="ghost" size="sm">
                    삭제
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">프로필</label>
            <Button onClick={addParagraph} variant="secondary" size="sm">
              단락 추가
            </Button>
          </div>
          <div className="space-y-4">
            {(profile.paragraphs || []).map((paragraph, index) => (
              <div key={index} className="relative bg-gray-50 rounded-lg p-4">
                <AutoCompleteEditor
                  value={stringifySegments(paragraph.segments)}
                  onChange={(text) => handleParagraphChange(index, text)}
                  placeholder="텍스트를 입력하세요"
                  className="mb-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={() => removeParagraph(index)}
                    disabled={(profile.paragraphs?.length || 0) <= 1}
                    variant="ghost"
                    size="sm"
                  >
                    단락 삭제
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 