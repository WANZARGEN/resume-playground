import React, { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { TechStack } from '../../../types/resume';

interface TechStackInputProps {
  value: TechStack[];
  onChange: (value: TechStack[]) => void;
  allTechStacks: string[];
}

export const TechStackInput: React.FC<TechStackInputProps> = ({ value, onChange, allTechStacks }) => {
  const [query, setQuery] = useState('');

  const filteredTech = query === ''
    ? allTechStacks
    : allTechStacks.filter((tech: string) =>
        tech.toLowerCase().includes(query.toLowerCase())
      );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      const newTech = { name: query.trim(), highlight: false };
      if (!value.find((t: TechStack) => t.name === newTech.name)) {
        onChange([...value, newTech]);
      }
      setQuery('');
    }
  };

  const removeTech = (techToRemove: TechStack) => {
    onChange(value.filter((tech: TechStack) => tech.name !== techToRemove.name));
  };

  const toggleHighlight = (techToToggle: TechStack) => {
    onChange(
      value.map((tech: TechStack) =>
        tech.name === techToToggle.name
          ? { ...tech, highlight: !tech.highlight }
          : tech
      )
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tech: TechStack) => (
          <span
            key={tech.name}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
              tech.highlight
                ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => toggleHighlight(tech)}
            title="클릭하여 강조 표시 전환"
          >
            {tech.name}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTech(tech);
              }}
              className="text-gray-500 hover:text-gray-700 ml-1"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <Combobox
        value={query}
        onChange={(newValue: string) => {
          const newTech = { name: newValue, highlight: false };
          if (!value.find((t: TechStack) => t.name === newTech.name)) {
            onChange([...value, newTech]);
          }
          setQuery('');
        }}
      >
        <div className="relative">
          <Combobox.Input
            className="block w-full h-[38px] px-3 py-[9px] rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="기술 스택 입력 (Enter로 추가)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {filteredTech.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-gray-300">
              {filteredTech.map((tech) => (
                <Combobox.Option
                  key={tech}
                  value={tech}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 px-3 ${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    }`
                  }
                >
                  {tech}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
      <p className="text-xs text-gray-500 mt-1">
        💡 기술 스택을 클릭하면 강조 표시를 설정/해제할 수 있습니다
      </p>
    </div>
  );
};