import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What Cinechrony collects, why, and how to delete it. The plain-English privacy policy.",
};

export default function PrivacyPage() {
  return (
    <>
    <main id="main">
      <section className="section">
        <div className="wrap">
          <Reveal>
            <div style={{ maxWidth: 760, marginBottom: 56 }}>
              <div className="eyebrow" style={{ marginBottom: 20 }}>
                Legal
              </div>
              <h1 className="display-2">Privacy policy</h1>
              <p className="meta" style={{ marginTop: 16 }}>
                Last updated {site.legalUpdated}
              </p>
              <p className="lead" style={{ marginTop: 20, maxWidth: "52ch" }}>
                The plain version: we collect the little we need to run
                Cinechrony, we don&apos;t sell it, and you can delete it any
                time.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="doc">
              <nav className="toc" aria-label="On this page">
                <a href="#collect">01 · What we collect</a>
                <a href="#public">02 · What is public</a>
                <a href="#use">03 · How we use it</a>
                <a href="#ai">04 · The AI feature</a>
                <a href="#services">05 · Third-party services</a>
                <a href="#retention">06 · Keeping and deleting</a>
                <a href="#rights">07 · Your rights</a>
                <a href="#contact">08 · Contact</a>
              </nav>
              <div className="prose">
                <h2 id="collect">What we collect</h2>
                <p>
                  We collect what the product needs to work, and not much else.
                </p>
                <ul>
                  <li>
                    <strong>Account data.</strong> Your email address and a
                    password, handled by Firebase Authentication.
                  </li>
                  <li>
                    <strong>Profile data.</strong> Your username, display name,
                    bio, profile photo, and favorite movies.
                  </li>
                  <li>
                    <strong>Content you create.</strong> Watchlists, the films
                    you add, notes, reviews, ratings, comments, who you follow,
                    and the clips you attach.
                  </li>
                  <li>
                    <strong>Notification data.</strong> If you enable push
                    notifications, a device push token so we can deliver them.
                  </li>
                  <li>
                    <strong>Waitlist signups.</strong> Your email plus any name
                    or note you choose to add, so we can tell you when the app
                    is ready.
                  </li>
                  <li>
                    <strong>Usage logs.</strong> Basic logs to keep the service
                    running and secure.
                  </li>
                </ul>
                <p>
                  We do <strong>not</strong> use third-party advertising or
                  analytics trackers, and we do not sell your data.
                </p>

                <h2 id="public">What is public</h2>
                <p>
                  Your username, display name, photo, bio, public lists,
                  reviews, and follower counts are visible to other users. Your
                  email address is stored privately and is never shown.
                </p>
                <p>
                  Content you add to a shared list is visible to the other
                  members of that list. That&apos;s the point of a shared list.
                </p>

                <h2 id="use">How we use it</h2>
                <p>
                  We use your information to run the product: to show you your
                  lists, sync them across your devices, and share them with the
                  people you invite. We do not use it to build advertising
                  profiles.
                </p>
                <ul>
                  <li>To operate and improve Cinechrony.</li>
                  <li>
                    To send account and service emails you&apos;d expect.
                  </li>
                  <li>To keep the service safe and prevent abuse.</li>
                </ul>

                <h2 id="ai">The AI feature</h2>
                <p>
                  When you share a clip for scanning, the video or its link is
                  processed to identify the films in it. We send only
                  what&apos;s needed to complete that match, and we don&apos;t
                  use your clips to train third-party models. The films it
                  finds, and the clip you attached, stay on your list under
                  your account.
                </p>

                <h2 id="services">Third-party services</h2>
                <p>
                  A small set of service providers help us run the product.
                  They process data on our behalf under agreements that limit
                  what they can do with it. We do not sell your personal
                  information.
                </p>
                <ul>
                  <li>
                    <strong>Google Firebase.</strong> Authentication and
                    database. Data is stored on Google Cloud infrastructure.
                  </li>
                  <li>
                    <strong>Cloudflare R2.</strong> Storage for profile and
                    list cover images.
                  </li>
                  <li>
                    <strong>TMDB.</strong> Movie and TV metadata, posters, and
                    search.
                  </li>
                  <li>
                    <strong>OMDb.</strong> Supplementary IMDb ratings.
                  </li>
                  <li>
                    <strong>Vercel.</strong> Hosting.
                  </li>
                  <li>
                    <strong>Loops.</strong> Waitlist and launch email.
                  </li>
                </ul>
                <p>
                  This product uses the TMDB API but is not endorsed or
                  certified by TMDB.
                </p>

                <h2 id="retention">Keeping and deleting</h2>
                <p>
                  We keep your information for as long as your account is
                  active. You can permanently delete your account from Settings
                  in the app. That removes your profile, lists, reviews,
                  ratings, and follows. Deletion is immediate and cannot be
                  undone.
                </p>
                <p>
                  If you unsubscribe from the waitlist, we remove your email
                  from it. In rare cases we may need to keep a record for legal
                  reasons, and then only for as long as the law requires.
                </p>

                <h2 id="rights">Your rights</h2>
                <p>
                  You can access, correct, export, or delete your information.
                  Depending on where you live, you may have additional rights
                  under laws like GDPR or CCPA. To exercise any of them, email
                  us from the address on your account.
                </p>

                <h2 id="contact">Contact</h2>
                <p>
                  Questions about privacy, or a deletion request? Write to{" "}
                  <a href={`mailto:${site.supportEmail}`}>
                    {site.supportEmail}
                  </a>{" "}
                  and a real person will answer.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
    <Footer
        variant="minimal"
        note={
          <Link href="/terms" style={{ textDecoration: "underline" }}>
            Terms of service
          </Link>
        }
      />
    </>
  );
}
