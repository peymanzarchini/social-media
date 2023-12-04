"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants";

const Bottombar = () => {
  const pathname = usePathname();

  const handleChangeActiveElement = (route: string) => {
    if (route === pathname) {
      return true;
    }
  };

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => (
          <Link
            href={link.route}
            key={link.label}
            className={`bottombar_link ${handleChangeActiveElement(link.route) && "bg-blue"}`}
          >
            <Image
              src={link.imgURL}
              alt={link.label}
              width={24}
              height={24}
              className="object-contain"
            />
            <p className="text-subtle-medium text-light-1 max-sm:hidden">
              {link.label.split(/\s+/)[0]}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Bottombar;
