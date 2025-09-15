import React from 'react';
import { Contact } from '../../../types/resume';
import { Button } from '../../common/Button';
import { TextInput } from '../../common/TextInput';
import { Select } from '../../common/Select';
import { TrashIcon } from '@heroicons/react/24/outline';

const contactTypes = [
  { value: 'email', label: '이메일' },
  { value: 'github', label: 'GitHub' }
];

interface ContactListProps {
  contacts: Contact[];
  onChange: (contacts: Contact[]) => void;
}

export const ContactList: React.FC<ContactListProps> = ({ contacts, onChange }) => {
  const handleContactChange = (index: number, field: keyof Contact, value: Contact[keyof Contact]) => {
    const newContacts = [...contacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    onChange(newContacts);
  };

  const addContact = () => {
    const newContacts: Contact[] = [...contacts, { type: 'email' as Contact['type'] }];
    onChange(newContacts);
  };

  const removeContact = (index: number) => {
    const newContacts = [...contacts];
    newContacts.splice(index, 1);
    onChange(newContacts);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm font-medium text-gray-700">연락처</label>
        <Button onClick={addContact} variant="secondary" size="sm">
          연락처 추가
        </Button>
      </div>
      <div className="space-y-2">
        {contacts.map((contact, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1 flex gap-2">
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
            </div>
            <Button onClick={() => removeContact(index)} variant="ghost" size="sm" className="p-1 text-gray-400 hover:text-gray-600" title="삭제">
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};