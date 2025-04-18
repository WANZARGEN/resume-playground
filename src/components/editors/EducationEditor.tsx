import type { Education, Activity } from '../../types/resume';
import {  TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '../common/Button';
import { TextInput } from '../common/TextInput';
import { TextArea } from '../common/TextArea';

interface EducationEditorProps {
  data?: Education[];
  onChange: (education: Education[]) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({ data, onChange }) => {
  const education = data || [];

  const handleAddEducation = () => {
    onChange([
      ...education,
      {
        type: 'presentation',
        items: []
      },
    ]);
  };

  const handleRemoveEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: Education['type']
  ) => {
    const newData = [...education];
    newData[index] = {
      ...newData[index],
      [field]: value,
      items: newData[index]?.items || []
    };
    onChange(newData);
  };

  const handleAddActivity = (educationIndex: number) => {
    const newData = [...education];
    if (!newData[educationIndex]) {
      newData[educationIndex] = {
        type: 'presentation',
        items: []
      };
    }
    newData[educationIndex].items.push({
      title: '',
      url: '',
      description: ''
    });
    onChange(newData);
  };

  const handleActivityChange = (
    educationIndex: number,
    activityIndex: number,
    field: keyof Activity,
    value: string
  ) => {
    const newData = [...education];
    const activity = newData[educationIndex].items[activityIndex] || { title: '', url: '', description: '' };
    newData[educationIndex].items[activityIndex] = {
      ...activity,
      [field]: value
    };
    onChange(newData);
  };

  const handleRemoveActivity = (educationIndex: number, activityIndex: number) => {
    const newData = [...education];
    newData[educationIndex].items = newData[educationIndex].items.filter(
      (_, i) => i !== activityIndex
    );
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">교육 및 활동</h2>
        <Button
          onClick={handleAddEducation}
          variant="secondary"
          size="sm"
          className="mt-4"
        >
          섹션 추가
        </Button>
      </div>

      {education.map((education, educationIndex) => (
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

            <Button
              onClick={() => handleRemoveEducation(educationIndex)}
              variant="ghost"
              size="sm"
            >
              삭제
            </Button>
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
              <Button
                onClick={() => handleAddActivity(educationIndex)}
                variant="secondary"
                size="sm"
              >
                항목 추가
              </Button>
            </div>
            <div className="space-y-4">
              {education.items.map((activity, activityIndex) => (
                <div key={activityIndex} className="relative bg-gray-50 rounded-lg p-4">
                  <button
                    type="button"
                    onClick={() => handleRemoveActivity(educationIndex, activityIndex)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>

                  <div className="space-y-4">
                    {/* 제목 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        제목
                      </label>
                      <TextInput
                        value={activity.title || ''}
                        onChange={(e) => handleActivityChange(educationIndex, activityIndex, 'title', e.target.value)}
                        placeholder="활동 제목"
                      />
                    </div>

                    {/* URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL
                      </label>
                      <TextInput
                        value={activity.url || ''}
                        onChange={(e) => handleActivityChange(educationIndex, activityIndex, 'url', e.target.value)}
                        placeholder="URL"
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
                        placeholder="활동 설명"
                      />
                    </div>
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