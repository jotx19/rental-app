import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {toast} from "sonner";
import { Upload, X } from "lucide-react";

const utilitiesOptions = [
  "Furnished",
  "Unfurnished",
  "Parking Available",
  "Pet Friendly",
  "WiFi Included",
  "Heating Included",
  "Water Included",
];

const NewPostPage = () => {
  const [formData, setFormData] = useState({
    price: "",
    description: "",
    type: "",
    utilities: [] as string[],
    image: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (value: string) => {
    setFormData({ ...formData, type: value });
  };

  const handleUtilityToggle = (utility: string) => {
    setFormData((prev) => ({
      ...prev,
      utilities: prev.utilities.includes(utility)
        ? prev.utilities.filter((item) => item !== utility)
        : [...prev.utilities, utility],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormData({ ...formData, image: file });
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFormData({ ...formData, image: null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.price || !formData.type) {
      toast.error("Please fill in all required fields.");
      return;
    }

    toast.success("Form submitted (logic not implemented yet)");
  };

  return (
    <div className="flex md:mt-12 mt-8 justify-center items-center min-h-screen p-6">
      <div className="w-full max-w-2xl space-y-6">
        <h2 className="text-3xl font-bold text-center">Create New Post</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2 space-y-2">
              <Label htmlFor="price">Price<span className="rounded text-black p-1 bg-gray-200">CAD</span></Label>
              <Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} required />
            </div>

            <div className="w-1/2 mt-2 space-y-2">
              <Label>Type</Label>
              <Select onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rent">Rent</SelectItem>
                  <SelectItem value="Sale">Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select Utilities</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {utilitiesOptions.map((utility) => (
                <Button
                  key={utility}
                  type="button"
                  onClick={() => handleUtilityToggle(utility)}
                  className={`py-2 px-4 border transition-all ${
                    formData.utilities.includes(utility)
                      ? "bg-white text-black font-semibold"
                      : "bg-black text-white hover:text-black"
                  }`}
                >
                  {utility}
                </Button>
              ))}
            </div>
          </div>


          <div className="flex justify-center">
            <Button type="submit" className="px-15 py-2 bg-white hover:text-[#5AF2A6] hover:bg-[#001F10] text-black font-semibold text-sm rounded-md">
              Create Post
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPostPage;
