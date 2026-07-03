import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of service",
  description:
    "The rules for using Cinechrony: your account, your content, acceptable use, and what we promise while the product is still being built.",
};

export default function TermsPage() {
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
              <h1 className="display">Terms of service</h1>
              <p className="meta" style={{ marginTop: 16 }}>
                Last updated {site.legalUpdated}
              </p>
              <p className="lead" style={{ marginTop: 20, maxWidth: "52ch" }}>
                The short version: be decent, own what you post, and understand the service comes
                as is while we&apos;re still building it.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="doc">
              <nav className="toc" aria-label="On this page">
                <a href="#agreement">01 · The agreement</a>
                <a href="#eligibility">02 · Who can use it</a>
                <a href="#account">03 · Your account</a>
                <a href="#content">04 · Your content</a>
                <a href="#conduct">05 · Acceptable use</a>
                <a href="#reporting">06 · Reporting and blocking</a>
                <a href="#service">07 · The service and movie data</a>
                <a href="#liability">08 · Liability</a>
                <a href="#termination">09 · Termination</a>
                <a href="#law">10 · Governing law</a>
                <a href="#contact">11 · Contact</a>
              </nav>
              <div className="prose">
                <h2 id="agreement">The agreement</h2>
                <p>
                  By creating an account or using Cinechrony, you agree to these terms. If you
                  don&apos;t agree, don&apos;t use the service. We may update these terms as the
                  product grows, and we&apos;ll post the date of the latest version at the top of
                  this page. Using Cinechrony after a change means you accept the new terms.
                </p>

                <h2 id="eligibility">Who can use it</h2>
                <p>
                  You must be at least 13 years old to create an account. By signing up you confirm
                  that you are 13 or older and that the information you give us is accurate.
                </p>

                <h2 id="account">Your account</h2>
                <p>
                  You&apos;re responsible for keeping your login credentials safe and for everything
                  that happens under your account. If you suspect unauthorized access, tell us at{" "}
                  <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>. You can
                  permanently delete your account at any time from Settings.
                </p>

                <h2 id="content">Your content</h2>
                <p>
                  Cinechrony is social: lists, reviews, comments, posts, and clips can be visible to
                  other people. You keep ownership of everything you post. You grant us a worldwide,
                  royalty-free license to host, display, reproduce, and distribute that content so
                  we can operate the product, including showing it to the people you share a list
                  with. Don&apos;t post anything you don&apos;t have the rights to share.
                </p>

                <h2 id="conduct">Acceptable use</h2>
                <p>Keep it friendly. These are the house rules:</p>
                <ul>
                  <li>Nothing illegal, harassing, hateful, or infringing on someone else&apos;s rights.</li>
                  <li>No spam or malware.</li>
                  <li>No impersonating another person or misrepresenting who you are.</li>
                  <li>No sharing others&apos; private information without their consent.</li>
                  <li>Nothing that violates Apple&apos;s App Store guidelines.</li>
                  <li>No scraping or automated abuse of the service.</li>
                </ul>

                <h2 id="reporting">Reporting and blocking</h2>
                <p>
                  Every post, comment, list, and review can be reported. We review reports and act
                  on content that violates these terms. You can also block any user, so they
                  can&apos;t see your content or interact with you, and you won&apos;t see theirs.
                  For urgent safety issues, write to us directly at{" "}
                  <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
                </p>

                <h2 id="service">The service and movie data</h2>
                <p>
                  Cinechrony is offered as is while we&apos;re actively building it. Features may
                  change, and the AI scanning is best-effort matching that won&apos;t always be
                  perfect. Movie metadata and posters come from TMDB. Cinechrony uses the TMDB API
                  but is not endorsed or certified by TMDB. Supplementary IMDb ratings are provided
                  by OMDb. These third parties have their own terms, and their data belongs to them.
                </p>

                <h2 id="liability">Liability</h2>
                <p>
                  To the extent the law allows, our liability to you for any claim arising out of
                  these terms or your use of the service is limited to the amount you have paid us,
                  which for free accounts is zero, in the twelve months before the claim. We are
                  not liable for indirect or consequential damages. Nothing here limits rights you
                  have that can&apos;t be waived under your local law.
                </p>

                <h2 id="termination">Termination</h2>
                <p>
                  You can stop using Cinechrony at any time and delete your account from Settings.
                  We may suspend or terminate accounts that repeatedly violate these terms or that
                  pose a safety risk.
                </p>

                <h2 id="law">Governing law</h2>
                <p>
                  These terms are governed by the laws of the jurisdiction in which Cinechrony is
                  operated. Disputes that can&apos;t be resolved informally will be handled in the
                  courts of that jurisdiction.
                </p>

                <h2 id="contact">Contact</h2>
                <p>
                  Questions about these terms? Write to{" "}
                  <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>.
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
          <Link href="/privacy" style={{ textDecoration: "underline" }}>
            Privacy policy
          </Link>
        }
      />
    </>
  );
}
