import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col justify-center px-6 py-16">
      <p className="text-sm tracking-wide text-neutral-500 uppercase">404</p>
      <h1 className="mt-2 font-serif text-3xl tracking-tight text-neutral-900">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-neutral-600">
        That URL is not published here.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 w-fit items-center rounded-sm bg-neutral-900 px-4 text-sm text-white hover:bg-neutral-800"
      >
        Back home
      </Link>
    </div>
  );
}
