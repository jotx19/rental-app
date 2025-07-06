import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { usePostStore } from "@/store/usePostStore";

interface FetchLatestPostProps {
  onPostClick: (post: any) => void;
  searchTerm?: string;
  priceRange?: string | null;
  postType?: string | null;
  distanceRange?: number | null;
}

const getDaysAgo = (dateString: string) => {
  const postDate = new Date(dateString);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - postDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const FetchLatestPost: React.FC<FetchLatestPostProps> = ({
  onPostClick,
  searchTerm = "",
  priceRange = null,
  postType = null,
  distanceRange = null,
}) => {
  const { getLatestPost } = usePostStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const fetchedPosts = await getLatestPost();
        if (Array.isArray(fetchedPosts)) {
          setPosts(fetchedPosts);
        } else {
          setPosts([]);
        }
      } catch (error) {
        toast.error("Error fetching latest posts.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [getLatestPost]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    }
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.description
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesType = postType ? post.type === postType : true;

    let matchesPrice = true;
    if (priceRange) {
      let min = 0,
        max = Infinity;

      if (priceRange.includes("+")) {
        min = parseInt(priceRange);
      } else {
        const [minStr, maxStr] = priceRange.split("-");
        min = parseInt(minStr);
        max = parseInt(maxStr);
      }

      matchesPrice = post.price >= min && post.price <= max;
    }

    let matchesDistance = true;
    if (
      distanceRange &&
      userLocation &&
      post.location?.coordinates &&
      post.location.coordinates.length === 2
    ) {
      const [postLng, postLat] = post.location.coordinates;
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lon,
        postLat,
        postLng
      );
      matchesDistance = distance <= distanceRange;
    }

    return matchesSearch && matchesType && matchesPrice && matchesDistance;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {Array(8)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="p-2 border rounded-md"
            >
              <Skeleton className="w-full aspect-[16/9] mb-2 rounded-md" />
              <Skeleton className="w-3/4 h-4 mb-1" />
              <Skeleton className="w-1/2 h-3" />
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {filteredPosts.map((post) => (
        <div
          key={post._id}
          className="p-2 border transform transition-transform duration-300 hover:scale-105 rounded-md flex flex-col justify-between relative cursor-pointer"
          onClick={() => onPostClick(post)}
        >
          <div className="w-full aspect-[16/9] overflow-hidden rounded-md relative">
            {post.image ? (
              <img
                src={post.image}
                alt={post.description}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/10" />
            )}

            <Badge className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
              {getDaysAgo(post.createdAt)}
            </Badge>
          </div>

          <h3 className="text-sm text-gray-900 dark:text-white truncate mt-1">
            {post.description}
          </h3>

          <p className="text-xs border text-[#47A8FF] px-2 py-1 rounded-md w-fit mt-1">
            ${post.price}
          </p>

          {distanceRange && userLocation && post.location?.coordinates && (
            <Badge className="text-xs mt-1">
              {(() => {
                const [lng, lat] = post.location.coordinates;
                const d = calculateDistance(
                  userLocation.lat,
                  userLocation.lon,
                  lat,
                  lng
                );
                return `${d.toFixed(2)} km away`;
              })()}
            </Badge>
          )}

          <div className="flex flex-wrap gap-1 mt-1">
            {post.utilities.slice(0, 1).map((utility: string, index: number) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-2 py-0.5 text-[10px] rounded-md"
              >
                {utility}
              </Badge>
            ))}
            <div className="hidden sm:flex flex-wrap gap-1 mt-1">
              {post.utilities.slice(1).map((utility: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-2 py-0.5 text-[10px] rounded-md"
                >
                  {utility}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FetchLatestPost;
