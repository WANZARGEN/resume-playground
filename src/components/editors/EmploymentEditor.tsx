import { Employment, TechStack, WorkDetail } from '../../types/resume';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Props {
  data: Employment[];
  onChange: (data: Employment[]) => void;
}

export default function EmploymentEditor({ data, onChange }: Props) {
  const handleAdd = () => {
    onChange([
      ...data,
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
    onChange(data.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Employment, value: any) => {
    onChange(
      data.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleTechStackAdd = (index: number) => {
    onChange(
      data.map((item, i) =>
        i === index
          ? {
              ...item,
              techStack: [...item.techStack, { name: '' } as TechStack],
            }
          : item
      )
    );
  };

  const handleTechStackRemove = (index: number, techIndex: number) => {
    onChange(
      data.map((item, i) =>
        i === index
          ? {
              ...item,
              techStack: item.techStack.filter((_, j) => j !== techIndex),
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
      data.map((item, i) =>
        i === index
          ? {
              ...item,
              techStack: item.techStack.map((tech, j) =>
                j === techIndex ? { ...tech, name: value } : tech
              ),
            }
          : item
      )
    );
  };

  const handleDetailAdd = (index: number) => {
    onChange(
      data.map((item, i) =>
        i === index
          ? {
              ...item,
              details: [
                ...item.details,
                {
                  title: '',
                  description: '',
                } as WorkDetail,
              ],
            }
          : item
      )
    );
  };

  const handleDetailRemove = (index: number, detailIndex: number) => {
    onChange(
      data.map((item, i) =>
        i === index
          ? {
              ...item,
              details: item.details.filter((_, j) => j !== detailIndex),
            }
          : item
      )
    );
  };

  const handleDetailChange = (
    index: number,
    detailIndex: number,
    field: keyof WorkDetail,
    value: string
  ) => {
    onChange(
      data.map((item, i) =>
        i === index
          ? {
              ...item,
              details: item.details.map((detail, j) =>
                j === detailIndex ? { ...detail, [field]: value } : detail
              ),
            }
          : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {data.map((employment, index) => (
        <div key={index} className="space-y-4">
          {/* 회사 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                회사명
              </label>
              <input
                type="text"
                value={employment.company}
                onChange={(e) => handleChange(index, 'company', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                직위
              </label>
              <input
                type="text"
                value={employment.position}
                onChange={(e) => handleChange(index, 'position', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* 근무 기간 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                시작일
              </label>
              <input
                type="text"
                value={employment.period.start}
                onChange={(e) =>
                  handleChange(index, 'period', {
                    ...employment.period,
                    start: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="YYYY.MM"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                종료일
              </label>
              <input
                type="text"
                value={employment.period.end}
                onChange={(e) =>
                  handleChange(index, 'period', {
                    ...employment.period,
                    end: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="YYYY.MM"
              />
            </div>
          </div>

          {/* 기술 스택 */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                기술 스택
              </label>
              <button
                type="button"
                onClick={() => handleTechStackAdd(index)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                추가
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {employment.techStack.map((tech, techIndex) => (
                <div key={techIndex} className="flex gap-2">
                  <input
                    type="text"
                    value={tech.name}
                    onChange={(e) =>
                      handleTechStackChange(index, techIndex, e.target.value)
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="기술명"
                  />
                  <button
                    type="button"
                    onClick={() => handleTechStackRemove(index, techIndex)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 주요 업무 */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                주요 업무
              </label>
              <button
                type="button"
                onClick={() => handleDetailAdd(index)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                추가
              </button>
            </div>
            <div className="mt-2 space-y-4">
              {employment.details.map((detail, detailIndex) => (
                <div key={detailIndex} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={detail.title}
                      onChange={(e) =>
                        handleDetailChange(
                          index,
                          detailIndex,
                          'title',
                          e.target.value
                        )
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="업무 제목"
                    />
                    <button
                      type="button"
                      onClick={() => handleDetailRemove(index, detailIndex)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      삭제
                    </button>
                  </div>
                  <textarea
                    value={detail.description}
                    onChange={(e) =>
                      handleDetailChange(
                        index,
                        detailIndex,
                        'description',
                        e.target.value
                      )
                    }
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="업무 설명"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 삭제 버튼 */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              회사 삭제
            </button>
          </div>

          {index < data.length - 1 && <hr className="border-gray-200" />}
        </div>
      ))}

      {/* 회사 추가 버튼 */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          회사 추가
        </button>
      </div>
    </div>
  );
} 