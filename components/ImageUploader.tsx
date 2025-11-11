import React, { useState, useRef } from 'react';
import UploadIcon from './icons/UploadIcon';

interface ImageUploaderProps {
  id: string;
  title: string;
  onImageUpload: (file: File) => void;
  disabled: boolean;
  isOptional?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, title, onImageUpload, disabled, isOptional = false }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload(file);
    }
  };

  const handleAreaClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center">
        {title}
        {isOptional && <span className="text-xs text-gray-500 ml-2">(Optional)</span>}
        </h3>
      <div
        onClick={handleAreaClick}
        className={`relative w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center text-center p-2 transition-colors duration-200 ${
          disabled
            ? 'bg-gray-200 cursor-not-allowed'
            : 'bg-white border-gray-300 hover:border-purple-500 cursor-pointer'
        }`}
      >
        <input
          type="file"
          id={id}
          ref={fileInputRef}
          className="hidden"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          disabled={disabled}
        />
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain rounded-md" />
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <UploadIcon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Click, drag & drop, or paste</span>
            <span className="text-xs">PNG or JPG</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;