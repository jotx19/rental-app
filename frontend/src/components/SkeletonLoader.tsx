import { Skeleton } from "@/components/ui/skeleton";

const PostSkeletonLoader = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="w-full aspect-[16/9] mb-2 rounded-md" />
      <Skeleton className="w-3/4 h-4 mb-1" />
      <Skeleton className="w-1/2 h-3" />
    </div>
  );
};

export default PostSkeletonLoader;
