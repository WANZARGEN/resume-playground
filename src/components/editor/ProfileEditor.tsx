import React from 'react'
import { Profile, TextStyle, Paragraph } from '../../types/resume'
import { Button } from '../common/Button'
import { TextInput } from '../common/TextInput'
import { TextArea } from '../common/TextArea'

interface Props {
  profile: Profile
  onChange: (profile: Profile) => void
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

function stringifySegments(segments: TextStyle[]): string {
  return segments.map(segment => {
    switch (segment.type) {
      case 'emphasis':
        return `**${segment.text}**`
      case 'accent':
        return `##${segment.text}##`
      case 'highlight':
        return `\`${segment.text}\``
      case 'link':
        return `[${segment.text}](${segment.href})`
      default:
        return segment.text
    }
  }).join('')
}

export function ProfileEditor({ profile, onChange }: Props) {
  const handleParagraphChange = (index: number, text: string) => {
    const segments = parseText(text)
    const newParagraphs = [...profile.paragraphs]
    newParagraphs[index] = { segments }
    onChange({
      ...profile,
      paragraphs: newParagraphs,
    })
  }

  const addParagraph = () => {
    onChange({
      ...profile,
      paragraphs: [...profile.paragraphs, { segments: [{ type: 'normal', text: '' }] }],
    })
  }

  const removeParagraph = (index: number) => {
    const newParagraphs = [...profile.paragraphs]
    newParagraphs.splice(index, 1)
    onChange({
      ...profile,
      paragraphs: newParagraphs,
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">이름</label>
        <TextInput
          value={profile.name}
          onChange={(e) => onChange({ ...profile, name: e.target.value })}
          placeholder="이름을 입력하세요"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">직무</label>
        <TextInput
          value={profile.position}
          onChange={(e) => onChange({ ...profile, position: e.target.value })}
          placeholder="직무를 입력하세요"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">프로필</label>
        <div className="space-y-4">
          {profile.paragraphs.map((paragraph, index) => (
            <div key={index} className="relative p-4 border rounded-lg">
              <TextArea
                value={stringifySegments(paragraph.segments)}
                onChange={(e) => handleParagraphChange(index, e.target.value)}
                placeholder="텍스트를 입력하세요"
                className="mb-2"
              />
              <div className="flex justify-end">
                <Button
                  onClick={() => removeParagraph(index)}
                  disabled={profile.paragraphs.length === 1}
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

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">텍스트 스타일 가이드</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li><code>**텍스트**</code> - 강조 텍스트</li>
          <li><code>##텍스트##</code> - 보조 강조</li>
          <li><code>`텍스트`</code> - 하이라이트</li>
          <li><code>[텍스트](URL)</code> - 링크</li>
        </ul>
      </div>
    </div>
  )
} 