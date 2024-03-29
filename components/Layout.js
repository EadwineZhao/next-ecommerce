import { useSession, signIn, signOut } from "next-auth/react";
import Nav from "./Nav";
import { useState } from "react";
import Logo from "./Logo";

export default function Layout({ children }) {
  const { data: session } = useSession();
  const [isShowNav, setIsShowNav] = useState(false);
  if (!session) {
    return (
      <div className="bg-bgGray w-screen h-screen flex justify-center items-center">
        <div className="w-full text-center">
          <button
            onClick={() => signIn("google")}
            className="bg-white px-4 py-2 rounded-lg"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-bgGray min-h-screen">
      <div className="block md:hidden flex justify-between p-2">
        <button type="button" onClick={() => setIsShowNav(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <Logo />
      </div>
      <div className="flex min-h-screen">
        <Nav isShowNav={isShowNav} />
        <div className="flex-grow m-4">
          {children}
        </div>
      </div>
    </div>
  );
}
