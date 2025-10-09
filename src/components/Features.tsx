import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Blocks, 
  Settings2, 
  Images, 
  Brain, 
  BookText, 
  ListCheck, 
  SlidersHorizontal, 
  UserCheck, 
  Camera, 
  MousePointerClick,
  MessageCircle,
  Phone,
  WifiOff
} from "lucide-react";

export default function Features() {
  return (
    <div className="pb-20 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto py-12 px-6">
        <h2 className="text-3xl leading-10 sm:text-4xl md:text-[40px] md:leading-13 font-semibold tracking-tight">
         The 3-Step Magic
        </h2>
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-3 gap-6">

          {/* Card 1 */}
          <div className="bg-muted rounded-xl p-6 col-span-1 md:col-span-2 lg:col-span-1">
            {/* Media 1 Mobile */}
            <div className="md:hidden mb-6 aspect-video w-full bg-background rounded-xl"></div>

            <span className="text-xl font-semibold tracking-tight">
              Step 1: Landlord Posts (3 minutes)
            </span>

            <ul className="mt-6 space-y-4">
              <li>
                <div className="flex items-start gap-3">
                  <Images className="shrink-0" />
                  <p className="-mt-0.5">
                    Upload 5 photos → Auto-compressed and optimized
                  </p>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <BookText className="shrink-0" />
                  <p className="-mt-0.5">
                    Enter: price, bedrooms, exact building/floor
                  </p>
                </div>
              </li>
                            <li>
                <div className="flex items-start gap-3">
                  <Brain className="shrink-0" />
                  <p className="-mt-0.5">
                    AI writes compelling description automatically
                  </p>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <ListCheck className="shrink-0"/>
                  <p className="-mt-0.5">
                    Listing goes live instantly
                  </p>
                </div>
              </li>
            </ul>
          </div>
          {/* Media 1 Desktop */}
          <div className="hidden md:block bg-muted rounded-xl col-span-1 md:col-span-3 lg:col-span-2"></div>

          {/* Media 2 Desktop */}
          <div className="hidden md:block bg-muted rounded-xl col-span-1 md:col-span-3 lg:col-span-2"></div>

          {/* Card 2 */}
          <div className="bg-muted rounded-xl p-6 col-span-1 md:col-span-2 lg:col-span-1">
            {/* Media 2 Mobile */}
            <div className="md:hidden mb-6 aspect-video w-full bg-background rounded-xl"></div>

            <span className="text-xl font-semibold tracking-tight">
              Step 2: Tenant Discovers (30 seconds)
            </span>

            <ul className="mt-6 space-y-4">
              <li>
                <div className="flex items-start gap-3">
                  <SlidersHorizontal className="shrink-0"/>
                  <p className="-mt-0.5">
                    Smart filters: budget, location, move-in date
                  </p>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <UserCheck className="shrink-0" />
                  <p className="-mt-0.5">
                    See only verified, available units
                  </p>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <Camera className="shrink-0" />
                  <p className="-mt-0.5">
                    High-quality photos + AI-generated descriptions
                  </p>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <MousePointerClick className="shrink-0" />
                  <p className="-mt-0.5">
                    One-click "I'm Interested" button
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-muted rounded-xl p-6 col-span-1 md:col-span-2 lg:col-span-1">
            {/* Media 1 Mobile */}
            <div className="md:hidden mb-6 aspect-video w-full bg-background rounded-xl"></div>

            <span className="text-xl font-semibold tracking-tight">
              Step 3: Instant Connection (Real-time)
            </span>

            <ul className="mt-6 space-y-4">
              <li>
                <div className="flex items-start gap-3">
                  <MessageCircle className="shrink-0" />
                  <p className="-mt-0.5">
                    Landlord gets SMS: tenant name, budget, timeline, phone number
                  </p>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <Phone className="shrink-0" />
                  <p className="-mt-0.5">
                    Both parties connect directly via call/text
                  </p>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3">
                  <WifiOff className="shrink-0" />
                  <p className="-mt-0.5">
                    Deal closes offline (we stay out of the way)
                  </p>
                </div>
              </li>
            </ul>

          </div>
          {/* Media 3 Desktop */}
          <div className="hidden md:block bg-muted rounded-xl col-span-1 md:col-span-3 lg:col-span-2"></div>
        </div>
      </div>
    </div>
  );
};