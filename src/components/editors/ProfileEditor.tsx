import React, { ChangeEvent } from 'react'
import { Contact, Profile, TextStyle } from '../../types/resume'
import { Button } from '../common/Button'
import { TextInput } from '../common/TextInput'
import { TextArea } from '../common/TextArea'

interface ProfileEditorProps {
  data?: Profile;
  onChange: (profile: Profile) => void;
}

function parseText(text: string): TextStyle[] {
  const segments: TextStyle[] = []
  let currentText = ''
  
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

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ data, onChange }) => {
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

  return (
    <div className="space-y-4">

<div>
        <label className="block text-sm font-medium text-gray-700">
          프로필 사진
        </label>
        <div className="flex items-center gap-4">
          {profile.photo && (
            <img
              src={profile.photo}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
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
        <label className="block text-sm font-medium text-gray-700">이름</label>
        <TextInput
          value={profile.name || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
          placeholder="이름을 입력하세요"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">직무</label>
        <TextInput
          value={profile.position || ''}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange('position', e.target.value)}
          placeholder="직무를 입력하세요"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">연락처</label>
        <div className="space-y-4">
          {(profile.contacts || []).map((contact, index) => (
            <div key={index} className="flex gap-4">
              <select
                value={contact.type || 'email'}
                onChange={(e) => handleContactChange(index, 'type', e.target.value as Contact['type'])}
                className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="email">이메일</option>
                <option value="github">GitHub</option>
              </select>
              <TextInput
                value={contact.value || ''}
                onChange={(e) => handleContactChange(index, 'value', e.target.value as Contact[keyof Contact])}
                placeholder={contact.type === 'email' ? '이메일 주소' : 'GitHub 사용자명'}
                className="flex-1"
              />
              <Button onClick={() => removeContact(index)} variant="danger">
                삭제
              </Button>
            </div>
          ))}
        </div>
        <Button onClick={addContact} className="mt-4">
          연락처 추가
        </Button>
      </div>


      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">텍스트 스타일 가이드</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li><code>**텍스트**</code> - 강조 텍스트</li>
          <li><code>##텍스트##</code> - 보조 강조</li>
          <li><code>`텍스트`</code> - 하이라이트</li>
          <li><code>[텍스트](URL)</code> - 링크</li>
        </ul>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">프로필</label>
        <div className="space-y-4">
          {(profile.paragraphs || []).map((paragraph, index) => (
            <div key={index} className="relative p-4 border rounded-lg">
              <TextArea
                value={stringifySegments(paragraph.segments)}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleParagraphChange(index, e.target.value)}
                placeholder="텍스트를 입력하세요"
                className="mb-2"
              />
              <div className="flex justify-end">
                <Button
                  onClick={() => removeParagraph(index)}
                  disabled={(profile.paragraphs?.length || 0) <= 1}
                  variant="danger"
                >
                  단락 삭제
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={addParagraph} className="mt-4">
          단락 추가
        </Button>
      </div>
    </div>
  )
} 