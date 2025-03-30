import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/useAuthStore";
import { ArrowRight } from "lucide-react";

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
  const { authUser } = useAuthStore();
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

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
    if (userLocation && post && post.latitude && post.longitude) {
      const dist = calculateDistance(
        userLocation.lat,
        userLocation.lon,
        post.latitude,
        post.longitude
      );
      setDistance(dist);
    }
  }, [userLocation, post]);

  if (!post || !authUser) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 pb-20">
      <div className="w-full max-w-[600px] rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[500px]">
            <img
              src={post.image || "/placeholder.jpg"}
              alt={post.description}
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-3 p-7 w-full">
            <p className="text-2xl font-semibold">{post.description}</p>

            <Badge variant="destructive" className="text-md font-semibold">
              ${post.price}
            </Badge>

            <div className="flex flex-wrap gap-2">
              {post.utilities?.map((utility: string, index: number) => (
                <Badge
                  variant="outline"
                  key={index}
                  className="px-3 py-1 text-xs rounded-md"
                >
                  {utility}
                </Badge>
              ))}
            </div>

            <p className="text-sm text-gray-500">
              Distance:{" "}
              {distance !== null
                ? `${distance.toFixed(2)} km away`
                : "Location not available"}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 gap-2 left-0 w-full shadow-md border-t p-4 flex justify-end items-center">
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
