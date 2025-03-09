import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // Import the card component from Shadcn
import { Button } from '@/components/ui/button'; // Import button from Shadcn

const HomePage = () => {
  return (
    <div className="min-h-screen md:m-5 mt-20 flex">
      <div className="w-full p-20 items-center justify-center lg:block hidden lg:w-1/2 flex flex-col">
      <div className='items-center justify-center flex flex-col'>
        <h1 className='text-7xl'>
          Housing Solution for Cities 🍁
        </h1>
      </div>
      </div>

      <div className="w-full lg:w-1/2 relative flex items-center justify-center">
        <video
          src="hero.mp4"
          autoPlay
          loop
          muted
          className="md:w-10/12 w-11/12 md:h-[calc(100vh-15vh)] h-[calc(100vh-70vh)] object-cover rounded-3xl"
        />
        <div className="absolute p-4 bg-white/95 bg-opacity-70 text-black rounded-3xl shadow-md w-full max-w-xs mx-4 sm:mx-8 md:mx-16">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Card Above Video</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This card is placed above the video on the right side</p>
            <Button className="mt-4">Click Me</Button>
          </CardContent>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
