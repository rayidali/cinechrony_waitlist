import type { Metadata } from "next";
import Link from "next/link";
import { BandScene } from "@/components/cutouts";
import { Footer } from "@/components/footer";
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
      <section className="band band--paper section">
        <BandScene id="sky" />
        <div className="wrap">
          {/* Legal copy is never gated behind a scroll-triggered reveal --
              this content must render immediately for every visitor, crawler,
              and screen reader, no exceptions. */}
          <div style={{ maxWidth: 760, marginBottom: 56 }}>
            <div className="eyebrow" style={{ marginBottom: 20 }}>
              Legal
            </div>
            <h1 className="display-2">Privacy policy</h1>
            <p className="meta" style={{ marginTop: 16 }}>
              Last updated {site.privacyUpdated}
            </p>
            <p className="lead" style={{ marginTop: 20, maxWidth: "52ch" }}>
              The plain version: we collect the little we need to run
              Cinechrony, we don&apos;t sell it, and you can delete it any
              time.
            </p>
          </div>

          <div>
            <div className="doc">
              <nav className="toc" aria-label="On this page">
                <a href="#collect">01 · What we collect</a>
                <a href="#public">02 · What is public</a>
                <a href="#use">03 · How we use it</a>
                <a href="#ai">04 · The AI feature</a>
                <a href="#services">05 · Third-party services</a>
                <a href="#where">06 · Where it is stored</a>
                <a href="#retention">07 · Keeping and deleting</a>
                <a href="#rights">08 · Your rights</a>
                <a href="#children">09 · Children</a>
                <a href="#contact">10 · Contact</a>
              </nav>
              <div className="prose">
                <h2 id="collect">What we collect</h2>
                <p>
                  We collect what the product needs to work, and not much else.
                </p>
                <ul>
                  <li>
                    <strong>Account data.</strong> Your email address and a
                    password, stored only as a salted hash. If you sign in with
                    Apple or Google we receive the identifier they give us and
                    your email, which Apple lets you hide behind a relay
                    address.
                  </li>
                  <li>
                    <strong>Profile data.</strong> Your username, display name,
                    bio, profile photo, and favourite films.
                  </li>
                  <li>
                    <strong>Content you create.</strong> Watchlists, the films
                    you add, notes, reviews, ratings, comments, posts, photos
                    and videos you upload, movie nights you plan, who you
                    follow, and the clips you attach.
                  </li>
                  <li>
                    <strong>Viewing history.</strong> When you mark a film
                    watched or rate it, the film and the date, so your diary
                    and calendar work.
                  </li>
                  <li>
                    <strong>Notification data.</strong> If you enable push
                    notifications, a device push token, your notification
                    preferences, and your device&apos;s UTC offset, so we
                    don&apos;t send you anything at 3am.
                  </li>
                  <li>
                    <strong>Links you scan.</strong> The video link you share
                    and the films we identify from it.
                  </li>
                  <li>
                    <strong>Letterboxd import.</strong> If you choose to
                    import, the username you give us and the public data on
                    that profile.
                  </li>
                  <li>
                    <strong>Waitlist signups.</strong> Your email plus any name
                    or note you choose to add.
                  </li>
                  <li>
                    <strong>Analytics and diagnostics.</strong> Which screens
                    you open and key actions you take, tied to your account id,
                    plus crash reports. In the app, we also record how screens
                    are used (session replays: layout, taps and scrolling) to
                    find bugs and confusing screens; every word on screen and
                    everything you type is hidden from these recordings. No
                    note, review or caption text is sent.
                  </li>
                  <li>
                    <strong>Usage logs.</strong> IP address and request
                    metadata, used to serve requests, rate-limit, and prevent
                    abuse.
                  </li>
                </ul>
                <p>
                  We do <strong>not</strong> use third-party advertising or
                  tracking networks, and we do not sell your data.
                </p>

                <h2 id="public">What is public</h2>
                <p>
                  Your username, display name, photo, bio, public lists,
                  reviews, ratings, posts and follower counts are visible to
                  other users. Your email address, private lists, notification
                  preferences, blocks and mutes, and scan history are not.
                </p>
                <p>
                  Content you add to a shared list is visible to the other
                  members of that list. That&apos;s the point of a shared list.
                  A movie night marked private is visible only to the people
                  you invite, and anyone holding a night&apos;s share link can
                  see and respond to it, because the link is the invitation.
                </p>

                <h2 id="use">How we use it</h2>
                <p>
                  We use your information to run the product: to sign you in,
                  show you your lists, sync them across your devices, deliver
                  the notifications you asked for, and share what you choose
                  with the people you invite. We do not use it to build
                  advertising profiles.
                </p>
                <p>
                  Where UK or EU law applies, our legal bases are
                  <strong> contract</strong> (providing the app you signed up
                  for), <strong>legitimate interests</strong> (security, abuse
                  prevention, and understanding which features are useful), and
                  <strong> consent</strong> where you give it — push
                  notifications, camera and photo access, and the Letterboxd
                  import. You can withdraw consent at any time in Settings or
                  your device settings.
                </p>
                <p>
                  We email you about your account: a code to confirm your
                  email address when you sign up, password resets, and similar
                  messages you need to use the app. A couple of days after you
                  sign up, the founder also sends you one short note asking how
                  cinechrony is working for you; replies go straight to the founder.
                  That note carries an unsubscribe link, and you can also reply
                  &ldquo;unsubscribe&rdquo;. Account emails stop only when you
                  delete your account.
                </p>

                <h2 id="ai">The AI feature</h2>
                <p>
                  When you share a clip for scanning, the video is fetched and
                  analysed to identify the films in it. The analysis runs on
                  Google&apos;s Gemini API. We send the clip and its caption,
                  never your name, email or account details. Under
                  Google&apos;s terms for this service, Google may use what we
                  send to improve its products, and its reviewers may see it.
                  We don&apos;t republish or store the video itself. The films
                  it finds, and the clip you attached, stay on your list under
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
                    <strong>Supabase.</strong> Our database and sign-in
                    provider, hosted on AWS in the United States.
                  </li>
                  <li>
                    <strong>Vercel.</strong> Hosting.
                  </li>
                  <li>
                    <strong>Google Firebase.</strong> Delivers notifications to
                    older versions of the app, and retained while we finish
                    migrating away from it.
                  </li>
                  <li>
                    <strong>Apple.</strong> Delivery of push notifications and
                    Live Activities to iOS devices.
                  </li>
                  <li>
                    <strong>Cloudflare R2.</strong> Storage for profile photos,
                    list covers and post media, and for database backups.
                  </li>
                  <li>
                    <strong>TMDB.</strong> Film and TV metadata, posters, and
                    search.
                  </li>
                  <li>
                    <strong>OMDb.</strong> Supplementary IMDb ratings.
                  </li>
                  <li>
                    <strong>Apify.</strong> Fetches the video behind a link you
                    scan, and the public Letterboxd profile you ask us to
                    import.
                  </li>
                  <li>
                    <strong>Google (Gemini).</strong> Analyses a scanned video
                    to identify the films in it. Google may use what we send to
                    improve its products (see &ldquo;The AI feature&rdquo;).
                  </li>
                  <li>
                    <strong>Resend.</strong> Our email: sign-up codes,
                    password resets, and the founder&apos;s note after you sign
                    up.
                  </li>
                  <li>
                    <strong>PostHog.</strong> Product analytics and session replays, with all text hidden.
                  </li>
                  <li>
                    <strong>Sentry.</strong> Error and crash monitoring.
                  </li>
                  <li>
                    <strong>Loops.</strong> Waitlist and launch email.
                  </li>
                </ul>
                <p>
                  This product uses the TMDB API but is not endorsed or
                  certified by TMDB.
                </p>

                <h2 id="where">Where it is stored</h2>
                <p>
                  Your data is stored and processed in the{" "}
                  <strong>United States</strong>. If you are in the UK, EEA or
                  Switzerland, that means it is transferred outside your
                  country, and those transfers rely on the European
                  Commission&apos;s Standard Contractual Clauses or an
                  equivalent safeguard in our providers&apos; terms.
                </p>

                <h2 id="retention">Keeping and deleting</h2>
                <p>
                  We keep your information for as long as your account is
                  active. You can permanently delete your account from Settings
                  in the app. That removes your profile, lists, films, reviews,
                  ratings, watches, posts, comments and follows. Deletion is
                  immediate and cannot be undone.
                </p>
                <p>
                  Two exceptions worth stating plainly. Database backups are
                  kept for <strong>30 days</strong> and then permanently
                  deleted, so deleted content can persist in a backup for up to
                  that long before it is gone everywhere. Scan jobs and cached
                  scan results expire on their own about 30 days after the
                  scan.
                </p>
                <p>
                  If you unsubscribe from the waitlist, we remove your email
                  from it. In rare cases we may need to keep a record for legal
                  reasons, and then only for as long as the law requires.
                </p>

                <h2 id="rights">Your rights</h2>
                <p>
                  You can access, correct, export, or delete your information.
                  Deletion and correction are built into Settings; for anything
                  else, email us from the address on your account and we will
                  respond within 30 days.
                </p>
                <p>
                  Depending on where you live you may have additional rights.
                  California residents have the right to know, delete and
                  correct their personal information, and not to be
                  discriminated against for exercising it — we do not sell or
                  share personal information for cross-context behavioural
                  advertising. If you are in the UK or EEA and are unhappy with
                  our response, you may complain to your local data protection
                  authority.
                </p>

                <h2 id="children">Children</h2>
                <p>
                  Cinechrony is not directed to children under 13, and we do
                  not knowingly collect personal data from them. If you believe
                  a child under 13 has created an account, write to us and we
                  will delete it.
                </p>

                <h2 id="contact">Contact</h2>
                <p>
                  Questions about privacy, or a deletion request? Write to{" "}
                  <a href={`mailto:${site.supportEmail}`}>
                    {site.supportEmail}
                  </a>{" "}
                  and a real person will answer. We are the data controller for
                  the personal data described here.
                </p>
              </div>
            </div>
          </div>
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
