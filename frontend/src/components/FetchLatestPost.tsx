import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { usePostStore } from '@/store/usePostStore';

interface FetchLatestPostProps {
  onPostClick: (post: any) => void;
  searchTerm?: string;
  priceRange?: string | null;
  postType?: string | null;
}

const getDaysAgo = (dateString: string) => {
  const postDate = new Date(dateString);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - postDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
};

const FetchLatestPost: React.FC<FetchLatestPostProps> = ({ onPostClick }) => {
  const { getLatestPost } = usePostStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const fetchedPosts = await getLatestPost();
        setPosts(typeof fetchedPosts !== 'undefined' ? fetchedPosts : []);
      } catch (error) {
        toast.error('Error fetching latest posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [getLatestPost]);

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
            <div
              key={post._id}
              className="p-2 border transform transition-transform duration-300 hover:scale-105 rounded-md shadow-md flex flex-col justify-between relative"
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
                {/* showing only few for mobile screen */} 
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
