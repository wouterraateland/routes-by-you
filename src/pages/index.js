import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Caret from "components/icons/Caret";
import RoutesByYou from "components/icons/RoutesByYou";

export default function Home() {
  return (
    <>
      <Head>
        <title>Routes by You</title>
        <meta name="description" content="Set and share your own boulders" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Routes by You" />
        <meta
          property="og:description"
          content="Set and share your own boulders"
        />
        <meta property="og:url" content="https://routesbyyou.com" />
        <meta
          property="og:image"
          content="https://routesbyyou.com/og-image.png"
        />
      </Head>
      <nav className="flex justify-end p-2">
        <Link href="/feed">
          <a className="text-blue-600 hover:underline font-bold">To app</a>
        </Link>
      </nav>
      <header className="p-4 sm:p-8 space-y-8">
        <div className="space-y-8 sm:flex sm:items-center sm:justify-center sm:space-y-0 sm:space-x-8">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="flex items-center space-x-4 text-3xl md:text-4xl font-black">
                <RoutesByYou className="h-8 text-blue-600" />
                <span className="whitespace-nowrap">Routes by You</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-500 max-w-lg">
                The social network for climbers.
                <br />
                Discover boulders everywhere.
                <br />
                Set your own routes and share them with the world.
              </p>
            </div>
            <Link href="/auth/register">
              <a
                className="w-full max-w-xs inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-md bg-blue-600
            hover:bg-blue-700 border text-white font-bold text-xl"
              >
                <span>Get started</span>
                <Caret
                  className="h-4 animate-pulse"
                  direction="right"
                  strokeWidth={4}
                />
              </a>
            </Link>
          </div>
          <div className="mx-auto w-full max-w-xs relative p-2 pt-6 rounded-2xl bg-gray-900 shadow-lg">
            <div className="absolute top-2 left-0 right-0 mx-auto w-2 h-2 rounded-full bg-white" />
            <Image
              className="rounded-xl"
              src="/images/screenshot.png"
              layout="responsive"
              width={1125}
              height={2469}
            />
          </div>
        </div>
        <div className="text-center text-gray-500">
          <a href="mailto:wouterraateland@gmail.com">Contact</a>
        </div>
      </header>
    </>
  );
}
