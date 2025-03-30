import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { usePostStore } from "@/store/usePostStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EmojiAvatar from "@/components/EmojiAvatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const ProfilePage = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { getAllPosts, userPosts, isFetchingPosts, deletePost } = usePostStore();
  const [loading, setLoading] = useState<boolean>(isFetchingPosts);
  const [selectedPost, setSelectedPost] = useState<{ _id: string; [key: string]: any } | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

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
    return null;
  }

  const handleDeletePost = async () => {
    if (selectedPost) {
      await deletePost(selectedPost._id);
      setOpenDialog(false); 
    }
  };

  const handleContextMenu = (e: React.MouseEvent, post: any) => {
    e.preventDefault();
    setSelectedPost(post);
    setOpenDialog(true); 
  };

  return (
    <div className="max-w-4xl mt-20 mx-auto p-6">
      <Card className="p-6 border rounded-lg">
        <div className="flex items-center gap-6">
          <EmojiAvatar /> 

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
                  onContextMenu={(e) => handleContextMenu(e, post)} 
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

                  <Button
                    variant="destructive"
                    className="mt-2"
                    onClick={() => {
                      setSelectedPost(post);
                      setOpenDialog(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post?</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this post? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePost}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
