import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePostStore } from "@/store/usePostStore";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const UserPage = () => {
  const { userId } = useParams();
  const { getAllPosts, userPosts } = usePostStore();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      getAllPosts(userId);
    }
  }, [userId, getAllPosts]);

  useEffect(() => {
    if (userPosts.length > 0) {
      setUser(userPosts[0].user);
    }
  }, [userPosts]);

  if (!user) {
    return (
      <div className="max-w-4xl mt-20 mx-auto p-6 text-center">
        <Card className="p-6 shadow-md border rounded-lg">
          <div className="flex items-center gap-6">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="flex flex-col">
              <Skeleton className="w-48 h-6 mb-2" />
              <Skeleton className="w-64 h-4" />
            </div>
          </div>
          <div className="border-t mt-4" />
          <div className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array(4)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="p-2 border rounded-md shadow-md flex flex-col justify-between">
                    <Skeleton className="w-full aspect-[16/9] rounded-md" />
                    <Skeleton className="w-3/4 h-4 mb-1" />
                    <Skeleton className="w-1/2 h-3" />
                  </div>
                ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mt-20 mx-auto p-6">
      <Card className="p-6 shadow-md border rounded-lg">
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user.avatar || "/profile.jpg"} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>
        <div className="border-t mt-4" />
        <div className="mt-6">
          {userPosts.length === 0 ? (
            <p>No posts available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {userPosts.map((post) => (
                <div
                  key={post._id}
                  className="p-2 border rounded-md shadow-md flex flex-col justify-between"
                >
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
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate mt-1">
                    {post.description}
                  </h3>
                  <p className="text-xs font-bold border text-[#47A8FF] px-2 py-1 rounded-md w-fit mt-1">
                    ${post.price}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserPage;
