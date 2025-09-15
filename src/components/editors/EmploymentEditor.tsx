import { Employment, TechStack, WorkDetail, WorkItem } from '../../types/resume';
import { Button } from '../common/Button';
import { useMemo } from 'react';
import { TextInput } from '../common/TextInput';
import { TrashIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { DateInput } from './employment/DateInput';
import { TechStackInput } from './employment/TechStackInput';
import { WorkDetailEditor } from './employment/WorkDetailEditor';

interface EmploymentEditorProps {
  data?: Employment[];
  onChange: (employments: Employment[]) => void;
  onFocusChange?: (focus: { employmentIndex?: number; detailIndex?: number; itemIndex?: number; subItemIndex?: number } | null) => void;
}

export const EmploymentEditor: React.FC<EmploymentEditorProps> = ({ data, onChange, onFocusChange }) => {
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

  const handleAdd = (position: 'top' | 'bottom' = 'bottom') => {
    const newEmployment = {
      company: '',
      position: '',
      period: {
        start: '',
        end: '',
      },
      techStack: [],
      details: [],
    };

    if (position === 'top') {
      onChange([newEmployment, ...employments]);
    } else {
      onChange([...employments, newEmployment]);
    }
  };

  const handleRemove = (index: number) => {
    onChange(employments.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newEmployments = [...employments];
    [newEmployments[index - 1], newEmployments[index]] = [newEmployments[index], newEmployments[index - 1]];
    onChange(newEmployments);
  };

  const handleMoveDown = (index: number) => {
    if (index === employments.length - 1) return;
    const newEmployments = [...employments];
    [newEmployments[index], newEmployments[index + 1]] = [newEmployments[index + 1], newEmployments[index]];
    onChange(newEmployments);
  };

  const handleChange = (index: number, field: keyof Employment, value: any) => {
    onChange(
      employments.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleDetailAdd = (index: number, position: 'top' | 'bottom' = 'bottom') => {
    const newDetails = [...(employments[index].details || [])]
    const newDetail = {
      title: '',
      items: []
    }

    if (position === 'top') {
      newDetails.unshift(newDetail)
    } else {
      newDetails.push(newDetail)
    }

    onChange(
      employments.map((item, i) =>
        i === index ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleDetailAddAt = (employmentIndex: number, detailIndex: number, position: 'before' | 'after') => {
    const newDetails = [...(employments[employmentIndex].details || [])]
    const newDetail = {
      title: '',
      items: []
    }

    const insertIndex = position === 'before' ? detailIndex : detailIndex + 1
    newDetails.splice(insertIndex, 0, newDetail)

    onChange(
      employments.map((item, i) =>
        i === employmentIndex ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleDetailChange = (employmentIndex: number, detailIndex: number, detail: WorkDetail) => {
    const newDetails = [...(employments[employmentIndex].details || [])]
    newDetails[detailIndex] = detail
    onChange(
      employments.map((item, i) =>
        i === employmentIndex ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleDetailRemove = (employmentIndex: number, detailIndex: number) => {
    const newDetails = [...(employments[employmentIndex].details || [])]
    newDetails.splice(detailIndex, 1)
    onChange(
      employments.map((item, i) =>
        i === employmentIndex ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleDetailMoveUp = (employmentIndex: number, detailIndex: number) => {
    if (detailIndex === 0) return
    const newDetails = [...(employments[employmentIndex].details || [])]
    ;[newDetails[detailIndex - 1], newDetails[detailIndex]] = [newDetails[detailIndex], newDetails[detailIndex - 1]]
    onChange(
      employments.map((item, i) =>
        i === employmentIndex ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleDetailMoveDown = (employmentIndex: number, detailIndex: number) => {
    const details = employments[employmentIndex].details || []
    if (detailIndex === details.length - 1) return
    const newDetails = [...details]
    ;[newDetails[detailIndex], newDetails[detailIndex + 1]] = [newDetails[detailIndex + 1], newDetails[detailIndex]]
    onChange(
      employments.map((item, i) =>
        i === employmentIndex ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleItemAdd = (employmentIndex: number, detailIndex: number) => {
    const newDetails = [...(employments[employmentIndex].details || [])]
    const detail = newDetails[detailIndex]
    if (!detail) return

    detail.items.push({
      text: '',
      subItems: []
    })
    onChange(
      employments.map((employment, idx) =>
        idx === employmentIndex ? { ...employment, details: newDetails } : employment
      )
    )
  }

  const handleItemChange = (employmentIndex: number, detailIndex: number, itemIndex: number, field: keyof WorkItem, value: any) => {
    const newDetails = [...(employments[employmentIndex].details || [])]
    const detail = newDetails[detailIndex]
    if (!detail || !detail.items[itemIndex]) return

    detail.items[itemIndex] = { ...detail.items[itemIndex], [field]: value }
    onChange(
      employments.map((item, i) =>
        i === employmentIndex ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleItemRemove = (employmentIndex: number, detailIndex: number, itemIndex: number) => {
    const newDetails = [...(employments[employmentIndex].details || [])]
    const detail = newDetails[detailIndex]
    if (!detail) return

    detail.items.splice(itemIndex, 1)
    onChange(
      employments.map((item, i) =>
        i === employmentIndex ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleItemMoveUp = (employmentIndex: number, detailIndex: number, itemIndex: number) => {
    if (itemIndex === 0) return
    const newDetails = [...(employments[employmentIndex].details || [])]
    const detail = newDetails[detailIndex]
    if (!detail) return

    ;[detail.items[itemIndex - 1], detail.items[itemIndex]] = [detail.items[itemIndex], detail.items[itemIndex - 1]]
    onChange(
      employments.map((item, i) =>
        i === employmentIndex ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleItemMoveDown = (employmentIndex: number, detailIndex: number, itemIndex: number) => {
    const newDetails = [...(employments[employmentIndex].details || [])]
    const detail = newDetails[detailIndex]
    if (!detail || itemIndex === detail.items.length - 1) return

    ;[detail.items[itemIndex], detail.items[itemIndex + 1]] = [detail.items[itemIndex + 1], detail.items[itemIndex]]
    onChange(
      employments.map((item, i) =>
        i === employmentIndex ? { ...item, details: newDetails } : item
      )
    )
  }

  const handleSubItemAdd = (employmentIndex: number, detailIndex: number, itemIndex: number) => {
    const employment = employments[employmentIndex]
    if (!employment.details) return

    const newDetails = [...employment.details]
    const detail = newDetails[detailIndex]
    if (!detail || !detail.items[itemIndex]) return

    const item = detail.items[itemIndex]
    if (!item.subItems) item.subItems = []
    item.subItems.push('')

    onChange(
      employments.map((emp, i) =>
        i === employmentIndex ? { ...emp, details: newDetails } : emp
      )
    )
  }

  const handleSubItemChange = (employmentIndex: number, detailIndex: number, itemIndex: number, subItemIndex: number, value: string) => {
    const newDetails = [...(employments[employmentIndex].details || [])]
    const detail = newDetails[detailIndex]
    const item = detail.items[itemIndex]
    if (!item.subItems) item.subItems = []
    item.subItems[subItemIndex] = value
    onChange(
      employments.map((emp, i) =>
        i === employmentIndex ? { ...emp, details: newDetails } : emp
      )
    )
  }

  const handleSubItemRemove = (employmentIndex: number, detailIndex: number, itemIndex: number, subItemIndex: number) => {
    const newDetails = [...(employments[employmentIndex].details || [])]
    const detail = newDetails[detailIndex]
    const item = detail.items[itemIndex]
    if (!item.subItems || item.subItems.length === 0) return

    // Remove the sub-item from the array
    item.subItems.splice(subItemIndex, 1)

    // If there are no more sub-items, set subItems to an empty array (or remove it)
    if (item.subItems.length === 0) {
      item.subItems = []
    }

    onChange(
      employments.map((emp, i) =>
        i === employmentIndex ? { ...emp, details: newDetails } : emp
      )
    )
  }

  const handleSubItemMoveUp = (employmentIndex: number, detailIndex: number, itemIndex: number, subItemIndex: number) => {
    if (subItemIndex === 0) return
    const newDetails = [...(employments[employmentIndex].details || [])]
    const detail = newDetails[detailIndex]
    const item = detail.items[itemIndex]
    if (!item.subItems) return

    ;[item.subItems[subItemIndex - 1], item.subItems[subItemIndex]] = [item.subItems[subItemIndex], item.subItems[subItemIndex - 1]]
    onChange(
      employments.map((emp, i) =>
        i === employmentIndex ? { ...emp, details: newDetails } : emp
      )
    )
  }

  const handleSubItemMoveDown = (employmentIndex: number, detailIndex: number, itemIndex: number, subItemIndex: number) => {
    const newDetails = [...(employments[employmentIndex].details || [])]
    const detail = newDetails[detailIndex]
    const item = detail.items[itemIndex]
    if (!item.subItems || subItemIndex === item.subItems.length - 1) return

    ;[item.subItems[subItemIndex], item.subItems[subItemIndex + 1]] = [item.subItems[subItemIndex + 1], item.subItems[subItemIndex]]
    onChange(
      employments.map((emp, i) =>
        i === employmentIndex ? { ...emp, details: newDetails } : emp
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">경력</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => handleAdd('top')}
            variant="secondary"
            size="sm"
            title="맨 위에 추가"
          >
            ↑ 위에 추가
          </Button>
          <Button
            onClick={() => handleAdd('bottom')}
            variant="secondary"
            size="sm"
            title="맨 아래에 추가"
          >
            ↓ 아래에 추가
          </Button>
        </div>
      </div>

      {employments.map((employment, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6 space-y-6 employment-editor-section">
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
                    onFocus={() => onFocusChange?.({ employmentIndex: index })}
                    onBlur={() => onFocusChange?.(null)}
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
                    onFocus={() => onFocusChange?.({ employmentIndex: index })}
                    onBlur={() => onFocusChange?.(null)}
                    placeholder="직위를 입력하세요"
                  />
                </div>
              </div>

              {/* 근무 기간 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="w-full">
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
                    onFocus={() => onFocusChange?.({ employmentIndex: index })}
                    onBlur={() => onFocusChange?.(null)}
                    placeholder="YYYY.MM"
                  />
                </div>
                <div className="w-full">
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
                    onFocus={() => onFocusChange?.({ employmentIndex: index })}
                    onBlur={() => onFocusChange?.(null)}
                    placeholder="YYYY.MM"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                onClick={() => handleMoveUp(index)}
                variant="ghost"
                size="sm"
                disabled={index === 0}
                className="p-1"
                title="위로 이동"
              >
                <ChevronUpIcon className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => handleMoveDown(index)}
                variant="ghost"
                size="sm"
                disabled={index === employments.length - 1}
                className="p-1"
                title="아래로 이동"
              >
                <ChevronDownIcon className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => handleRemove(index)}
                variant="ghost"
                size="sm"
                className="p-1 text-gray-400 hover:text-gray-600"
                title="삭제"
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 기술 스택 */}
          <div className="tech-stack-section">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                기술 스택
              </label>
            </div>
            <TechStackInput
              value={employment.techStack || []}
              onChange={(newTechStack) => handleChange(index, 'techStack', newTechStack)}
              allTechStacks={allTechStacks}
              onFocus={() => onFocusChange?.({ employmentIndex: index, detailIndex: -1 })}
              onBlur={() => onFocusChange?.(null)}
            />
          </div>

          {/* 주요 업무 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  주요 업무
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  링크: [텍스트](URL) 형식
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleDetailAdd(index, 'top')}
                  variant="secondary"
                  size="sm"
                  title="맨 위에 추가"
                >
                  ↑ 위에 추가
                </Button>
                <Button
                  onClick={() => handleDetailAdd(index, 'bottom')}
                  variant="secondary"
                  size="sm"
                  title="맨 아래에 추가"
                >
                  ↓ 아래에 추가
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {employment.details?.map((detail, detailIndex) => (
                <div key={detailIndex}>
                  <WorkDetailEditor
                    detail={detail}
                    detailIndex={detailIndex}
                    employmentIndex={index}
                    onDetailChange={handleDetailChange}
                    onDetailRemove={handleDetailRemove}
                    onDetailMoveUp={handleDetailMoveUp}
                    onDetailMoveDown={handleDetailMoveDown}
                    onItemAdd={handleItemAdd}
                    onItemChange={handleItemChange}
                    onItemRemove={handleItemRemove}
                    onItemMoveUp={handleItemMoveUp}
                    onItemMoveDown={handleItemMoveDown}
                    onSubItemAdd={handleSubItemAdd}
                    onSubItemChange={handleSubItemChange}
                    onSubItemRemove={handleSubItemRemove}
                    onSubItemMoveUp={handleSubItemMoveUp}
                    onSubItemMoveDown={handleSubItemMoveDown}
                    isFirst={detailIndex === 0}
                    isLast={detailIndex === (employment.details?.length || 0) - 1}
                    onFocusChange={onFocusChange}
                  />

                  {/* 주요 업무 사이에 추가 버튼 */}
                  {detailIndex < (employment.details?.length || 0) - 1 && (
                    <div className="flex justify-center mt-2">
                      <Button
                        onClick={() => handleDetailAddAt(index, detailIndex, 'after')}
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                      >
                        + 여기에 주요 업무 추가
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};