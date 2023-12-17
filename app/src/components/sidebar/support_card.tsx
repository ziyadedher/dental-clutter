import Link from "next/link";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";

const SupportCard = () => {
  return (
    <Link
      href="/support"
      className="group flex flex-row items-center justify-between gap-x-4 border-t border-gray-700 px-6 py-4 text-sm font-semibold leading-6 text-gray-300 hover:bg-gray-800 hover:text-white"
    >
      <div className="flex flex-row items-center gap-4">
        <HiOutlineQuestionMarkCircle className="h-6 w-6" />
        <span>Get or contact support</span>
      </div>
    </Link>
  );
};

export default SupportCard;
