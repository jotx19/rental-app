import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Instagram } from 'lucide-react';
import { Link } from "react-router-dom";


const About = () => {
  return (
    <div className="flex justify-center items-cente mt-20 min-h-screen">
      <div className="w-full max-w-6xl p-4">
        <Card className="shadow-lg border-2 rounded-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold text-center">
              About Ottawa Housing
            </CardTitle>
            <CardDescription className="text-lg text-center">
              Central hub to connect individuals and families with housing opportunities in Ottawa.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mt-8 space-y-6">
              <h2 className="text-2xl underline font-semibold">Our Mission</h2>
              <p className="text-lg">
                Ottawa Housing is a non-profit initiative focused on connecting individuals, families, and communities
                with affordable housing in Ottawa. Our mission is to make housing more accessible, transparent, and
                user-friendly, offering an inclusive platform that caters to diverse needs.
              </p>

              <h2 className="text-2xl underline font-semibold">Join Us</h2>
              <p className="text-lg gap-2">
                We are community of developers and designers who are passionate about creating a more connected environment 
                for everyone. If you are interested in contributing to our mission, feel free to reach out to us at
                <span className='text-[#FF90E7] p-1 border-white border-b-2 border-dotted hover:text-white'><Link to='https://discord.gg/Bv8KJ7AEk3'>Discord</Link></span>
                Souce code is open-to-all, feel free to FORK project and develop.
              </p>

              <div className="mt-8 text-center">
                <h3 className="text-xl font-semibold">Follow Us</h3>
                <div className="flex justify-center space-x-6 mt-4">
                  <a
                    href="https://www.instagram.com/skiptraces"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram size={40} />
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
