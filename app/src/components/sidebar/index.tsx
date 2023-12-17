import Image from "next/image";
import { Suspense } from "react";

import Navigation from "@/components/sidebar/navigation";
import ProfileCard from "@/components/sidebar/profile_card";
import SupportCard from "@/components/sidebar/support_card";
import logo from "@public/dental_clutter.png";

const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 z-50 flex w-72 grow flex-col space-y-4 overflow-y-auto bg-gray-900 px-6">
      <div className="mt-4 flex h-16 shrink-0 flex-row items-center">
        <Image className="h-10 w-auto" src={logo} alt="DentalClutter Logo" />
        <span className="ml-2 text-lg text-white">DentalClutter</span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <Navigation />
          </li>
          <li className="-mx-6 mt-auto">
            <SupportCard />
          </li>
          <li className="-mx-6 -mt-7">
            <Suspense fallback={<ProfileCard.Skeleton />}>
              <ProfileCard />
            </Suspense>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
