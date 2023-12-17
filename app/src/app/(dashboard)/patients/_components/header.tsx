import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

const Header = () => {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-gray-200 bg-white px-8 shadow-sm">
      <div className="flex flex-1 items-center gap-x-6 self-stretch">
        <p className="text-xl">Patient Models and Records</p>
        <div className="block h-6 w-px bg-gray-900/10" aria-hidden="true" />
        <div className="relative flex flex-1">
          <HiOutlineMagnifyingGlass className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400" />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0"
            placeholder="Search for patients..."
            type="search"
            name="search"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
