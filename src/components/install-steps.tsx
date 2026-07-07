"use client";

import { useState, useSyncExternalStore } from "react";
import { SafariIcon, ShareIcon, AddSquareIcon, ChromeIcon, DownloadIcon } from "@/components/icons";
import { site } from "@/lib/site";

const appHost = new URL(site.appUrl).host;

type Platform = "ios" | "android";

// user agent never changes during a session, so subscribe is a no-op
const noopSubscribe = () => () => {};
const detectPlatform = (): Platform => (/android/i.test(navigator.userAgent) ? "android" : "ios");
const serverPlatform = (): Platform => "ios";

/**
 * Platform picker + the compact install steps from the mockup, centered
 * above the step grid it controls (not floating beside the page hero).
 * Defaults to iPhone; the user agent flips Android users to the Chrome
 * steps, and the segmented control overrides either way.
 */
export function InstallSteps() {
  const detected = useSyncExternalStore(noopSubscribe, detectPlatform, serverPlatform);
  const [override, setPlatform] = useState<Platform | null>(null);
  const platform = override ?? detected;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
        <div className="seg" role="group" aria-label="choose your phone">
          <button type="button" aria-pressed={platform === "ios"} onClick={() => setPlatform("ios")}>
            iPhone
          </button>
          <button type="button" aria-pressed={platform === "android"} onClick={() => setPlatform("android")}>
            Android
          </button>
        </div>
      </div>

      {platform === "ios" ? (
        <div className="isteps">
          <div className="istep">
            <div className="istep__ic">
              <SafariIcon />
            </div>
            <div className="istep__t">
              <span className="n">Step 1</span>
              <h2>Open in Safari</h2>
              <p>Go to {appHost} in Safari.</p>
            </div>
          </div>
          <div className="istep">
            <div className="istep__ic">
              <ShareIcon />
            </div>
            <div className="istep__t">
              <span className="n">Step 2</span>
              <h2>Tap Share</h2>
              <p>The square with an arrow, at the bottom.</p>
            </div>
          </div>
          <div className="istep">
            <div className="istep__ic">
              <AddSquareIcon />
            </div>
            <div className="istep__t">
              <span className="n">Step 3</span>
              <h2>Add to Home Screen</h2>
              <p>Scroll down, tap it, then tap Add.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="isteps">
          <div className="istep">
            <div className="istep__ic">
              <ChromeIcon />
            </div>
            <div className="istep__t">
              <span className="n">Step 1</span>
              <h2>Open in Chrome</h2>
              <p>Go to {appHost} in Chrome.</p>
            </div>
          </div>
          <div className="istep">
            <div className="istep__ic">
              <DownloadIcon />
            </div>
            <div className="istep__t">
              <span className="n">Step 2</span>
              <h2>Tap Install</h2>
              <p>Use Chrome&apos;s &quot;Install app&quot; prompt, or the browser menu.</p>
            </div>
          </div>
          <div className="istep">
            <div className="istep__ic">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/cinechrony-logo.png" alt="Cinechrony icon" width={30} height={30} />
            </div>
            <div className="istep__t">
              <span className="n">Step 3</span>
              <h2>You&apos;re done</h2>
              <p>The popcorn lands on your home screen.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
