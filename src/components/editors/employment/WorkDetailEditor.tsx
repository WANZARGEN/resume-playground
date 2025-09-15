import React from 'react';
import { WorkDetail, WorkItem } from '../../../types/resume';
import { Button } from '../../common/Button';
import { TextInput } from '../../common/TextInput';
import { TextArea } from '../../common/TextArea';
import { TrashIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { parseMarkdownLinks, segmentsToMarkdown } from '../../../utils/markdownParser';

interface WorkDetailEditorProps {
  detail: WorkDetail;
  detailIndex: number;
  employmentIndex: number;
  onDetailChange: (employmentIndex: number, detailIndex: number, detail: WorkDetail) => void;
  onDetailRemove: (employmentIndex: number, detailIndex: number) => void;
  onDetailMoveUp: (employmentIndex: number, detailIndex: number) => void;
  onDetailMoveDown: (employmentIndex: number, detailIndex: number) => void;
  onItemAdd: (employmentIndex: number, detailIndex: number) => void;
  onItemChange: (employmentIndex: number, detailIndex: number, itemIndex: number, field: keyof WorkItem, value: any) => void;
  onItemRemove: (employmentIndex: number, detailIndex: number, itemIndex: number) => void;
  onItemMoveUp: (employmentIndex: number, detailIndex: number, itemIndex: number) => void;
  onItemMoveDown: (employmentIndex: number, detailIndex: number, itemIndex: number) => void;
  onSubItemAdd: (employmentIndex: number, detailIndex: number, itemIndex: number) => void;
  onSubItemChange: (employmentIndex: number, detailIndex: number, itemIndex: number, subItemIndex: number, value: string) => void;
  onSubItemRemove: (employmentIndex: number, detailIndex: number, itemIndex: number, subItemIndex: number) => void;
  onSubItemMoveUp: (employmentIndex: number, detailIndex: number, itemIndex: number, subItemIndex: number) => void;
  onSubItemMoveDown: (employmentIndex: number, detailIndex: number, itemIndex: number, subItemIndex: number) => void;
  isFirst: boolean;
  isLast: boolean;
  onFocusChange?: (focus: { employmentIndex?: number; detailIndex?: number; itemIndex?: number; subItemIndex?: number } | null) => void;
}

export const WorkDetailEditor: React.FC<WorkDetailEditorProps> = ({
  detail,
  detailIndex,
  employmentIndex,
  onDetailChange,
  onDetailRemove,
  onDetailMoveUp,
  onDetailMoveDown,
  onItemAdd,
  onItemChange,
  onItemRemove,
  onItemMoveUp,
  onItemMoveDown,
  onSubItemAdd,
  onSubItemChange,
  onSubItemRemove,
  onSubItemMoveUp,
  onSubItemMoveDown,
  isFirst,
  isLast,
  onFocusChange
}) => {
  return (
    <div className="relative bg-gray-50 rounded-lg p-4 space-y-4">
      {/* Detail controls */}
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <Button
          onClick={() => onDetailMoveUp(employmentIndex, detailIndex)}
          variant="ghost"
          size="sm"
          disabled={isFirst}
          className="p-1"
          title="위로 이동"
        >
          <ChevronUpIcon className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => onDetailMoveDown(employmentIndex, detailIndex)}
          variant="ghost"
          size="sm"
          disabled={isLast}
          className="p-1"
          title="아래로 이동"
        >
          <ChevronDownIcon className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => onDetailRemove(employmentIndex, detailIndex)}
          variant="ghost"
          className="p-1 text-gray-400 hover:text-gray-600"
          size="sm"
        >
          <TrashIcon className="w-4 h-4" />
        </Button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          제목
        </label>
        <TextInput
          value={detail.title}
          onChange={(e) => onDetailChange(employmentIndex, detailIndex, { ...detail, title: e.target.value })}
          onFocus={() => onFocusChange?.({ employmentIndex, detailIndex })}
          onBlur={() => onFocusChange?.(null)}
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
              <div className="flex-1 space-y-2">
                <TextArea
                  value={item.segments && item.segments.length > 0 ? segmentsToMarkdown(item.segments) : (item.text || '')}
                  onChange={(e) => {
                    const text = e.target.value;
                    // Check if text contains markdown links
                    if (text.includes('[') && text.includes('](')) {
                      const segments = parseMarkdownLinks(text);
                      onItemChange(employmentIndex, detailIndex, itemIndex, 'segments', segments);
                      onItemChange(employmentIndex, detailIndex, itemIndex, 'text', undefined);
                    } else {
                      onItemChange(employmentIndex, detailIndex, itemIndex, 'text', text);
                      onItemChange(employmentIndex, detailIndex, itemIndex, 'segments', undefined);
                    }
                  }}
                  onFocus={() => onFocusChange?.({ employmentIndex, detailIndex, itemIndex })}
                  onBlur={() => onFocusChange?.(null)}
                  placeholder="주요 업무 내용을 입력하세요"
                  className="min-h-[60px]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Button
                  onClick={() => onItemMoveUp(employmentIndex, detailIndex, itemIndex)}
                  variant="ghost"
                  size="sm"
                  disabled={itemIndex === 0}
                  className="p-1"
                  title="위로 이동"
                >
                  <ChevronUpIcon className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => onItemMoveDown(employmentIndex, detailIndex, itemIndex)}
                  variant="ghost"
                  size="sm"
                  disabled={itemIndex === detail.items.length - 1}
                  className="p-1"
                  title="아래로 이동"
                >
                  <ChevronDownIcon className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onItemRemove(employmentIndex, detailIndex, itemIndex)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="삭제"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Sub Items */}
            <div className="pl-4 space-y-2">
              {item.subItems?.map((subItem, subIndex) => (
                <div key={subIndex} className="flex items-start gap-2">
                  <div className="flex-1">
                    <TextArea
                      value={subItem}
                      onChange={(e) => onSubItemChange(employmentIndex, detailIndex, itemIndex, subIndex, e.target.value)}
                      onFocus={() => onFocusChange?.({ employmentIndex, detailIndex, itemIndex, subItemIndex: subIndex })}
                      onBlur={() => onFocusChange?.(null)}
                      placeholder="세부 업무 내용을 입력하세요"
                      className="min-h-[60px]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      onClick={() => onSubItemMoveUp(employmentIndex, detailIndex, itemIndex, subIndex)}
                      variant="ghost"
                      size="sm"
                      disabled={subIndex === 0}
                      className="p-1"
                      title="위로 이동"
                    >
                      <ChevronUpIcon className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => onSubItemMoveDown(employmentIndex, detailIndex, itemIndex, subIndex)}
                      variant="ghost"
                      size="sm"
                      disabled={subIndex === (item.subItems?.length || 0) - 1}
                      className="p-1"
                      title="아래로 이동"
                    >
                      <ChevronDownIcon className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSubItemRemove(employmentIndex, detailIndex, itemIndex, subIndex)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="삭제"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSubItemAdd(employmentIndex, detailIndex, itemIndex)}
              >
                + 세부 업무 추가
              </Button>
            </div>
          </div>
        ))}

        <Button
          onClick={() => onItemAdd(employmentIndex, detailIndex)}
          variant="secondary"
          size="sm"
        >
          + 항목 추가
        </Button>
      </div>
    </div>
  );
};