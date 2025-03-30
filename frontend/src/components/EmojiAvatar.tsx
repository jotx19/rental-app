import { cn } from "@/lib/utils";

const emojis = ["😀", "😎", "🔥", "🚀", "💡", "🌟", "🎨", "💥", "💎", "🦄"];
const colors = [
  "bg-red-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-teal-500",
];

const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const EmojiAvatar = () => {
  const emoji = getRandomElement(emojis);
  const bgColor = getRandomElement(colors);

  return (
    <div
      className={cn(
        "w-24 h-24 flex items-center justify-center rounded-full text-4xl font-bold text-white",
        bgColor
      )}
    >
      {emoji}
    </div>
  );
};

export default EmojiAvatar;
