import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { usePostStore } from '@/store/usePostStore';

const FetchPage = () => {
  const { currentLocation, getNearbyPosts } = usePostStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!currentLocation) return;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const fetchedPosts = await getNearbyPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        toast.error('Error fetching posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentLocation, getNearbyPosts]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {loading
        ? Array(8)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="p-2 border rounded-md shadow-md">
                <Skeleton className="w-full aspect-[16/9] mb-2 rounded-md" />
                <Skeleton className="w-3/4 h-4 mb-1" />
                <Skeleton className="w-1/2 h-3" />
              </div>
            ))
        : posts.map((post) => (
            <div key={post._id} className="p-2 border rounded-md shadow-md flex flex-col justify-between">
              {/* Image Section (Rectangular 16:9 Aspect Ratio) */}
              <div className="w-full aspect-[16/9] overflow-hidden rounded-md">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.description}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10" />
                )}
              </div>

              {/* Post Info */}
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate mt-1">
                {post.description}
              </h3>

              {/* Price with $ Sign */}
              <p className="text-xs font-bold text-black bg-primary px-2 py-1 rounded-md w-fit mt-1">
                ${post.price}
              </p>

              {/* Utilities as Badges */}
              <div className="flex flex-wrap gap-1 mt-1">
                {post.utilities.map((utility: string, index: number) => (
                  <Badge key={index} variant="secondary" className="px-2 py-0.5 text-[10px] rounded-md">
                    {utility}
                  </Badge>
                ))}
              </div>

              {/* Distance Info */}
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
