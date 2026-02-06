import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
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
  initialLimit?: number;
  loadMoreStep?: number;
  onPageChange?: (page: number, hasMore: boolean) => void;
}

// Expose methods via ref
export interface FetchLatestPostRef {
  loadMore: () => void;
  loadPage: (page: number) => void;
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
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const FetchLatestPost = forwardRef<FetchLatestPostRef, FetchLatestPostProps>(
  (
    {
      onPostClick,
      searchTerm = "",
      priceRange = null,
      postType = null,
      distanceRange = null,
      initialLimit = 8,
      loadMoreStep = 10,
      onPageChange,
    },
    ref
  ) => {
    const { getLatestPost } = usePostStore();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const fetchPosts = async (fetchPage: number, reset = false) => {
      setLoading(true);
      try {
        let minPrice: number | undefined;
        let maxPrice: number | undefined;

        if (priceRange) {
          if (priceRange.includes("+")) minPrice = parseInt(priceRange);
          else {
            const [minStr, maxStr] = priceRange.split("-");
            minPrice = parseInt(minStr);
            maxPrice = parseInt(maxStr);
          }
        }

        const res = await getLatestPost({
          page: fetchPage,
          limit: reset ? initialLimit : loadMoreStep,
          search: searchTerm,
          type: postType || "",
          minPrice,
          maxPrice,
        });

        const fetchedPosts = res?.posts || [];

        setPosts((prev) => (reset ? fetchedPosts : [...prev, ...fetchedPosts]));

        const more = fetchedPosts.length >= (reset ? initialLimit : loadMoreStep);
        setHasMore(more);
        if (onPageChange) onPageChange(fetchPage, more);
      } catch (error) {
        toast.error("Error fetching posts.");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      setPage(1);
      fetchPosts(1, true);
    }, [getLatestPost, searchTerm, priceRange, postType]);

    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
          (err) => console.error("Geolocation error:", err)
        );
      }
    }, []);
    useImperativeHandle(ref, () => ({
      loadMore: () => {
        if (!hasMore || loading) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPosts(nextPage, false);
      },
      loadPage: (pageNumber: number) => {
        setPage(pageNumber);
        fetchPosts(pageNumber, true);
      },
    }));

    const filteredPosts = posts.filter((post) => {
      if (!distanceRange || !userLocation || !post.location?.coordinates) return true;
      const [lng, lat] = post.location.coordinates;
      const distance = calculateDistance(userLocation.lat, userLocation.lon, lat, lng);
      return distance <= distanceRange;
    });

    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {loading && posts.length === 0
          ? Array(initialLimit)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="p-2 border rounded-md">
                  <Skeleton className="w-full aspect-[16/9] mb-2 rounded-md" />
                  <Skeleton className="w-3/4 h-4 mb-1" />
                  <Skeleton className="w-1/2 h-3" />
                </div>
              ))
          : filteredPosts.map((post) => (
              <div
                key={post._id}
                className="p-2 border transform transition-transform duration-300 hover:scale-105 rounded-md flex flex-col justify-between relative cursor-pointer"
                onClick={() => onPostClick(post)}
              >
                <div className="w-full aspect-[16/9] overflow-hidden rounded-md relative">
                  {post.image ? (
                    <img src={post.image} alt={post.description} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary/10">
                      <img src="/placeholder.jpg" alt="No Image" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <Badge className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                    {getDaysAgo(post.createdAt)}
                  </Badge>
                </div>

                <h3 className="text-sm text-gray-900 dark:text-white truncate mt-1">{post.description}</h3>
                <p className="text-xs border text-[#47A8FF] px-2 py-1 rounded-md w-fit mt-1">${post.price}</p>

                {distanceRange && userLocation && post.location?.coordinates && (
                  <Badge className="text-xs mt-1">
                    {(() => {
                      const [lng, lat] = post.location.coordinates;
                      const d = calculateDistance(userLocation.lat, userLocation.lon, lat, lng);
                      return `${d.toFixed(2)} km away`;
                    })()}
                  </Badge>
                )}

                <div className="flex flex-wrap gap-1 mt-1">
                  {post.utilities?.slice(0, 1).map((u: string, i: number) => (
                    <Badge key={i} variant="secondary" className="px-2 py-0.5 text-[10px] rounded-md">
                      {u}
                    </Badge>
                  ))}
                  <div className="hidden sm:flex flex-wrap gap-1 mt-1">
                    {post.utilities?.slice(1).map((u: string, i: number) => (
                      <Badge key={i} variant="secondary" className="px-2 py-0.5 text-[10px] rounded-md">
                        {u}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
      </div>
    );
  }
);

export default FetchLatestPost;
