import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocateFixedIcon, Search, CornerDownLeft } from "lucide-react";
import { usePostStore } from "@/store/usePostStore";
import FetchLatestPost from "@/components/FetchLatestPost";
import FetchPage from "@/components/FetchPost";
import PostSkeletonLoader from "@/components/SkeletonLoader";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, MapPin, Upload, Plus } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const { searchLocation, searchResults, setLocation, isCreatingPost } =
    usePostStore();
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

  // New function to handle the redirect when the user enters a search term
  const handleSearchRedirect = () => {
    if (query.trim().length > 0) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative p-3 flex flex-col">
      <video
        src="hero.mp4"
        autoPlay
        loop
        muted
        className="object-cover rounded-xl w-full md:h-[30vh] h-[20vh] mt-16"
      />

      <div className="absolute text-white md:w-11/12 lg:w-11/12 w-11/12 justify-center items-center flex md:mt-40 mt-32">
        <div className="relative flex items-center backdrop-blur-lg bg-base-100/80 rounded-full border-white p-3 w-3/4 sm:w-1/2 lg:w-1/3">
          <Search size={25} className="text-white" />
          <Input
            className="border-none w-full shadow-none focus:outline-none active:ring-0 focus:ring-0 px-3"
            placeholder="Search here ..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearchRedirect()}
          />
          <CornerDownLeft
            size={20}
            className="text-white cursor-pointer"
            onClick={handleSearchRedirect}
          />
        </div>
      </div>

      <div className="flex flex-row justify-between p-4 text-white">
        <div className="gap-2">
          <Link to="/new-post">
            <Button className="bg-primary flex items-center">
              <Plus size={20} className="mr-2" /> New Post
            </Button>
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
          {isCreatingPost ? (
            <PostSkeletonLoader />
          ) : (
            <FetchLatestPost onPostClick={handlePostClick} />
          )}
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

        <div className="mt-12 p-6">
          <h2 className="text-2xl font-bold text-center">
            How to Use This Platform
          </h2>
          <p className="text-gray-600 text-center mt-2">
            Follow these simple steps to get started!
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-6 mt-6">
            <Card>
              <CardHeader className="flex items-center">
                <BookOpen size={28} className="text-primary" />
                <CardTitle className="ml-3 text-lg">Explore Posts</CardTitle>
              </CardHeader>
              <CardContent>
                Browse the latest listings or search for specific locations to
                find the best housing options.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center">
                <MapPin size={28} className="text-primary" />
                <CardTitle className="ml-3 text-lg">
                  Find Nearby Listings
                </CardTitle>
              </CardHeader>
              <CardContent>
                Use our location search to find available posts near you in
                real-time.
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center">
                <Upload size={28} className="text-primary" />
                <CardTitle className="ml-3 text-lg">
                  Post Your Listing
                </CardTitle>
              </CardHeader>
              <CardContent>
                Easily create and share your housing post with others looking
                for a place.
              </CardContent>
            </Card>
          </div>
          <div className="w-full mt-10 max-w-7xl mx-auto">
            <Card className="p-6">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col md:flex-row w-full items-center justify-between gap-6">
                  <div className="w-full md:w-1/2 flex justify-center">
                    <img
                      src="/first.png"
                      alt="First Image"
                      className="h-auto max-h-[50vh] w-full md:w-auto border rounded-lg object-cover"
                    />
                  </div>
                  <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center p-6 rounded-lg">
                    <h1 className="text-2xl font-bold">Create New Post</h1>
                    <p className="text-lg border-white border-b-2 border-none md:border-dotted hover:text-white mt-2">
                      Easily share your housing listing with the community.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col-reverse md:flex-row w-full items-center justify-between gap-6">
                  <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center p-6 rounded-lg">
                    <h1 className="text-2xl font-bold">Find Nearby Listings</h1>
                    <p className="text-lg border-white border-b-2 border-none md:border-dotted hover:text-white mt-2">
                      Search for the best housing options available near you.
                    </p>
                  </div>
                  <div className="w-full md:w-1/2 flex justify-center">
                    <img
                      src="/second.png"
                      alt="Second Image"
                      className="h-auto max-h-[50vh] w-full md:w-auto border rounded-lg object-cover"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
