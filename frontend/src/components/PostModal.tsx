import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { ArrowLeft, User, Mail } from "lucide-react";
import { Badge } from "./ui/badge";
import { useAuthStore } from "@/store/useAuthStore";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
}

const PostModal = ({ isOpen, onClose, post }: PostModalProps) => {
  const { authUser } = useAuthStore();

  if (!post || !authUser) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-h-[90vh] min-w-[70vw] p-6 rounded-lg">
        <DialogClose asChild>
          <a
            href="#"
            onClick={() => onClose()}
            className="text-[#47A8FF] hover:underline flex items-center"
          >
            <ArrowLeft className="mr-2 text-[#47A8FF]" />
            Back to Page
          </a>
        </DialogClose>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-[500px]">
            <img
              src={post.image || "/placeholder.jpg"}
              alt={post.description}
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-3 p-7 w-full">
            <p className="text-xl">{post.description}</p>

            <Badge variant="destructive" className="text-md font-semibold">
              ${post.price}
            </Badge>

            <div className="flex flex-wrap gap-2">
              {post.utilities?.map((utility: string, index: number) => (
                <Badge
                  variant="outline"
                  key={index}
                  className="px-3 py-1 text-xs rounded-md"
                >
                  {utility}
                </Badge>
              ))}
            </div>

            <p className="text-sm text-gray-500">
              Distance:{" "}
              {post.distance
                ? `${post.distance.toFixed(2)} km away`
                : "Location not available"}
            </p>
          </div>

          <div className="flex text-center rounded-lg p-2">
            <Badge variant="outline" className="text-sm">
              Posted By
            </Badge>
          </div>

          {/* Flexbox for user details */}
          <div className="flex flex-col md:flex-row gap-4 w-full justify-center items-center">

            {/* Email section */}
            <div className="flex justify-center items-center text-center border gap-2 bg-white text-black rounded-lg p-2 w-full md:w-auto">
              <Mail className="text-[#47A8FF]" />
              <p className="text-sm">{authUser.email}</p>
            </div>

            {/* User Name section */}
            <div className="flex justify-center items-center text-center border gap-2 bg-white text-black rounded-lg p-2 w-full md:w-auto">
              <User size={20} className="text-[#47A8FF]" />
              <p className="text-sm">{authUser.name}</p>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostModal;
