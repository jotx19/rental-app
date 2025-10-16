import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { usePostStore } from "@/store/usePostStore";
import { useNavigate } from "react-router-dom";
import ImageUpload from "@/components/ImageUpload";

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
  const { createPost, searchLocation, setLocation, searchResults } = usePostStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    price: "",
    description: "",
    type: "",
    utilities: [] as string[],
    image: null as File | null,
    address: "",
    latitude: 0,
    longitude: 0,
    contact: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.address.length >= 3) {
      searchLocation(formData.address);
    }
  }, [formData.address, searchLocation]);

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

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.price || !formData.type || !formData.utilities.length || !formData.latitude || !formData.longitude || !formData.contact) {
      toast.error("Please fill in all required fields and ensure location is fetched.");
      return;
    }

    setLoading(true);

    try {
      const result = await createPost({
        price: formData.price,
        description: formData.description,
        type: formData.type,
        utilities: formData.utilities,
        latitude: formData.latitude,
        longitude: formData.longitude,
        image: formData.image,
        contact: formData.contact,
      });

      if (result) {
        setFormData({
          price: "",
          description: "",
          type: "",
          utilities: [],
          image: null,
          address: "",
          latitude: 0,
          longitude: 0,
          contact: "",
        });
        setImagePreview(null);
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (lat: number, lon: number, name: string) => {
    setLocation(lat, lon, name);
    setFormData((prev) => ({
      ...prev,
      address: name,
      latitude: lat,
      longitude: lon,
    }));
  };

  return (
    <div className="flex md:mt-12 mt-8 justify-center items-center min-h-screen p-6">
      <div className="w-full max-w-5xl space-y-6">
        <h2 className="text-3xl font-bold text-center mb-8">Create New Post</h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 grid-cols-1 gap-8 items-start">
          <div className="flex flex-col items-center justify-start space-y-4">
            <ImageUpload onImageChange={handleImageChange} imagePreview={imagePreview} />
            <p className="text-sm text-gray-500 text-center">
              Upload an image to make your post stand out.
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="description">Title</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="w-full space-y-2">
                <Label htmlFor="price">
                  Price <span className="rounded text-black bg-gray-200 px-1">CAD</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="w-full space-y-2">
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

              <div className="w-full space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  name="contact"
                  type="tel"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter contact number"
                />
              </div>
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="address">Location</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter Location"
              />
              {searchResults.length > 0 && (
                <ul className="p-3 shadow-md rounded-lg bg-primary/90 absolute z-10 mt-1 w-full">
                  {searchResults.map((result) => (
                    <li key={result.formatted}>
                      <div
                        onClick={() =>
                          handleAddressSelect(result.geometry.lat, result.geometry.lng, result.formatted)
                        }
                        className="p-2 cursor-pointer hover:bg-white/80 hover:text-black dark:text-black text-white rounded-xl"
                      >
                        {result.formatted}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
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

            <div className="flex justify-center mt-6">
              <Button
                type="submit"
                disabled={loading}
                className={`px-15 py-2 font-semibold text-sm rounded-md transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#5AF2A6] hover:text-[#5AF2A6] hover:bg-[#001F10] text-black"
                }`}
              >
                {loading ? "Creating..." : "Create Post"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPostPage;
