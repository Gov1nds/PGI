import React from "react";
import "./Home.css";

import Container from "../components/Container.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import ImageCard from "../components/ImageCard.jsx";
import { PrimaryButton, SecondaryButton } from "../components/Buttons.jsx";

import { services, outdoorWorks, insights } from "../content/siteData.js";
import CountUp from "../components/CountUp.jsx";

const Home = () => {
  return (
    <div>
      {/* HERO */}
      <section className="bg-hero border-b border-white/10">
        <Container className="py-14 sm:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">

            {/* LEFT */}
            <div className="relative">
              <div className="rounded-3xl bg-black/40 backdrop-blur-sm p-6 ring-1 ring-white/10 sm:p-8">

                <p className="text-sm text-white/80 hero-anim-1">
                  Engineering-Led Manufacturing Network
                </p>

                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl hero-anim-2">
                  Reliable Manufacturing
                  <span className="block text-emerald-300">
                    For Complex Hardware
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/85 hero-anim-3">
                  PGI coordinates engineering review, material procurement,
                  production scheduling, and quality verification across a
                  structured manufacturing network. Companies rely on PGI to
                  simplify complex manufacturing while maintaining consistent
                  product quality and delivery reliability.
                </p>

                <div className="mt-7 flex flex-wrap gap-3 hero-anim-4">
                  <PrimaryButton to="/contact">
                    Request engineering review
                  </PrimaryButton>

                  <SecondaryButton
                    to="/capabilities"
                    className="bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15"
                  >
                    Explore capabilities
                  </SecondaryButton>
                </div>

                {/* STATS */}
                <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 hero-anim-4">

                  <div className="rounded-2xl p-4 bg-black/55 backdrop-blur-md ring-1 ring-white/15">
                    <div className="text-lg font-semibold text-white">
                      <CountUp value={1200} suffix="+" />
                    </div>
                    <div className="text-xs text-white/80">
                      Components manufactured
                    </div>
                  </div>

                  <div className="rounded-2xl p-4 bg-black/55 backdrop-blur-md ring-1 ring-white/15">
                    <div className="text-lg font-semibold text-white">
                      <CountUp value={300} suffix="+" />
                    </div>
                    <div className="text-xs text-white/80">
                      Manufacturing partners
                    </div>
                  </div>

                  <div className="rounded-2xl p-4 bg-black/55 backdrop-blur-md ring-1 ring-white/15">
                    <div className="text-lg font-semibold text-white">
                      <CountUp value={92} suffix="%" />
                    </div>
                    <div className="text-xs text-white/80">
                      Production reliability
                    </div>
                  </div>

                  <div className="rounded-2xl p-4 bg-black/55 backdrop-blur-md ring-1 ring-white/15">
                    <div className="text-lg font-semibold text-white">
                      <CountUp value={15} suffix="+" />
                    </div>
                    <div className="text-xs text-white/80">
                      Industries supported
                    </div>
                  </div>

                </div>

              </div>
            </div>


            {/* RIGHT PANEL */}
            <div className="relative overflow-hidden rounded-3xl bg-black/55 backdrop-blur-md ring-1 ring-white/15">

              <div className="relative p-7 sm:p-10">

                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/15">
                  Engineering → Manufacturing → Delivery
                </div>

                <h3 className="mt-4 text-2xl font-semibold sm:text-3xl text-white">
                  Engineering Control
                  <span className="block text-[rgba(var(--brand-500))]">
                    Reliable Production
                  </span>
                </h3>

                <p className="mt-3 text-sm text-white/80">
                  PGI integrates engineering oversight with a distributed
                  manufacturing network to produce precision mechanical and
                  electronic components for global clients.
                </p>


                <div className="mt-7 grid gap-4 sm:grid-cols-3">

                  <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
                    <div className="text-xs text-white/70">
                      Engineering reviews
                    </div>
                    <div className="text-xl font-semibold text-white">
                      <CountUp value={850} suffix="+" />
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
                    <div className="text-xs text-white/70">
                      Projects coordinated
                    </div>
                    <div className="text-xl font-semibold text-white">
                      <CountUp value={420} suffix="+" />
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
                    <div className="text-xs text-white/70">
                      Cost optimization
                    </div>
                    <div className="text-xl font-semibold text-white">
                      <CountUp value={18} suffix="%" />
                    </div>
                  </div>

                </div>


                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Engineering review & DFM",
                    "Material procurement control",
                    "CNC machining network",
                    "PCBA manufacturing",
                    "Electromechanical assembly",
                    "Global logistics coordination"
                  ].map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs text-white ring-1 ring-white/15"
                    >
                      {t}
                    </span>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </Container>
      </section>



      {/* TECHNICAL EXPERTISE */}
      <section className="border-b border-white/10 bg-black/20">
        <Container className="py-14">

          <SectionHeading
            eyebrow="Technical Expertise"
            title="Engineering coordination across mechanical and electronics manufacturing"
            desc="PGI integrates engineering review, supplier network management, procurement, and quality verification to deliver precision industrial components."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-sm font-semibold text-white">
                Engineering & Design Review
              </h3>
              <p className="mt-2 text-sm text-white/70">
                Our engineers evaluate CAD files, drawings, and BOMs to
                confirm manufacturability and optimize production methods.
              </p>
            </div>

            <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-sm font-semibold text-white">
                Mechanical Manufacturing Network
              </h3>
              <p className="mt-2 text-sm text-white/70">
                Precision CNC machining, sheet metal fabrication, casting,
                forging, and industrial component manufacturing coordinated
                across specialized facilities.
              </p>
            </div>

            <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
              <h3 className="text-sm font-semibold text-white">
                Electronics & Integration
              </h3>
              <p className="mt-2 text-sm text-white/70">
                PCBA manufacturing, wire harnesses, and electromechanical
                assemblies integrated into complete hardware systems.
              </p>
            </div>

          </div>

        </Container>
      </section>



      {/* SERVICES */}
      <section>
        <Container className="py-14">

          <SectionHeading
            eyebrow="Services"
            title="Manufacturing coordination without operational complexity"
            desc="PGI manages sourcing, production scheduling, quality verification, and delivery coordination."
          />

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {services.slice(0, 3).map((s) => (
              <ImageCard
                key={s.title}
                title={s.title}
                desc={s.desc}
                image={s.image}
                to="/services"
              />
            ))}
          </div>

          <div className="mt-6">
            <SecondaryButton to="/services">
              View all services
            </SecondaryButton>
          </div>

        </Container>
      </section>



      {/* CAPABILITIES */}
      <section className="border-y border-white/10 bg-black/20">
        <Container className="py-14">

          <SectionHeading
            eyebrow="Capabilities"
            title="Precision manufacturing across a distributed production network"
            desc="Machining, electronics manufacturing, fabrication, and electromechanical assembly coordinated through trusted partner facilities."
          />

          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {outdoorWorks.map((o) => (
              <ImageCard
                key={o.title}
                title={o.title}
                desc={o.desc}
                image={o.image}
                to="/capabilities"
              />
            ))}
          </div>

        </Container>
      </section>



      {/* INSIGHTS */}
      <section>
        <Container className="py-14">

          <SectionHeading
            eyebrow="Insights"
            title="Insights on modern manufacturing coordination"
            desc="Articles on engineering optimization, supplier networks, and scaling production."
          />

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {insights.map((i) => (
              <ImageCard
                key={i.slug}
                title={i.title}
                desc={i.excerpt}
                image={i.image}
                to={`/insights/${i.slug}`}
                tag={i.category}
              />
            ))}
          </div>

          <div className="mt-6">
            <SecondaryButton to="/insights">
              Browse all insights
            </SecondaryButton>
          </div>

        </Container>
      </section>



      {/* FINAL CTA */}
      <section className="border-t border-white/10 bg-black/30">
        <Container className="py-14">

          <div className="grid gap-8 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 md:grid-cols-2 md:items-center">

            <div>
              <h3 className="text-2xl font-semibold">
                Need a reliable manufacturing partner?
              </h3>

              <p className="mt-3 text-sm text-white/70">
                Share your drawings, specifications, or BOM with our
                engineering team. PGI will review manufacturability and
                coordinate the entire manufacturing process from sourcing
                to global delivery.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 md:justify-end">
              <PrimaryButton to="/contact">
                Request engineering review
              </PrimaryButton>

              <SecondaryButton to="/about">
                Learn about PGI
              </SecondaryButton>
            </div>

          </div>

        </Container>
      </section>

    </div>
  );
};

export default Home;