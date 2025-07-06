import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FetchLatestPost from "@/components/FetchLatestPost";
import { ListFilterPlus } from "lucide-react";

const SearchPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [postType, setPostType] = useState<string | null>(null);
  const [distanceRange, setDistanceRange] = useState<number | null>(null);

  const navigate = useNavigate();

  const handlePostClick = (post: any) => {
    navigate(`/post-page/${post.id}`, { state: { post } });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleApplyFilters = () => {
    console.log("Filters Applied:", {
      searchTerm,
      priceRange,
      postType,
      distanceRange,
    });
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen mt-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto w-full flex gap-2">
        <Input
          type="text"
          placeholder="Search posts..."
          className="flex-1"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <ListFilterPlus className="border rounded-md p-2 h-9 w-9" />
          </DrawerTrigger>
          <DrawerContent className="p-4 flex justify-center items-center">
            <div className="w-full flex flex-col max-w-3xl">
              <h2 className="text-lg mx-auto border rounded-md px-1 m-3">Filters</h2>

              <div className="flex flex-row gap-2">
                <div className="mb-8 flex-1">
                  <Select
                    value={priceRange ?? undefined}
                    onValueChange={setPriceRange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Price range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-500">0 - 500 CAD</SelectItem>
                      <SelectItem value="500-1000">500 - 1000 CAD</SelectItem>
                      <SelectItem value="1000-2000">1000 - 2000 CAD</SelectItem>
                      <SelectItem value="2000+">2000+ CAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-8 flex-1">
                  <Select value={postType ?? undefined} onValueChange={setPostType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">Rent</SelectItem>
                      <SelectItem value="sale">Sale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-8 flex-1">
                  <Select
                    value={distanceRange ? String(distanceRange) : undefined}
                    onValueChange={(val) => setDistanceRange(val ? Number(val) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Distance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 km</SelectItem>
                      <SelectItem value="10">10 km</SelectItem>
                      <SelectItem value="25">25 km</SelectItem>
                      <SelectItem value="50">50 km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleApplyFilters} className="w-full">
                Apply Filters
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="mt-6 max-w-6xl mx-auto w-full">
        <h2 className="text-xl text-center">Posts</h2>
        <div className="p-2">
          <FetchLatestPost
            onPostClick={handlePostClick}
            searchTerm={searchTerm}
            priceRange={priceRange}
            postType={postType}
            distanceRange={distanceRange}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
