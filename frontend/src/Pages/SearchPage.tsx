import { useEffect, useState, useRef } from "react";
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
import FetchLatestPost, { FetchLatestPostRef } from "@/components/FetchLatestPost";
import { ListFilterPlus } from "lucide-react";

const SearchPage = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [postType, setPostType] = useState<string | null>(null);
  const [distanceRange, setDistanceRange] = useState<number | null>(null);

  const [draftPriceRange, setDraftPriceRange] = useState<string | null>(null);
  const [draftPostType, setDraftPostType] = useState<string | null>(null);
  const [draftDistanceRange, setDraftDistanceRange] = useState<number | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const fetchRef = useRef<FetchLatestPostRef>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const handlePostClick = (post: any) => {
    navigate(`/post-page/${post.id}`, { state: { post } });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleApplyFilters = () => {
    setPriceRange(draftPriceRange);
    setPostType(draftPostType);
    setDistanceRange(draftDistanceRange);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setPriceRange(null);
    setPostType(null);
    setDistanceRange(null);
    setDraftPriceRange(null);
    setDraftPostType(null);
    setDraftDistanceRange(null);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
                  <Select value={draftPriceRange ?? undefined} onValueChange={setDraftPriceRange}>
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
                  <Select value={draftPostType ?? undefined} onValueChange={setDraftPostType}>
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
                    value={draftDistanceRange !== null ? String(draftDistanceRange) : undefined}
                    onValueChange={(val) => setDraftDistanceRange(val ? Number(val) : null)}
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

              <div className="flex gap-2 mb-3">
                <Button variant="outline" onClick={handleClearFilters} className="w-full">
                  Clear Filters
                </Button>
              </div>
              <Button onClick={handleApplyFilters} className="w-full">
                Apply Filters
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Posts */}
      <div className="mt-6 max-w-6xl mx-auto w-full">
        <div className="p-2">
          <FetchLatestPost
            ref={fetchRef}
            initialLimit={8}
            onPostClick={handlePostClick}
            searchTerm={searchTerm}
            priceRange={priceRange}
            postType={postType}
            distanceRange={distanceRange}
            onPageChange={(page, more) => {
              setCurrentPage(page);
              setHasMore(more);
            }}
          />

          <div className="mt-4 flex justify-center gap-2">
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => fetchRef.current?.loadPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={!hasMore}
              onClick={() => fetchRef.current?.loadPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
