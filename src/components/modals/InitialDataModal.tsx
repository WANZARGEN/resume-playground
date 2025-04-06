import React from 'react';
import { Dialog } from '@headlessui/react';

interface InitialDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFrontend: () => void;
  onSelectBackend: () => void;
  onSelectEmpty: () => void;
}

export const InitialDataModal: React.FC<InitialDataModalProps> = ({
  isOpen,
  onClose,
  onSelectFrontend,
  onSelectBackend,
  onSelectEmpty,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg rounded bg-white p-6">
          <Dialog.Title className="text-xl font-semibold mb-4">
            이력서 시작하기
          </Dialog.Title>
          <Dialog.Description className="mb-6">
            새로운 이력서를 어떻게 시작하시겠습니까?
          </Dialog.Description>

          <div className="space-y-4">
            <div className="p-4 border rounded hover:bg-gray-50 cursor-pointer" onClick={onSelectFrontend}>
              <h3 className="font-medium">프론트엔드 개발자 샘플</h3>
              <p className="text-sm text-gray-600">React, TypeScript, Next.js 등을 활용한 프론트엔드 개발자 이력서 샘플입니다.</p>
            </div>
            
            <div className="p-4 border rounded hover:bg-gray-50 cursor-pointer" onClick={onSelectBackend}>
              <h3 className="font-medium">백엔드 개발자 샘플</h3>
              <p className="text-sm text-gray-600">Go, Python, Spring 등을 활용한 백엔드 개발자 이력서 샘플입니다.</p>
            </div>

            <div className="p-4 border rounded hover:bg-gray-50 cursor-pointer" onClick={onSelectEmpty}>
              <h3 className="font-medium">빈 이력서로 시작하기</h3>
              <p className="text-sm text-gray-600">처음부터 직접 작성하실 수 있습니다.</p>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}; 