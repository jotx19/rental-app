import { useEffect, useState } from 'react';
import { toast } from 'sonner';  // You are using sonner for toasts
import { Skeleton } from '@/components/ui/skeleton';  // Assuming you have a skeleton component
import { Badge } from '@/components/ui/badge';  // Assuming you have a Badge component from Shadcn
import { usePostStore } from '@/store/usePostStore';  // Assuming you have the store for managing posts

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
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading
        ? Array(6)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="p-4 border rounded-md shadow-md">
                <Skeleton className="w-full h-48 mb-4" />
                <Skeleton className="w-2/3 h-6 mb-2" />
                <Skeleton className="w-1/2 h-6" />
              </div>
            ))
        : posts.map((post) => (
            <div key={post._id} className="p-4 border rounded-md shadow-md flex flex-col justify-between">
              <div className="mb-4">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.description}
                    className="w-full h-48 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-48 bg-primary/10 rounded-md"></div>
                )}
              </div>

              <h3 className="text-xl font-semibold">{post.description}</h3>
              <p className="text-lg font-medium text-white">${post.price}</p>

              <div className="flex gap-2 my-2">
                {post.utilities.map((utility: string, index: number) => (
                  <Badge key={index} className="px-3 py-1 text-xs rounded-md">
                    {utility}
                  </Badge>
                ))}
              </div>

              <p className="text-sm text-gray-500">
                {post.distance
                  ? `${post.distance.toFixed(2)} km away`
                  : 'Location not available'}
              </p>
            </div>
          ))}
    </div>
  );
};

export default FetchPage;
