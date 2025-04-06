import type { Education, Activity } from '../../types/resume';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Props {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export default function EducationEditor({ data, onChange }: Props) {
  const handleAddEducation = () => {
    onChange([
      ...data,
      {
        type: 'presentation',
        items: []
      },
    ]);
  };

  const handleRemoveEducation = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: Education['type']
  ) => {
    const newData = [...data];
    newData[index] = {
      ...newData[index],
      [field]: value,
      items: newData[index]?.items || []
    };
    onChange(newData);
  };

  const handleAddActivity = (educationIndex: number) => {
    const newData = [...data];
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
    const newData = [...data];
    const activity = newData[educationIndex].items[activityIndex] || { title: '', url: '', description: '' };
    newData[educationIndex].items[activityIndex] = {
      ...activity,
      [field]: value
    };
    onChange(newData);
  };

  const handleRemoveActivity = (educationIndex: number, activityIndex: number) => {
    const newData = [...data];
    newData[educationIndex].items = newData[educationIndex].items.filter(
      (_, i) => i !== activityIndex
    );
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">교육 및 활동</h2>
        <button
          type="button"
          onClick={handleAddEducation}
          className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
        >
          <PlusIcon className="w-4 h-4" />
          <span>섹션 추가</span>
        </button>
      </div>

      {data.map((education, educationIndex) => (
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

            <button
              type="button"
              onClick={() => handleRemoveEducation(educationIndex)}
              className="ml-4 p-1 text-gray-400 hover:text-gray-600"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
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
              <button
                type="button"
                onClick={() => handleAddActivity(educationIndex)}
                className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100"
              >
                <PlusIcon className="w-3 h-3" />
                <span>추가</span>
              </button>
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
                      <input
                        type="text"
                        value={activity.title}
                        onChange={(e) =>
                          handleActivityChange(
                            educationIndex,
                            activityIndex,
                            'title',
                            e.target.value
                          )
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {/* URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL
                      </label>
                      <input
                        type="text"
                        value={activity.url || ''}
                        onChange={(e) =>
                          handleActivityChange(
                            educationIndex,
                            activityIndex,
                            'url',
                            e.target.value
                          )
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {/* 설명 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        설명
                      </label>
                      <textarea
                        value={activity.description || ''}
                        onChange={(e) =>
                          handleActivityChange(
                            educationIndex,
                            activityIndex,
                            'description',
                            e.target.value
                          )
                        }
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
} 