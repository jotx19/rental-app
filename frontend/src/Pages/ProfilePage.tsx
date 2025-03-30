import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { usePostStore } from "@/store/usePostStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePage = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { getAllPosts, userPosts, isFetchingPosts } = usePostStore();
  const [loading, setLoading] = useState<boolean>(isFetchingPosts);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser && authUser._id) {
      getAllPosts(authUser._id);
    }
  }, [authUser, getAllPosts]);

  useEffect(() => {
    setLoading(isFetchingPosts);
  }, [isFetchingPosts]);

  if (isCheckingAuth) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!authUser) {
    return <p className="text-center mt-10 text-red-500">User not authenticated</p>;
  }

  return (
    <div className="max-w-4xl mt-20 mx-auto p-6">
      <Card className="p-6 shadow-md border rounded-lg">
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src="/profile.jpg" alt={authUser.name} />
            <AvatarFallback>{authUser.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">{authUser.name}</h2>
            <p className="text-gray-500 text-sm">{authUser.email}</p>

            <div className="mt-3 flex gap-3">
              <Button variant="outline">Edit Profile</Button>
            </div>
          </div>
        </div>

        <div className="border-t mt-4" />

        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array(8)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="p-2 border rounded-md shadow-md">
                    <Skeleton className="w-full aspect-[16/9] mb-2 rounded-md" />
                    <Skeleton className="w-3/4 h-4 mb-1" />
                  </div>
                ))}
            </div>
          ) : userPosts.length > 0 ? (
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
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
