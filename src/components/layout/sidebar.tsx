import React from "react";
import { SheetContent, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  X,
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart2,
  Store,
  ChartNoAxesGantt,
  CalendarClock,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface MenuItem {
  title: string;
  href?: string;
  icon: React.ReactNode;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "Vendors",
    href: "/vendors",
    icon: <Store className="h-4 w-4" />,
  },
  {
    title: "Users",
    href: "/users",
    icon: <Users className="h-4 w-4" />,
  },
  {
    title: "Categories",
    icon: <ChartNoAxesGantt className="h-4 w-4" />,
  },
  {
    title: "Events",
    icon: <CalendarClock className="h-4 w-4" />,
  },
  {
    title: "Products",
    icon: <Package className="h-4 w-4" />,
    children: [
      {
        title: "All Products",
        href: "/products",
        icon: <Package className="h-4 w-4" />,
      },
      {
        title: "Add Product",
        href: "/products/add",
        icon: <Package className="h-4 w-4" />,
      },
    ],
  },

  {
    title: "Analytics",
    href: "/analytics",
    icon: <BarChart2 className="h-4 w-4" />,
  },
];

function Logo() {
  return (
    <div className="flex items-center gap-2 font-semibold">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
      </svg>
      <span>Acme Inc</span>
    </div>
  );
}

function MenuItems({ items }: { items: MenuItem[] }) {
  const location = useLocation();
  const { hash, pathname, search } = location;
  console.log(pathname);

  return (
    <Accordion type="multiple" className="w-full">
      {items.map((item, index) => (
        <AccordionItem
          value={`item-${index}`}
          key={index}
          className={"border-b-0 m-2 "}
        >
          {item.children ? (
            <>
              <AccordionTrigger className="hover:bg-muted/50 transition-colors py-2 px-4">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col space-y-2 pl-6">
                  {item.children.map((child, childIndex) => (
                    <a
                      key={childIndex}
                      href={child.href}
                      className="flex items-center gap-3 py-2 px-4 text-sm text-muted-foreground hover:bg-muted/50 hover:text-primary transition-colors rounded-md"
                    >
                      {child.icon}
                      {child.title}
                    </a>
                  ))}
                </div>
              </AccordionContent>
            </>
          ) : (
            <Link
              to={item.href as string}
              className={`flex items-center gap-3 py-2 px-4 hover:bg-slate-200 hover:text-blue transition-colors rounded-md ${
                pathname === item.href ? "bg-slate-200" : ""
              }`}
            >
              {item.icon}
              {item.title}
            </Link>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default function Sidebar() {
  return (
    <>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
        <nav className="flex flex-col h-full">
          <div className="flex items-center justify-between py-4 px-6 border-b h-16">
            <Logo />
            <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
          <ScrollArea className="flex-grow">
            <div className="py-4">
              <MenuItems items={menuItems} />
            </div>
          </ScrollArea>
          <div className="py-4 px-6 border-t text-center text-sm text-muted-foreground">
            © 2023 Acme Inc. All rights reserved.
          </div>
        </nav>
      </SheetContent>

      <aside className="hidden lg:flex flex-col h-screen w-[250px] border-r">
        <div className="flex items-center justify-between py-4 px-6 border-b h-16">
          <Logo />
        </div>
        <ScrollArea className="flex-grow">
          <div className="py-4">
            <MenuItems items={menuItems} />
          </div>
        </ScrollArea>
        <div className="py-4 px-6 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Zid Na9es.
        </div>
      </aside>
    </>
  );
}
