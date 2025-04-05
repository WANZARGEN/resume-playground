import { Contact, Profile } from '../../types/resume'

interface Props {
  data: Profile
  onChange: (data: Profile) => void
}

export default function ProfileEditor({ data, onChange }: Props) {
  const handleChange = (field: keyof Profile, value: any) => {
    onChange({ ...data, [field]: value })
  }

  const handleContactAdd = () => {
    onChange({
      ...data,
      contacts: [
        ...data.contacts,
        {
          type: 'email',
          value: '',
        },
      ],
    })
  }

  const handleContactRemove = (index: number) => {
    onChange({
      ...data,
      contacts: data.contacts.filter((_, i) => i !== index),
    })
  }

  const handleContactChange = (index: number, field: keyof Contact, value: any) => {
    onChange({
      ...data,
      contacts: data.contacts.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      ),
    })
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
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          프로필 사진
        </label>
        <div className="flex items-center gap-4">
          {data.photo && (
            <img
              src={data.photo}
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
        <input
          type="text"
          value={data.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">직위</label>
        <input
          type="text"
          value={data.position}
          onChange={(e) => handleChange('position', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">연락처</label>
          <button
            type="button"
            onClick={handleContactAdd}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            추가
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {data.contacts.map((contact, index) => (
            <div key={index} className="flex gap-2">
              <select
                value={contact.type}
                onChange={(e) =>
                  handleContactChange(index, 'type', e.target.value)
                }
                className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="email">이메일</option>
                <option value="github">GitHub</option>
              </select>
              <input
                type="text"
                value={contact.value}
                onChange={(e) =>
                  handleContactChange(index, 'value', e.target.value)
                }
                className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder={
                  contact.type === 'email'
                    ? 'example@email.com'
                    : 'github.com/username'
                }
              />
              <button
                type="button"
                onClick={() => handleContactRemove(index)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          자기소개
        </label>
        <textarea
          value={data.introduction}
          onChange={(e) => handleChange('introduction', e.target.value)}
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  )
} 