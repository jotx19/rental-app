import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { usePostStore } from '@/store/usePostStore';
import { AlertCircle } from 'lucide-react';

interface FetchPageProps {
  onPostClick: (post: any) => void;
}

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
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const FetchPage: React.FC<FetchPageProps> = ({ onPostClick }) => {
  const { currentLocation, getNearbyPosts, getCurrentLocation } = usePostStore();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentLocation) {
      getCurrentLocation();
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedPosts = (await getNearbyPosts()) ?? [];
        if (!Array.isArray(fetchedPosts) || fetchedPosts.length === 0) {
          setPosts([]);
          return setError('No nearby posts found.');
        }

        const postsWithDistance = fetchedPosts.map((post: any) => {
          if (
            post?.location?.coordinates &&
            currentLocation?.latitude &&
            currentLocation?.longitude
          ) {
            const [postLon, postLat] = post.location.coordinates;
            const distance = calculateDistance(
              currentLocation.latitude,
              currentLocation.longitude,
              postLat,
              postLon
            );
            return { ...post, distance };
          }
          return post;
        });

        setPosts(postsWithDistance);
      } catch (err: any) {
        console.error('Error fetching posts:', err);
        toast.error('Error fetching posts.');
        setError('Something went wrong while fetching posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentLocation, getNearbyPosts, getCurrentLocation]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {Array(8)
          .fill(null)
          .map((_, index) => (
            <div key={index} className="p-2 border rounded-md shadow-md">
              <Skeleton className="w-full aspect-[16/9] mb-2 rounded-md" />
              <Skeleton className="w-3/4 h-4 mb-1" />
              <Skeleton className="w-1/2 h-3" />
            </div>
          ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {posts.map((post) => (
        <div
          key={post._id}
          className="p-2 border rounded-md shadow-md flex flex-col justify-between relative cursor-pointer hover:shadow-lg transition-shadow"
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
              <div className="w-full h-full bg-primary/10">
                <img src="/placeholder.jpg" alt="No Image" className="w-full h-full object-cover" />
              </div>            )}
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate mt-1">
            {post.description}
          </h3>
          <p className="text-xs font-bold border text-[#47A8FF] px-2 py-1 rounded-md w-fit mt-1">
            ${post.price}
          </p>
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
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
            {post.distance !== undefined
              ? `${post.distance.toFixed(2)} km away`
              : 'Location not available'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FetchPage;
