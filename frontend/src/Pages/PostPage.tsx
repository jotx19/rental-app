import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Phone, Mail, MessageCircle, MapPlus } from "lucide-react";
import { usePostStore } from "@/store/usePostStore";

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const PostPage = () => {
  const { state } = useLocation();
  const { post } = state || {};
  const { getLocationFromCoordinates, locationName } = usePostStore();
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (post?.location?.coordinates) {
      const [longitude, latitude] = post.location.coordinates;
      getLocationFromCoordinates([longitude, latitude]);
    }
  }, [post]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error("Error getting user location: ", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation && post?.location?.coordinates) {
      const [postLongitude, postLatitude] = post.location.coordinates;
      const dist = calculateDistance(
        userLocation.lat,
        userLocation.lon,
        postLatitude,
        postLongitude
      );
      setDistance(dist);
    }
  }, [userLocation, post]);

  if (!post) return "Post not found";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen md:p-6 p-2 pb-20">
      <div className="w-full max-w-7xl rounded-lg">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 w-full md:w-1/2">
            <img
              src={post.image || "/placeholder.jpg"}
              alt={post.description}
              className="w-full h-auto md:h-80 object-cover rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-3 md:w-1/2 p-6">
            <p className="text-3xl font-semibold">{post.description}</p>

            <div className="flex items-center gap-4 mt-3">
              <Badge variant="destructive" className="text-2xl font-bold">
                {post.price ? `$${post.price}` : "Price Not Available"}
              </Badge>
            </div>

            <div className="mt-3">
              <p className="text-md font-semibold">Utilities Include</p>
              <div className="flex flex-wrap gap-2">
                {post.utilities?.map((utility: string, index: number) => (
                  <Badge
                    variant="default"
                    key={index}
                    className="px-3 py-1 text-xs rounded-md"
                  >
                    {utility}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-2 md:max-w-[80vw] truncate">
                <Badge variant="outline" className="text-sm">
                  {locationName}
                </Badge>
              </div>
              <div className="mt-3 flex items-center gap-4">
                <a
                  href={`https://www.google.com/maps?q=${locationName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-1 py-0.5 border rounded-md hover:bg-white hover:text-black"
                >
                  <MapPlus className="mr-2 text-blue-500" /> Click Locate
                </a>
                {distance !== null && (
                  <Badge variant="outline" className="text-sm p-1">
                    {distance.toFixed(2)} km away
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-6 border-dashed border-[1px] rounded-xl p-2">
              <div className="flex md:flex-row flex-col gap-4 mt-2">
                {post.contact && (
                  <a
                    href={`tel:${post.contact}`}
                    className="flex items-center border bg-white p-1 rounded-lg text-blue-500 hover:underline"
                  >
                    <Phone className="mr-2 text-black" /> {post.contact}
                  </a>
                )}
                {post.user?.email && (
                  <a
                    href={`mailto:${post.user?.email}`}
                    className="flex items-center border bg-white p-1 rounded-lg text-blue-500 hover:underline"
                  >
                    <Mail className="mr-2 text-black" /> {post.user?.email}
                  </a>
                )}
              </div>

              <div className="flex items-center text-green-500 mt-4">
                <MessageCircle className="mr-2" />
                <Badge
                  variant="outline"
                  className="text-xs text-green-500 border-green-500"
                >
                  Coming soon
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="fixed bg-[#09090B] bottom-0 gap-2 left-0 w-full shadow-md border-t p-4 flex justify-end items-center">
        <p className="text-md">Posted by:</p>
        <Link
          to={`/user/${post.user?._id}`}
          className="text-blue-500 font-semibold hover:underline inline-flex items-center"
        >
          <span>{post.user?.name || "Unknown User"}</span>
          <ArrowRight size={20} className="-rotate-45" />
        </Link>
      </footer>
    </div>
  );
};

export default PostPage;
