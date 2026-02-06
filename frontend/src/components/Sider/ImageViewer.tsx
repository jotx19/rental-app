// components/ImageViewer.tsx
import { useState } from "react";
import { X, Expand } from "lucide-react";

interface Props {
  src: string;
  alt?: string;
}

const ImageViewer = ({ src, alt }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative w-full max-w-4xl mx-auto">
        <img
          src={src}
          alt={alt}
          className="
            w-full
            h-[360px] md:h-[380px]
            object-cover
            rounded-xl
          "
        />

        <button
          onClick={() => setOpen(true)}
          className="
            absolute top-3 right-3
            bg-black/60 hover:bg-black
            text-white
            p-2 rounded-full
            backdrop-blur
          "
        >
          <Expand size={18} />
        </button>
      </div>

      {open && (
        <div
          className="
            fixed inset-0 z-[9999] min-h-screen
            bg-primary/5 backdrop-blur-xl
            flex items-center justify-center
          "
        >
          <button
            onClick={() => setOpen(false)}
            className="
              absolute top-4 right-4
              text-white bg-black/60
              p-2 rounded-full
            "
          >
            <X />
          </button>

          <img
            src={src}
            alt={alt}
            className="
              max-h-[80vh] max-w-full
              object-contain
              rounded-lg
            "
          />
        </div>
      )}
    </>
  );
};

export default ImageViewer;
