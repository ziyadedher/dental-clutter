import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { HiMiniCog6Tooth } from "react-icons/hi2";

import { Database } from "@/types/supabase";

const ProfileCard = async () => {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    },
  );

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return <ProfileCardSkeleton />;
  }

  const { data: user } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", session.user.id)
    .single();
  if (!user) {
    return <ProfileCardSkeleton />;
  }

  const { data: profilePhotoData } = await supabase.storage
    .from("profile-photos")
    .createSignedUrl(user.user_id, 60);
  if (!profilePhotoData) {
    return <ProfileCardSkeleton />;
  }

  const { data: membership } = await supabase
    .from("clinic_memberships")
    .select("*")
    .eq("user_id", user.user_id)
    .single();
  if (!membership) {
    return <ProfileCardSkeleton />;
  }

  const { data: clinic } = await supabase
    .from("clinics")
    .select("*")
    .eq("id", membership.clinic_id)
    .single();
  if (!clinic) {
    return <ProfileCardSkeleton />;
  }

  const { data: clinicData } = await supabase.storage
    .from("clinic-data")
    .list(clinic.id);
  if (!clinicData) {
    return <ProfileCardSkeleton />;
  }

  return (
    <Link
      href="/profile"
      className="group flex flex-row items-center justify-between gap-x-4 border-t border-gray-700 px-6 py-4 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
    >
      <div className="flex flex-row items-center gap-4">
        {/* TODO: add a fallback image and fix width and height */}
        <Image
          className="h-8 w-8 rounded-full bg-gray-50"
          src={profilePhotoData.signedUrl}
          width={3000}
          height={3000}
          alt="Profile photo."
        />
        <div className="flex flex-col">
          <span>{user.name}</span>
          <span className="-mt-1 text-gray-500">{clinic.name}</span>
        </div>
      </div>
      <HiMiniCog6Tooth
        className="h-4 w-4 text-gray-700 group-hover:text-gray-300"
        aria-hidden="true"
      />
    </Link>
  );
};

const ProfileCardSkeleton = () => {
  return (
    <div className="flex items-center gap-x-4 px-6 py-4 text-sm font-semibold leading-6">
      <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
      <div className="h-3 w-24 animate-pulse rounded-md bg-gray-200" />
    </div>
  );
};
ProfileCard.Skeleton = ProfileCardSkeleton;

export default ProfileCard;
