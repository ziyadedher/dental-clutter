"use client";

import cx from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineUsers, HiOutlineFolder } from "react-icons/hi2";

const navigation = [
  { name: "Patients", href: "/patients", icon: HiOutlineUsers },
  { name: "Files", href: "/files", icon: HiOutlineFolder },
];

const Navigation = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-semibold leading-6 text-gray-400">
        Navigation
      </div>
      <ul role="list" className="-mx-2 flex flex-col gap-1">
        {navigation.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className={cx(
                pathname.startsWith(item.href)
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
                "group flex flex-row gap-3 rounded-md p-2 text-sm font-semibold leading-6",
              )}
            >
              <item.icon className="h-6 w-6 shrink-0" />
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navigation;
