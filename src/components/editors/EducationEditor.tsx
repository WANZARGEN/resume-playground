import type { Education, Activity } from '../../types/resume';
import { TrashIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Button } from '../common/Button';
import { TextInput } from '../common/TextInput';
import { TextArea } from '../common/TextArea';

interface EducationEditorProps {
  data?: Education[];
  onChange: (education: Education[]) => void;
  onFocusChange?: (focus: { educationIndex?: number; activityIndex?: number } | null) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({ data, onChange, onFocusChange }) => {
  const educationList = data || [];

  const handleAddEducation = (position: 'top' | 'bottom' = 'bottom') => {
    const newEducation = {
      type: 'presentation' as Education['type'],
      items: []
    };

    if (position === 'top') {
      onChange([newEducation, ...educationList]);
    } else {
      onChange([...educationList, newEducation]);
    }
  };

  const handleAddEducationAt = (index: number, position: 'before' | 'after') => {
    const newEducation = {
      type: 'presentation' as Education['type'],
      items: []
    };

    const newList = [...educationList];
    const insertIndex = position === 'before' ? index : index + 1;
    newList.splice(insertIndex, 0, newEducation);
    onChange(newList);
  };

  const handleRemoveEducation = (index: number) => {
    onChange(educationList.filter((_, i) => i !== index));
  };

  const handleMoveEducationUp = (index: number) => {
    if (index === 0) return;
    const newEducation = [...educationList];
    [newEducation[index - 1], newEducation[index]] = [newEducation[index], newEducation[index - 1]];
    onChange(newEducation);
  };

  const handleMoveEducationDown = (index: number) => {
    if (index === educationList.length - 1) return;
    const newEducation = [...educationList];
    [newEducation[index], newEducation[index + 1]] = [newEducation[index + 1], newEducation[index]];
    onChange(newEducation);
  };

  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: Education['type']
  ) => {
    const newData = [...educationList];
    newData[index] = {
      ...newData[index],
      [field]: value,
      items: newData[index]?.items || []
    };
    onChange(newData);
  };

  const handleAddActivity = (educationIndex: number, position: 'top' | 'bottom' = 'bottom') => {
    const newData = [...educationList];
    if (!newData[educationIndex]) {
      newData[educationIndex] = {
        type: 'presentation',
        items: []
      };
    }
    if (!newData[educationIndex].items) {
      newData[educationIndex].items = [];
    }

    const newActivity = {
      title: '',
      url: '',
      link: '',
      description: ''
    };

    if (position === 'top') {
      newData[educationIndex].items!.unshift(newActivity);
    } else {
      newData[educationIndex].items!.push(newActivity);
    }
    onChange(newData);
  };

  const handleAddActivityAt = (educationIndex: number, activityIndex: number, position: 'before' | 'after') => {
    const newData = [...educationList];
    if (!newData[educationIndex]?.items) return;

    const newActivity = {
      title: '',
      url: '',
      link: '',
      description: ''
    };

    const insertIndex = position === 'before' ? activityIndex : activityIndex + 1;
    newData[educationIndex].items!.splice(insertIndex, 0, newActivity);
    onChange(newData);
  };

  const handleMoveActivityUp = (educationIndex: number, activityIndex: number) => {
    if (activityIndex === 0) return;
    const newData = [...educationList];
    if (!newData[educationIndex]?.items) return;

    const items = newData[educationIndex].items!;
    [items[activityIndex - 1], items[activityIndex]] = [items[activityIndex], items[activityIndex - 1]];
    onChange(newData);
  };

  const handleMoveActivityDown = (educationIndex: number, activityIndex: number) => {
    const newData = [...educationList];
    if (!newData[educationIndex]?.items) return;

    const items = newData[educationIndex].items!;
    if (activityIndex === items.length - 1) return;

    [items[activityIndex], items[activityIndex + 1]] = [items[activityIndex + 1], items[activityIndex]];
    onChange(newData);
  };

  const handleActivityChange = (
    educationIndex: number,
    activityIndex: number,
    field: keyof Activity,
    value: string
  ) => {
    const newData = [...educationList];
    if (!newData[educationIndex]?.items) {
      return;
    }
    const activity = newData[educationIndex].items![activityIndex] || { title: '', url: '', link: '', description: '' };
    newData[educationIndex].items![activityIndex] = {
      ...activity,
      [field]: value
    };
    onChange(newData);
  };

  const handleRemoveActivity = (educationIndex: number, activityIndex: number) => {
    const newData = [...educationList];
    if (newData[educationIndex]?.items) {
      newData[educationIndex].items = newData[educationIndex].items!.filter(
        (_, i) => i !== activityIndex
      );
    }
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">교육 및 활동</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => handleAddEducation('top')}
            variant="secondary"
            size="sm"
            className="mt-4"
          >
            위에 섹션 추가
          </Button>
          <Button
            onClick={() => handleAddEducation('bottom')}
            variant="secondary"
            size="sm"
            className="mt-4"
          >
            아래에 섹션 추가
          </Button>
        </div>
      </div>

      {educationList.map((education, educationIndex) => (
        <div key={educationIndex} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-4 flex-1">
              {/* 섹션 타입 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  섹션 타입
                </label>
                <select
                  value={education.type}
                  onChange={(e) =>
                    handleEducationChange(educationIndex, 'type', e.target.value as Education['type'])
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="presentation">발표 및 세미나</option>
                  <option value="certificate">자격증</option>
                  <option value="education">학력</option>
                  <option value="language">어학</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                onClick={() => handleMoveEducationUp(educationIndex)}
                variant="ghost"
                size="sm"
                disabled={educationIndex === 0}
                className="p-1"
                title="위로 이동"
              >
                <ChevronUpIcon className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => handleMoveEducationDown(educationIndex)}
                variant="ghost"
                size="sm"
                disabled={educationIndex === educationList.length - 1}
                className="p-1"
                title="아래로 이동"
              >
                <ChevronDownIcon className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => handleRemoveEducation(educationIndex)}
                variant="ghost"
                size="sm"
                className="p-1 text-gray-400 hover:text-gray-600"
                title="삭제"
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 활동 목록 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {education.type === 'presentation'
                  ? '발표 목록'
                  : education.type === 'certificate'
                  ? '자격증 목록'
                  : education.type === 'education'
                  ? '학력 목록'
                  : '어학 성적'}
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleAddActivity(educationIndex, 'top')}
                  variant="secondary"
                  size="sm"
                >
                  위에 추가
                </Button>
                <Button
                  onClick={() => handleAddActivity(educationIndex, 'bottom')}
                  variant="secondary"
                  size="sm"
                >
                  아래에 추가
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              {(education.items || []).map((activity, activityIndex) => (
                <div key={activityIndex} className="relative bg-gray-50 rounded-lg p-4">
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <Button
                      onClick={() => handleMoveActivityUp(educationIndex, activityIndex)}
                      variant="ghost"
                      size="sm"
                      disabled={activityIndex === 0}
                      className="p-1"
                      title="위로 이동"
                    >
                      <ChevronUpIcon className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => handleMoveActivityDown(educationIndex, activityIndex)}
                      variant="ghost"
                      size="sm"
                      disabled={activityIndex === (education.items?.length || 0) - 1}
                      className="p-1"
                      title="아래로 이동"
                    >
                      <ChevronDownIcon className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => handleRemoveActivity(educationIndex, activityIndex)}
                      variant="ghost"
                      size="sm"
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="삭제"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {/* 제목 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        제목
                      </label>
                      <TextInput
                        value={activity.title || ''}
                        onChange={(e) => handleActivityChange(educationIndex, activityIndex, 'title', e.target.value)}
                        onFocus={() => onFocusChange?.({ educationIndex, activityIndex })}
                        onBlur={() => onFocusChange?.(null)}
                        placeholder="활동 제목"
                      />
                    </div>

                    {/* URL/Link */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        링크 URL
                      </label>
                      <TextInput
                        value={activity.url || activity.link || ''}
                        onChange={(e) => {
                          handleActivityChange(educationIndex, activityIndex, 'url', e.target.value);
                          handleActivityChange(educationIndex, activityIndex, 'link', e.target.value);
                        }}
                        onFocus={() => onFocusChange?.({ educationIndex, activityIndex })}
                        onBlur={() => onFocusChange?.(null)}
                        placeholder="https://example.com"
                      />
                    </div>

                    {/* 설명 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        설명
                      </label>
                      <TextArea
                        value={activity.description || ''}
                        onChange={(e) => handleActivityChange(educationIndex, activityIndex, 'description', e.target.value)}
                        onFocus={() => onFocusChange?.({ educationIndex, activityIndex })}
                        onBlur={() => onFocusChange?.(null)}
                        placeholder="활동 설명"
                      />
                    </div>
                  </div>

                  {/* 항목 사이에 추가 버튼 */}
                  {activityIndex < (education.items?.length || 0) - 1 && (
                    <div className="flex justify-center mt-2">
                      <Button
                        onClick={() => handleAddActivityAt(educationIndex, activityIndex, 'after')}
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                      >
                        + 여기에 항목 추가
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