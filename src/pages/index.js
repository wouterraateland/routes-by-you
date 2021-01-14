import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

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
      <Image
        className="absolute inset-0"
        layout="fill"
        src="/images/hero.jpg"
        objectFit="cover"
        quality={100}
      />
      <div className="relative flex items-center justify-center h-screen bg-white bg-opacity-75">
        <nav className="absolute right-0 top-0 pr-safe pt-safe m-4">
          <Link href="/dashboard">
            <a className="text-blue-600 hover:underline font-bold">To app</a>
          </Link>
        </nav>
        <header className="p-8 space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-black">Routes by You</h1>
            <p className="text-2xl text-blue-600">
              Set your own routes. Share them with the world
            </p>
          </div>
          <Link href="/auth/register">
            <a
              className="block sm:inline-block py-2 px-4 rounded-md bg-blue-600
            hover:bg-blue-700 border border-blue-900 text-white font-bold"
            >
              Get started
            </a>
          </Link>
        </header>
      </div>
    </>
  );
}
