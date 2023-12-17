"use client";

import { createBrowserClient } from "@supabase/ssr";
import cx from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useCallback, useMemo, useState } from "react";

import logo from "@public/dental_clutter.png";

const LoginCard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginState, setLoginState] = useState<
    "waiting" | "loading" | "success" | "error"
  >("waiting");
  const isSubmittable = useMemo(
    () => !(loginState === "loading" || loginState === "success"),
    [loginState],
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      setLoginState("loading");
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginState("error");
      } else {
        setLoginState("success");
        // #RedirectionAfterLogin
        router.push(decodeURIComponent(searchParams.get("redirect") ?? "/"));
      }
    },
    [router, searchParams, supabase.auth, email, password],
  );

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center gap-10 px-6 py-12 lg:px-8">
      <div className="flex flex-col gap-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          className="mx-auto h-16 w-auto"
          src={logo}
          alt="DentalClutter Logo"
        />
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="flex flex-col gap-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <Link
                  href="/auth/forgot_password"
                  className="font-semibold text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!isSubmittable}
              className={cx(
                "flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                isSubmittable
                  ? "bg-blue-600 hover:bg-blue-500 focus-visible:outline-blue-600"
                  : "cursor-wait bg-gray-400",
              )}
            >
              {
                {
                  waiting: "Sign in",
                  loading: "Signing in...",
                  success: "Signed in!",
                  error: "Sign in",
                }[loginState]
              }
            </button>
          </div>
        </form>

        <p className="-mt-4 text-center text-sm">
          {loginState === "waiting" ? null : loginState ===
            "loading" ? null : loginState === "success" ? null : (
            <span className="text-red-500">
              Unable to log in, please try again or contact support.
            </span>
          )}
        </p>

        <p className="text-center text-sm text-gray-500">
          Need an account?{" "}
          <a
            href="mailto:support@dentalclutter.com"
            className="font-semibold leading-6 text-blue-600 hover:text-blue-500"
          >
            Contact us at support@dentalclutter.com.
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginCard;
