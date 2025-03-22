import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  imagePreview: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageChange, imagePreview }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          onImageChange(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    onImageChange(null);
  };

  return (
    <div className="space-y-2">
      <Label>Upload Image</Label>
      <div className="relative w-full h-38 bg-transparent rounded-lg border border-dashed flex items-center justify-center cursor-pointer">
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-38 object-cover rounded-lg border border-zinc-700"
          />
        ) : (
          <Upload className="text-gray-500 text-3xl" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          ref={fileInputRef}
        />
        {imagePreview && (
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
            type="button"
          >
            <X className="text-black text-sm" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
