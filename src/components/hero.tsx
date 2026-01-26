import Image from "next/image";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui";

export function Hero() {
  return (
    <section className="bg-hero">
      <div className="container-page pt-12 pb-10 sm:pt-16 sm:pb-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="font-serif text-4xl sm:text-6xl leading-[1.02]">
              Build Your Dream
              <br />
              Outdoor Space
              <br />
              <span className="text-white/90">Systematically</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm sm:text-base text-white/75">
              <span className="italic">Sustainable construction. Disciplined execution.</span>
              <br />
              {site.subtagline}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={site.ctaPrimary.href} variant="primary">
                {site.ctaPrimary.label}
              </ButtonLink>
              <ButtonLink href={site.ctaSecondary.href} variant="secondary">
                {site.ctaSecondary.label}
              </ButtonLink>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-soft">
              <div className="relative aspect-[16/10]">
                <Image
                  src="/images/hero-1.webp"
                  alt="Change Image"
                  fill
                  className="object-cover opacity-90"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/10 to-transparent" />
                <div className="absolute left-5 top-5 text-xs font-semibold tracking-[0.22em] text-white/70">
                  PROJECT HIGHLIGHT
                </div>
                <div className="absolute left-5 bottom-5 right-5">
                  <div className="text-2xl sm:text-3xl font-semibold leading-tight">
                    From site visit to handover — outdoor projects done right
                  </div>
                  <div className="mt-2 text-sm text-white/70">
                    Replace images in <code className="text-white">public/images/</code>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="relative aspect-[16/12]">
                  <Image src="/images/hero-2.webp" alt="Change Image" fill className="object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute left-4 bottom-4 right-4 text-sm font-semibold">
                    Landscape & Garden Design
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="relative aspect-[16/12]">
                  <Image src="/images/hero-3.webp" alt="Change Image" fill className="object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute left-4 bottom-4 right-4 text-sm font-semibold">
                    Outdoor Construction & Stone Paving
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
