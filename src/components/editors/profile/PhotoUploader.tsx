import React from 'react';
import { Button } from '../../common/Button';
import { useImageUrl } from '../../../hooks/useImageUrl';

interface PhotoUploaderProps {
  photo: string;
  onChange: (photo: string | ArrayBuffer | null) => void;
  onDelete: () => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ photo, onChange, onDelete }) => {
  const { getImageUrl } = useImageUrl();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-start gap-4">
      {photo ? (
        <>
          <div className="relative group">
            <img
              src={getImageUrl(photo)}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <label className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer">
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 rounded-full transition-opacity duration-200"></div>
              <span className="relative text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-md">
                변경
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="sr-only"
              />
            </label>
            <div className="absolute -top-3 -right-3">
              <Button
                onClick={onDelete}
                variant="danger"
                size="sm"
                className="rounded-full w-7 h-7 flex items-center justify-center !p-0"
                title="프로필 사진 삭제"
              >
                <span className="sr-only">프로필 사진 삭제</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-medium
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>
      )}
    </div>
  );
};