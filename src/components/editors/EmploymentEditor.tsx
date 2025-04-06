import { Employment, TechStack, WorkDetail, WorkItem } from '../../types/resume';
import { Button } from '../common/Button';
import { Combobox } from '@headlessui/react';
import { useState, useMemo } from 'react';

// 자주 사용되는 기술 스택 목록
const COMMON_TECH_STACKS = [
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular',
  'Node.js', 'Python', 'Java', 'Spring', 'Docker',
  'Kubernetes', 'AWS', 'GCP', 'Azure', 'MySQL',
  'PostgreSQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API'
];

interface TechStackInputProps {
  value: TechStack[];
  onChange: (value: TechStack[]) => void;
  allTechStacks: string[];
}

const TechStackInput: React.FC<TechStackInputProps> = ({ value, onChange, allTechStacks }) => {
  const [query, setQuery] = useState('');
  
  const filteredTech = query === ''
    ? allTechStacks
    : allTechStacks.filter((tech) =>
        tech.toLowerCase().includes(query.toLowerCase())
      );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      const newTech = { name: query.trim() };
      if (!value.find(t => t.name === newTech.name)) {
        onChange([...value, newTech]);
      }
      setQuery('');
    }
  };

  const removeTech = (techToRemove: TechStack) => {
    onChange(value.filter(tech => tech.name !== techToRemove.name));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tech) => (
          <span
            key={tech.name}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm"
          >
            {tech.name}
            <button
              type="button"
              onClick={() => removeTech(tech)}
              className="text-blue-500 hover:text-blue-700"
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
          if (!value.find(t => t.name === newTech.name)) {
            onChange([...value, newTech]);
          }
          setQuery('');
        }}
      >
        <div className="relative">
          <Combobox.Input
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="기술 스택 입력 (Enter로 추가)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {filteredTech.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredTech.map((tech) => (
                <Combobox.Option
                  key={tech}
                  value={tech}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                      active ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
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

  const handleTechStackAdd = (index: number) => {
    onChange(
      employments.map((item, i) =>
        i === index
          ? {
              ...item,
              techStack: [...(item.techStack || []), { name: '' } as TechStack],
            }
          : item
      )
    );
  };

  const handleTechStackRemove = (index: number, techIndex: number) => {
    onChange(
      employments.map((item, i) =>
        i === index
          ? {
              ...item,
              techStack: (item.techStack || []).filter((_, j) => j !== techIndex),
            }
          : item
      )
    );
  };

  const handleTechStackChange = (
    index: number,
    techIndex: number,
    value: string
  ) => {
    onChange(
      employments.map((item, i) =>
        i === index
          ? {
              ...item,
              techStack: (item.techStack || []).map((tech, j) =>
                j === techIndex ? { ...tech, name: value } : tech
              ),
            }
          : item
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

  const handleItemAdd = (detailIndex: number) => {
    const newDetails = [...(employments[detailIndex].details || [])]
    const detail = newDetails[detailIndex]
    detail.items.push({
      text: '',
      subItems: []
    })
    onChange(
      employments.map((item, i) =>
        i === detailIndex ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleItemChange = (detailIndex: number, itemIndex: number, item: WorkItem) => {
    const newDetails = [...(employments[detailIndex].details || [])]
    const detail = newDetails[detailIndex]
    detail.items[itemIndex] = item
    onChange(
      employments.map((item, i) =>
        i === detailIndex ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleItemRemove = (detailIndex: number, itemIndex: number) => {
    const newDetails = [...(employments[detailIndex].details || [])]
    const detail = newDetails[detailIndex]
    detail.items.splice(itemIndex, 1)
    onChange(
      employments.map((item, i) =>
        i === detailIndex ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleSubItemAdd = (detailIndex: number, itemIndex: number) => {
    const newDetails = [...(employments[detailIndex].details || [])]
    const detail = newDetails[detailIndex]
    const item = detail.items[itemIndex]
    if (!item.subItems) item.subItems = []
    item.subItems.push('')
    onChange(
      employments.map((item, i) =>
        i === detailIndex ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleSubItemChange = (detailIndex: number, itemIndex: number, subItemIndex: number, value: string) => {
    const newDetails = [...(employments[detailIndex].details || [])]
    const detail = newDetails[detailIndex]
    const item = detail.items[itemIndex]
    if (!item.subItems) item.subItems = []
    item.subItems[subItemIndex] = value
    onChange(
      employments.map((item, i) =>
        i === detailIndex ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleSubItemRemove = (detailIndex: number, itemIndex: number, subItemIndex: number) => {
    const newDetails = [...(employments[detailIndex].details || [])]
    const detail = newDetails[detailIndex]
    const item = detail.items[itemIndex]
    if (!item.subItems) return
    item.subItems.splice(subItemIndex, 1)
    onChange(
      employments.map((item, i) =>
        i === detailIndex ? { ...item, details: newDetails } : item
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
                  <input
                    type="text"
                    value={employment.company || ''}
                    onChange={(e) => handleChange(index, 'company', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    직위
                  </label>
                  <input
                    type="text"
                    value={employment.position || ''}
                    onChange={(e) => handleChange(index, 'position', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* 근무 기간 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시작일
                  </label>
                  <input
                    type="text"
                    value={employment.period?.start || ''}
                    onChange={(e) =>
                      handleChange(index, 'period', {
                        ...(employment.period || {}),
                        start: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="YYYY.MM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    종료일
                  </label>
                  <input
                    type="text"
                    value={employment.period?.end || ''}
                    onChange={(e) =>
                      handleChange(index, 'period', {
                        ...(employment.period || {}),
                        end: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={detail.title}
                      onChange={(e) => handleDetailChange(index, { ...detail, title: e.target.value })}
                      placeholder="업무 제목"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <Button
                      onClick={() => handleDetailRemove(index)}
                      variant="ghost"
                      size="sm"
                    >
                      삭제
                    </Button>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 pl-4">
                    {detail.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="space-y-2">
                        <div className="flex gap-2 items-start">
                          <span className="mt-2">•</span>
                          <textarea
                            value={item.text}
                            onChange={(e) => handleItemChange(index, itemIndex, { ...item, text: e.target.value })}
                            placeholder="업무 내용"
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm min-h-[2.5rem]"
                          />
                          <div className="space-x-2">
                            <Button
                              onClick={() => handleSubItemAdd(index, itemIndex)}
                              variant="secondary"
                              size="sm"
                            >
                              + 세부항목
                            </Button>
                            <Button
                              onClick={() => handleItemRemove(index, itemIndex)}
                              variant="ghost"
                              size="sm"
                            >
                              삭제
                            </Button>
                          </div>
                        </div>

                        {/* Sub Items */}
                        {item.subItems?.map((subItem, subItemIndex) => (
                          <div key={subItemIndex} className="flex gap-2 items-start pl-6">
                            <span className="mt-2">◦</span>
                            <textarea
                              value={subItem}
                              onChange={(e) => handleSubItemChange(index, itemIndex, subItemIndex, e.target.value)}
                              placeholder="세부 업무 내용"
                              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm min-h-[2.5rem]"
                            />
                            <Button
                              onClick={() => handleSubItemRemove(index, itemIndex, subItemIndex)}
                              variant="ghost"
                              size="sm"
                            >
                              삭제
                            </Button>
                          </div>
                        ))}
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