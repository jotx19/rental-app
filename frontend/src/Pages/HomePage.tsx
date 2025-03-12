import FetchPage from "@/components/FetchPost";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePostStore } from "@/store/usePostStore";
import { LocateFixedIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

const HomePage = () => {
  const { searchLocation, searchResults, setLocation, locationQuery } =
    usePostStore();
  const [query, setQuery] = useState(locationQuery);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setQuery(locationQuery);
  }, [locationQuery]);

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

  return (
    <div className="relative p-2 flex flex-col">
      <video
        src="hero.mp4"
        autoPlay
        loop
        muted
        className="object-cover w-full md:h-[30vh] h-[20vh] mt-20 "
      />

      <div className="flex flex-row justify-between p-4 text-white">
        <div className="gap-2">
          <Button className="bg-primary">New Post</Button>
        </div>
        <div className="">
          <Button className="bg-primary">Get Started</Button>
        </div>
      </div>
     {/* Another section */}
      <div className="gap-10 flex flex-col">
        <div className="p-4">
        <h1 className="text-3xl font-bold">Nearby Posts</h1>
        <p className="text-primary/50">Posted recently</p>
        </div>
        <div className="p-2 min-h-[40vh] border-dashed border-[1px] rounded-xl">
          <FetchPage />
        </div>
        <div className="p-2 min-h-[40vh] border-dashed border-[1px] rounded-xl">
          <h1 className="text-xl p-2 font-bold underline">Nearby Posts</h1>
          <FetchPage />
        </div>
      </div>

      <div className="absolute text-white md:w-11/12 lg:w-11/12 w-11/12 justify-center items-center flex md:mt-40 mt-32">
        <div className="relative flex items-center backdrop-blur-lg bg-base-100/80 rounded-full border-white p-3 w-3/4 sm:w-1/2 lg:w-1/3">
          <LocateFixedIcon size={25} className="" />
          <Input
            className="border-none w-full shadow-none focus:outline-none active:ring-0 focus:ring-0"
            placeholder="Enter your location"
            value={query}
            onChange={handleInputChange}
          />
          {query.length > 0 && (
            <button
              className="absolute right-3 text-gray-500 hover:text-black"
              onClick={() => {
                setQuery("");
                setShowResults(false);
              }}
            >
              <XIcon className="w-5 h-5 bg-white rounded-full" />
            </button>
          )}
        </div>

        {showResults && searchResults.length > 0 && (
          <ul className="absolute mt-45 p-4 w-3/4 sm:w-1/2 lg:w-1/3 backdrop-blur-lg bg-base-100/80 rounded-3xl shadow-md z-50 h-30 overflow-auto">
            {searchResults.map((result: any, index: number) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-white hover:text-black rounded-xl border-none"
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
  );
};

export default HomePage;
