import { Employment, TechStack, WorkDetail, WorkItem } from '../../types/resume';
import { Button } from '../common/Button';
import { Combobox, Listbox, Transition } from '@headlessui/react';
import { useState, useMemo, Fragment } from 'react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { TextInput } from '../common/TextInput';
import { TextArea } from '../common/TextArea';
import { Select } from '../common/Select';
import {  TrashIcon } from '@heroicons/react/24/outline';

// 현재 년도 기준으로 최근 20년치 년도 목록 생성
const YEARS = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const DateInput: React.FC<DateInputProps> = ({ value, onChange, placeholder }) => {
  const [selectedYear, selectedMonth] = value ? value.split('.') : ['', ''];

  const yearOptions = YEARS.map(year => ({
    value: year.toString(),
    label: year.toString()
  }))

  const monthOptions = MONTHS.map(month => ({
    value: month,
    label: month
  }))
  
  return (
    <div className="flex gap-2">
      <Select
        value={selectedYear || ''}
        onChange={(year) => onChange(`${year}.${selectedMonth || '01'}`)}
        options={yearOptions}
        placeholder="년도"
        size="sm"
      />
      <Select
        value={selectedMonth || ''}
        onChange={(month) => onChange(`${selectedYear || new Date().getFullYear()}.${month}`)}
        options={monthOptions}
        placeholder="월"
        size="sm"
        className="w-24"
      />
    </div>
  );
};

interface TechStackInputProps {
  value: TechStack[];
  onChange: (value: TechStack[]) => void;
  allTechStacks: string[];
}

const TechStackInput: React.FC<TechStackInputProps> = ({ value, onChange, allTechStacks }) => {
  const [query, setQuery] = useState('');
  
  const filteredTech = query === ''
    ? allTechStacks
    : allTechStacks.filter((tech: string) =>
        tech.toLowerCase().includes(query.toLowerCase())
      );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      const newTech = { name: query.trim() };
      if (!value.find((t: TechStack) => t.name === newTech.name)) {
        onChange([...value, newTech]);
      }
      setQuery('');
    }
  };

  const removeTech = (techToRemove: TechStack) => {
    onChange(value.filter((tech: TechStack) => tech.name !== techToRemove.name));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tech: TechStack) => (
          <span
            key={tech.name}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm"
          >
            {tech.name}
            <button
              type="button"
              onClick={() => removeTech(tech)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <Combobox
        value={query}
        onChange={(newValue: string) => {
          const newTech = { name: newValue };
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
    </div>
  );
};

interface EmploymentEditorProps {
  data?: Employment[];
  onChange: (employments: Employment[]) => void;
}

export const EmploymentEditor: React.FC<EmploymentEditorProps> = ({ data, onChange }) => {
  const employments = data || [];

  // 전체 employment에서 사용된 기술 스택 목록을 추출
  const allTechStacks = useMemo(() => {
    const techSet = new Set<string>();
    employments.forEach(emp => {
      emp.techStack?.forEach(tech => {
        if (tech.name) techSet.add(tech.name);
      });
    });
    return Array.from(techSet);
  }, [employments]);

  const handleAdd = () => {
    onChange([
      ...employments,
      {
        company: '',
        position: '',
        period: {
          start: '',
          end: '',
        },
        techStack: [],
        details: [],
      },
    ]);
  };

  const handleRemove = (index: number) => {
    onChange(employments.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Employment, value: any) => {
    onChange(
      employments.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };


  const handleDetailAdd = (index: number) => {
    const newDetails = [...(employments[index].details || [])]
    newDetails.push({
      title: '',
      items: []
    })
    onChange(
      employments.map((item, i) =>
        i === index ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleDetailChange = (index: number, detail: WorkDetail) => {
    const newDetails = [...(employments[index].details || [])]
    newDetails[index] = detail
    onChange(
      employments.map((item, i) =>
        i === index ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleDetailRemove = (index: number) => {
    const newDetails = [...(employments[index].details || [])]
    newDetails.splice(index, 1)
    onChange(
      employments.map((item, i) =>
        i === index ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleItemAdd = (index: number) => {
    const newDetails = [...(employments[index].details || [])]
    const detail = newDetails[index]
    detail.items.push({
      text: '',
      subItems: []
    })
    onChange(
      employments.map((employment, idx) =>
        idx === index ? { ...employment, details: newDetails } : employment
      )
    )
  }

  const handleItemChange = (index: number, itemIndex: number, field: keyof WorkItem, value: string) => {
    const newDetails = [...(employments[index].details || [])]
    const detail = newDetails[index]
    detail.items[itemIndex] = { ...detail.items[itemIndex], [field]: value }
    onChange(
      employments.map((item, i) =>
        i === index ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleItemRemove = (index: number, itemIndex: number) => {
    const newDetails = [...(employments[index].details || [])]
    const detail = newDetails[index]
    detail.items.splice(itemIndex, 1)
    onChange(
      employments.map((item, i) =>
        i === index ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleSubItemAdd = (index: number, itemIndex: number) => {
    const newDetails = [...(employments[index].details || [])]
    const detail = newDetails[index]
    const item = detail.items[itemIndex]
    if (!item.subItems) item.subItems = []
    item.subItems.push('')
    onChange(
      employments.map((item, i) =>
        i === index ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleSubItemChange = (index: number, itemIndex: number, subItemIndex: number, value: string) => {
    const newDetails = [...(employments[index].details || [])]
    const detail = newDetails[index]
    const item = detail.items[itemIndex]
    if (!item.subItems) item.subItems = []
    item.subItems[subItemIndex] = value
    onChange(
      employments.map((item, i) =>
        i === index ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleSubItemRemove = (index: number, itemIndex: number, subItemIndex: number) => {
    const newDetails = [...(employments[index].details || [])]
    const detail = newDetails[index]
    const item = detail.items[itemIndex]
    if (!item.subItems) return
    item.subItems.splice(subItemIndex, 1)
    onChange(
      employments.map((item, i) =>
        i === index ? { ...item, details: newDetails } : item
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">경력</h2>
        <Button
          onClick={handleAdd}
          variant="secondary"
          size="sm"
        >
          경력 추가
        </Button>
      </div>

      {employments.map((employment, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-4 flex-1">
              {/* 회사 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    회사명
                  </label>
                  <TextInput
                    value={employment.company || ''}
                    onChange={(e) => handleChange(index, 'company', e.target.value)}
                    placeholder="회사명을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    직위
                  </label>
                  <TextInput
                    value={employment.position || ''}
                    onChange={(e) => handleChange(index, 'position', e.target.value)}
                    placeholder="직위를 입력하세요"
                  />
                </div>
              </div>

              {/* 근무 기간 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시작일
                  </label>
                  <DateInput
                    value={employment.period?.start || ''}
                    onChange={(value) =>
                      handleChange(index, 'period', {
                        ...(employment.period || {}),
                        start: value,
                      })
                    }
                    placeholder="YYYY.MM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    종료일
                  </label>
                  <DateInput
                    value={employment.period?.end || ''}
                    onChange={(value) =>
                      handleChange(index, 'period', {
                        ...(employment.period || {}),
                        end: value,
                      })
                    }
                    placeholder="YYYY.MM"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={() => handleRemove(index)}
              variant="ghost"
              size="sm"
            >
              삭제
            </Button>
          </div>

          {/* 기술 스택 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                기술 스택
              </label>
            </div>
            <TechStackInput
              value={employment.techStack || []}
              onChange={(newTechStack) => handleChange(index, 'techStack', newTechStack)}
              allTechStacks={allTechStacks}
            />
          </div>

          {/* 주요 업무 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                주요 업무
              </label>
              <Button
                onClick={() => handleDetailAdd(index)}
                variant="secondary"
                size="sm"
              >
                업무 내용 추가
              </Button>
            </div>

            <div className="space-y-4">
              {employment.details?.map((detail, detailIndex) => (
                <div key={detailIndex} className="relative bg-gray-50 rounded-lg p-4 space-y-4">
                  {/* Detail Title */}
                  <Button
                    onClick={() => handleDetailRemove(index)}
                    variant="ghost"
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
                    size="sm"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      제목
                    </label>
                    <TextInput
                      value={detail.title}
                      onChange={(e) => handleDetailChange(index, { ...detail, title: e.target.value })}
                      placeholder="업무 제목"
                    />
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      업무 항목
                    </label>
                    {detail.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <TextArea
                              value={item.text}
                              onChange={(e) => handleItemChange(index, itemIndex, 'text', e.target.value)}
                              placeholder="주요 업무 내용을 입력하세요"
                              className="min-h-[60px]"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleItemRemove(index, itemIndex)}
                          >
                            삭제
                          </Button>
                        </div>

                        {/* Sub Items */}
                        <div className="pl-4 space-y-2">
                          {item.subItems?.map((subItem, subIndex) => (
                            <div key={subIndex} className="flex items-start gap-2">
                              <div className="flex-1">
                                <TextArea
                                  value={subItem}
                                  onChange={(e) => handleSubItemChange(index, itemIndex, subIndex, e.target.value)}
                                  placeholder="세부 업무 내용을 입력하세요"
                                  className="min-h-[60px]"
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSubItemRemove(index, itemIndex, subIndex)}
                              >
                                삭제
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSubItemAdd(index, itemIndex)}
                          >
                            + 세부 업무 추가
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      onClick={() => handleItemAdd(index)}
                      variant="secondary"
                      size="sm"
                    >
                      + 항목 추가
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 