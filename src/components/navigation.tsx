
"use client";

import * as React from "react"
import Link from "next/link"
import { CircleCheckIcon, CircleHelpIcon, CircleIcon, HomeIcon, House, HouseIcon, StoreIcon, Warehouse, HousePlug, Hotel, PrinterCheck, MessageCircle } from "lucide-react"
import { Suspense, useState, useEffect } from "react"
import MessageNotificationBadge from "./MessageNotificationBadge"
import ChatModal from "./ChatModal"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import { Button } from "./ui/button"
import SiteLogo from "./widgets/SiteLogo"
import Image from "next/image"
import { UserButton } from "@stackframe/stack";


const components: { title: string; href: string; description: string, icon: React.ElementType, imageLink: string }[] = [
  {
    title: "Studio Unit",
    href: "/docs/primitives/alert-dialog",
    description:
      "Usually 18–30 sqm, single open space with no separate bedroom.",
    icon : HouseIcon, 
    imageLink : "/condo-studio.jpg",
  },
  {
    title: "1-Bedroom Unit",
    href: "/docs/primitives/hover-card",
    description:
      "Has one enclosed bedroom, often 30–50 sqm.",
    icon : HouseIcon, 
    imageLink : "/1-bedroom.jpg",

  },
  {
    title: "2-Bedroom Unit",
    href: "/docs/primitives/progress",
    description:
      "Larger, typically 40–80 sqm.",
    icon : HouseIcon, 
    imageLink : "/2-Bedroomunit.jpg",
  },
  {
    title: "3-Bedroom Unit",
    href: "/docs/primitives/scroll-area",
    description: "For families, often 70 sqm and above.",
    icon : HouseIcon, 
    imageLink : "/3-Bedroomunit.jpg",
  },
  {
    title: "Loft Unit",
    href: "/docs/primitives/tabs",
    description:
      "Has a high ceiling and a mezzanine/second level inside the unit.",
    icon : HouseIcon, 
    imageLink : "/condo-lofi.webp",
  },
  {
    title: "Penthouse",
    href: "/docs/primitives/tooltip",
    description:
      "The topmost unit in the building, usually luxury size with best views.",
    icon : HouseIcon, 
    imageLink : "/penthouse.jpg",
  },
]

export default function Navigation() {
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState<string>("");
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userResponse = await fetch('/api/auth/user');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }
        
        const statusResponse = await fetch('/api/auth/status');
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setStatus(statusData.status || "");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    
    loadUserData();
  }, []);

  return (
    <header className="py-4 shadow sticky top-0 z-50 backdrop-blur-sm transition-colors bg-fd-background/80">
        <div className="max-w-7xl mx-auto flex items-center">
            <SiteLogo/>
            <NavigationMenu className= "mr-auto ml-5" viewport={false}>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link href="/rentals">Rentals</Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    {/* <NavigationMenuItem>
                      <NavigationMenuTrigger>Home</NavigationMenuTrigger>
                      <NavigationMenuContent>
                          <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                          <li className="row-span-3">
                              <NavigationMenuLink asChild>
                              <a
                                  className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                                  href="/"
                              >
                                  <div className="mt-4 mb-2 text-lg font-medium">
                                  shadcn/ui
                                  </div>
                                  <p className="text-muted-foreground text-sm leading-tight">
                                  Beautifully designed components built with Tailwind CSS.
                                  </p>
                              </a>
                              </NavigationMenuLink>
                          </li>
                          <ListItem href="/docs" title="Introduction">
                              Re-usable components built using Radix UI and Tailwind CSS.
                          </ListItem>
                          <ListItem href="/docs/installation" title="Installation">
                              How to install dependencies and structure your app.
                          </ListItem>
                          <ListItem href="/docs/primitives/typography" title="Typography">
                              Styles for headings, paragraphs, lists...etc
                          </ListItem>
                          </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem> */}
                    <NavigationMenuItem>
                    <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                      <NavigationMenuContent>
                          <ul className="grid w-[700px] gap-2 md:w-[800px] md:grid-cols-2 lg:w-[900px]">
                          {components.map((component) => (
                              <ListItem
                              key={component.title}
                              href={"/category/" + encodeURIComponent(component.title.toLowerCase().replace(/\s+/g, '-'))}
                              >
                                <div className="flex">
                                  <div className="col w-[80%] pr-3">
                                    <div className="flex mb-1">
                                      <component.icon className="mr-2 h-4 w-4 mr-2" />
                                      <h3 className="font-bold">{component.title}</h3>
                                    </div>
                                    {component.description}
                                  </div>
                                  <div className="col flex items-center justify-center w-[20%]"> 
                                    <img src={component.imageLink} alt="" className="w-[100%] object-cover h-[100px] rounded"/>
                                  </div>
                                </div>
                              </ListItem>
                          ))}
                          </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    {/* <NavigationMenuItem>
                    <NavigationMenuTrigger>List</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-4">
                        <li>
                            <NavigationMenuLink asChild>
                            <Link href="#">
                                <div className="font-medium">Components</div>
                                <div className="text-muted-foreground">
                                Browse all components in the library.
                                </div>
                            </Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink asChild>
                            <Link href="#">
                                <div className="font-medium">Documentation</div>
                                <div className="text-muted-foreground">
                                Learn how to use the library.
                                </div>
                            </Link>
                            </NavigationMenuLink>
                            <NavigationMenuLink asChild>
                            <Link href="#">
                                <div className="font-medium">Blog</div>
                                <div className="text-muted-foreground">
                                Read our latest blog posts.
                                </div>
                            </Link>
                            </NavigationMenuLink>
                        </li>
                        </ul>
                    </NavigationMenuContent>
                    </NavigationMenuItem> */}
                    {/* <NavigationMenuItem>
                      <NavigationMenuTrigger>Simple</NavigationMenuTrigger>
                      <NavigationMenuContent>
                          <ul className="grid w-[200px] gap-4">
                          <li>
                              <NavigationMenuLink asChild>
                              <Link href="#">Components</Link>
                              </NavigationMenuLink>
                              <NavigationMenuLink asChild>
                              <Link href="#">Documentation</Link>
                              </NavigationMenuLink>
                              <NavigationMenuLink asChild>
                              <Link href="#">Blocks</Link>
                              </NavigationMenuLink>
                          </li>
                          </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem> */}
                    {/* <NavigationMenuItem>
                      <NavigationMenuTrigger>With Icon</NavigationMenuTrigger>
                      <NavigationMenuContent>
                          <ul className="grid w-[200px] gap-4">
                          <li>
                              <NavigationMenuLink asChild>
                              <Link href="#" className="flex-row items-center gap-2">
                                  <CircleHelpIcon />
                                  Backlog
                              </Link>
                              </NavigationMenuLink>
                              <NavigationMenuLink asChild>
                              <Link href="#" className="flex-row items-center gap-2">
                                  <CircleIcon />
                                  To Do
                              </Link>
                              </NavigationMenuLink>
                              <NavigationMenuLink asChild>
                              <Link href="#" className="flex-row items-center gap-2">
                                  <CircleCheckIcon />
                                  Done
                              </Link>
                              </NavigationMenuLink>
                          </li>
                          </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem> */}
                </NavigationMenuList>
            </NavigationMenu>
{user ? (
              <>
                {/*Sign out Button*/}
                <>
                  <div className="signed-in-user ml-auto flex items-center">
                    {status !== "LANDLORD" && (
                      <Button className="mr-4">
                        <Link href="/landlord/register">
                          Be a Landlord
                        </Link>
                      </Button>
                    )}

                  <div className="flex items-center gap-2 mr-4">
                    <Button>
                      <Link href="/landlord/listings">
                        Listings
                      </Link>
                    </Button>
                    {user && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="relative"
                        onClick={() => setIsChatModalOpen(true)}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <Suspense fallback={null}>
                          <MessageNotificationBadge />
                        </Suspense>
                      </Button>
                    )}
                  </div>
                  <UserButton />
                  </div>
                </>
              </>
            ) : (
              <>
                {/*Sign Button*/}
                <Button
                  variant="ghost"
                  className="flex ml-auto items-center gap-2"
                  asChild
                >
                  <Link href="/handler/sign-in">
                    <span className="hidden lg:inline">Sign In</span>
                  </Link>
                </Button>
              </>
            )}
        </div>
        
        {user && (
          <ChatModal
            isOpen={isChatModalOpen}
            onClose={() => setIsChatModalOpen(false)}
            currentUserId={user.id}
          />
        )}
    </header>
    
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <div className="text-muted-foreground line-clamp-2 p-2 text-sm leading-snug">
            {children}
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
