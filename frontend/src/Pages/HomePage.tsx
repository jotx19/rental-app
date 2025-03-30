import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocateFixedIcon, Search } from "lucide-react";
import { usePostStore } from "@/store/usePostStore";
import FetchLatestPost from "@/components/FetchLatestPost";
import FetchPage from "@/components/FetchPost";
import PostSkeletonLoader from "@/components/SkeletonLoader";

const HomePage = () => {
  const navigate = useNavigate();
  const {
    searchLocation,
    searchResults,
    setLocation,
    isCreatingPost,
  } = usePostStore();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

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

  return (
    <div className="relative p-3 flex flex-col">
      <video
        src="hero.mp4"
        autoPlay
        loop
        muted
        className="object-cover rounded-xl w-full md:h-[30vh] h-[20vh] mt-16 "
      />

      <div className="absolute text-white md:w-11/12 lg:w-11/12 w-11/12 justify-center items-center flex md:mt-40 mt-32">
        <div className="relative flex items-center backdrop-blur-lg bg-base-100/80 rounded-full border-white p-3 w-3/4 sm:w-1/2 lg:w-1/3">
          <Search size={25} className="text-white" />
          <Input
            className="border-none w-full shadow-none focus:outline-none active:ring-0 focus:ring-0"
            placeholder="Search here ..."
            value={query}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="flex flex-row justify-between p-4 text-white">
        <div className="gap-2">
          <Link to="/new-post">
            <Button className="bg-primary">New Post</Button>
          </Link>
        </div>
        <div className="">
          <Button className="bg-primary">Get Started</Button>
        </div>
      </div>

      <div className="flex flex-col md:p-8 p-0">
        <div className="p-4">
          <h1 className="md:text-3xl font-bold">Recently Uploaded Post</h1>
          <p className="text-primary/50">Posted recently</p>
        </div>
        <div className="p-2 min-h-[20vh] md:min-h-[40vh] rounded-xl">
          {isCreatingPost ? <PostSkeletonLoader /> : <FetchLatestPost onPostClick={handlePostClick} />}
        </div>
        <div className="p-2 mt-6 min-h-[40vh] border-dashed border-[1px] rounded-xl relative">
          <div className="flex md:justify-between md:flex-row flex-col">
            <h1 className="text-3xl p-2 font-bold underline">Nearby Posts</h1>

            <div className="w-full md:w-1/3 p-3 flex justify-end">
              <div className="relative w-full">
                <LocateFixedIcon
                  size={20}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2"
                />
                <Input
                  className="border w-full pl-10"
                  placeholder="Enter your location"
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
    </div>
  );
};

export default HomePage;
