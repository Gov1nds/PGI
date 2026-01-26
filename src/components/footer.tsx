import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-ink-950">
      <div className="container-page py-10">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="text-lg font-semibold">{site.name}</div>
            <p className="mt-2 text-sm text-white/70 max-w-sm">{site.subtagline}</p>
            <div className="mt-4 text-sm text-white/70">
              <div>Email: <span className="text-white">{site.contactEmail}</span></div>
              <div className="mt-1">Locations: <span className="text-white">{site.locations.join(" • ")}</span></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="grid gap-2">
              <Link href="/industries">Industries</Link>
              <Link href="/capabilities">Services</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="grid gap-2">
              <Link href="/news">News</Link>
              <Link href="/insights">Insights</Link>
              <Link href="/articles">Articles</Link>
              <Link href="/about">About</Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-semibold">Start a conversation</div>
            <p className="mt-2 text-sm text-white/70">
              Share your site and requirement. We’ll reply with a simple plan and BOQ direction.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex rounded-xl bg-accent-600 px-4 py-2 text-sm font-medium hover:bg-accent-500"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="hr-soft my-8" />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs text-white/55">
          <div>© {new Date().getFullYear()} {site.name}. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
