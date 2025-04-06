import { Contact } from '../../types/resume';
import { Button } from '../common/Button';
import { TextInput } from '../common/TextInput';
import { Select } from '../common/Select';

interface ContactEditorProps {
  data?: Contact[];
  onChange: (contacts: Contact[]) => void;
}

const CONTACT_TYPES = [
  { value: 'email', label: '이메일' },
  { value: 'phone', label: '전화번호' },
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'blog', label: '블로그' },
  { value: 'homepage', label: '홈페이지' },
];

export const ContactEditor: React.FC<ContactEditorProps> = ({ data, onChange }) => {
  const contacts = data || [];

  const handleAdd = () => {
    onChange([...contacts, { type: 'email', value: '' }]);
  };

  const handleRemove = (index: number) => {
    onChange(contacts.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Contact, value: string) => {
    onChange(
      contacts.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">연락처</h2>
        <Button onClick={handleAdd} variant="secondary" size="sm">
          연락처 추가
        </Button>
      </div>

      <div className="space-y-4">
        {contacts.map((contact, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="w-40">
              <Select
                value={contact.type || 'email'}
                onChange={(value) => handleChange(index, 'type', value)}
                options={CONTACT_TYPES}
                placeholder="연락처 유형"
                className="h-10"
              />
            </div>
            <div className="flex-1">
              <TextInput
                value={contact.value}
                onChange={(e) => handleChange(index, 'value', e.target.value)}
                placeholder="값을 입력하세요"
              />
            </div>
            <Button onClick={() => handleRemove(index)} variant="ghost" size="sm">
              삭제
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}; 