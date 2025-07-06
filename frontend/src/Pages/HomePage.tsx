import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LocateFixedIcon,
  ArrowDown,
  Search,
} from "lucide-react";
import { usePostStore } from "@/store/usePostStore";
import FetchLatestPost from "@/components/FetchLatestPost";
import FetchPage from "@/components/FetchPost";
import PostSkeletonLoader from "@/components/SkeletonLoader";
import Footer from "@/components/Footer";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const HomePage = () => {
  const navigate = useNavigate();
  const { searchLocation, searchResults, setLocation, isCreatingPost } =
    usePostStore();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const faq = useRef<HTMLDivElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length >= 3) {
      searchLocation(value);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleSelectLocation = (lat: number, lon: number, name: string) => {
    setLocation(lat, lon, name);
    setQuery(name);
    setShowResults(false);
  };

  const handlePostClick = (post: any) => {
    navigate(`/post-page/${post.id}`, { state: { post } });
  };
  
  const handleGetStartedClick = () => {
    navigate("/search");
  };

  return (
    <div className="relative p-3 top-10 mt-12 flex flex-col">
      <div className="">
        <div className="flex flex-col gap-1 items-center justify-center text-center">
          <div className="border-primary border-[1px] rounded-full px-1">
            Swipe down for more
          </div>
          <ArrowDown className="text-primary animate-bounce" />
          <h1 className="md:text-7xl text-5xl hidden md:block">Navigation to accommodation</h1>
          <img
            src="/Post.png"
            alt="Accommodation Navigation"
            className="mt-4 w-full max-w-3xl rounded-lg shadow-md"
          />
        </div>
      </div>
      <div className="flex flex-row container mx-auto gap-8 justify-center text-white p-4">
        <div className="gap-2">
          <Link to="/new-post">
            <Button variant='outline' className="flex bg-black items-center">
              <Plus size={20} className="mr-2" /> New Post
            </Button>
          </Link>
        </div>
        <div>
          <Button className="text-primary" variant='outline' onClick={handleGetStartedClick}>
            Explore
          <Search size={20} />
          </Button>
        </div>
      </div>
      

      <div className="flex gap-2 flex-col md:py-3 py-3">
        <h1 className="md:text-3xl  justify-center text-center font-sans p-2 uppercase">Recently Uploaded Post</h1>
        <div className="min-h-[20vh] md:min-h-[40vh] rounded-xl">
          {isCreatingPost ? (
            <PostSkeletonLoader />
          ) : (
            <FetchLatestPost onPostClick={handlePostClick} />
          )}
        </div>

        <div ref={faq} className="p-0 md:p-6 max-w-5xl mx-auto text-center text-lg text-gray-700 mt-6">
          <h2 className="text-6xl text-primary mb-4">FAQ</h2>
          <p className="text-xl text-primary md:text-4xl text-center">
            To find accommodation near you, simply <Badge variant='outline' className=" text-xl md:text-4xl bg-[#9B5DE5] text-white rounded-full">enter your address</Badge> 
            Once you type at least<Badge variant='outline' className="text-xl md:text-4xl bg-[#43E97B] text-black rounded-full">3 characters</Badge>, select your address
            After selecting, you will be able to view the <Badge variant='outline' className="text-xl md:text-4xl bg-[#FFA552] text-white rounded-full">nearby posts</Badge> and listings.
          </p>
        </div>

        <div className="p-2 mt-6 min-h-[40vh] border-dashed border-[1px] rounded-xl relative">
          <div className="flex md:justify-between md:flex-row flex-col">
            <h1 className="text-3xl p-2 underline">Nearby Posts</h1>

            <div className="w-full md:w-1/3 p-3 flex justify-end">
              <div className="relative w-full">
                <LocateFixedIcon
                  size={20}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2"
                />
                <Input
                  className="border w-full pl-10"
                  placeholder="Enter your location (10km)"
                  value={query}
                  onChange={handleInputChange}
                />
                {showResults && searchResults.length > 0 && (
                  <ul className="p-3 shadow-md rounded-lg w-full bg-primary/10 mt-2 absolute z-10">
                    {searchResults.map((result: any, index: number) => (
                      <li
                        key={index}
                        className="p-2 cursor-pointer hover:bg-white/80 hover:text-black rounded-xl"
                        onClick={() =>
                          handleSelectLocation(
                            result.geometry.lat,
                            result.geometry.lng,
                            result.formatted
                          )
                        }
                      >
                        {result.formatted}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <FetchPage onPostClick={handlePostClick} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
