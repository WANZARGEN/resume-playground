import React from 'react';
import { Select } from '../../common/Select';

// 현재 년도 기준으로 최근 20년치 년도 목록 생성
const YEARS = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const DateInput: React.FC<DateInputProps> = ({ value, onChange, placeholder }) => {
  const [selectedYear, selectedMonth] = value ? value.split('.') : ['', ''];

  const yearOptions = YEARS.map(year => ({
    value: year.toString(),
    label: year.toString()
  }));

  const monthOptions = MONTHS.map(month => ({
    value: month,
    label: month
  }));

  return (
    <div className="flex gap-2 w-full">
      <div className="w-[120px]">
        <Select
          value={selectedYear || ''}
          onChange={(year) => onChange(`${year}.${selectedMonth || '01'}`)}
          options={yearOptions}
          placeholder="년도"
          size="sm"
        />
      </div>
      <div className="w-[80px]">
        <Select
          value={selectedMonth || ''}
          onChange={(month) => onChange(`${selectedYear || new Date().getFullYear()}.${month}`)}
          options={monthOptions}
          placeholder="월"
          size="sm"
        />
      </div>
    </div>
  );
};