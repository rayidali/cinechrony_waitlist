"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

type Status = "idle" | "loading" | "success" | "error";

/**
 * Posts to the existing Loops newsletter form, so signups keep landing in
 * the same audience the old site collected.
 */
export function WaitlistForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  // the form unmounts on success; move focus to the confirmation so
  // keyboard and screen-reader users are not dropped back to <body>
  useEffect(() => {
    if (status === "success") successHeadingRef.current?.focus();
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const body =
      `firstName=${encodeURIComponent(firstName)}` +
      `&email=${encodeURIComponent(email)}` +
      `&source=${encodeURIComponent(source)}` +
      `&mailingLists=${site.waitlist.mailingList}`;

    try {
      const res = await fetch(site.waitlist.endpoint, {
        method: "POST",
        body,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (res.status === 429) {
        setStatus("error");
        setErrorMessage("Too many signups right now. Please try again in a minute.");
        return;
      }

      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div aria-live="polite" style={{ textAlign: "center", padding: "20px 0" }}>
        <div className="eyebrow" style={{ color: "var(--cc-sage-deep)", marginBottom: 14 }}>
          You&apos;re on the list
        </div>
        <h2 className="h2" tabIndex={-1} ref={successHeadingRef} style={{ outline: "none" }}>
          Saved your seat.
        </h2>
        <p className="body" style={{ color: "var(--fg-soft)", marginTop: 12 }}>
          We&apos;ll email you the day it lands. In the meantime,{" "}
          <Link href="/install" style={{ textDecoration: "underline" }}>
            install the web app
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label className="lbl" htmlFor="wl-name">
          First name <span style={{ opacity: 0.5 }}>optional</span>
        </label>
        <input
          className="field"
          id="wl-name"
          type="text"
          placeholder="Sam"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          autoComplete="given-name"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label className="lbl" htmlFor="wl-src">
          How&apos;d you find us? <span style={{ opacity: 0.5 }}>optional</span>
        </label>
        <input
          className="field"
          id="wl-src"
          type="text"
          placeholder="A friend, a reel, group chat"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
      </div>
      <div className="wl-row">
        <div className="wl-row__field">
          <label className="lbl" htmlFor="wl-email">
            Email
          </label>
          <input
            className="field"
            id="wl-email"
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <button className="btn btn--accent btn--lg wl-row__btn" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Joining…" : "Join the waitlist"}
        </button>
      </div>
      {status === "error" && (
        <p className="form-error" role="alert">
          {errorMessage}
        </p>
      )}
      <p className="meta" style={{ textAlign: "center" }}>
        No spam, ever. Unsubscribe in one tap.
      </p>
    </form>
  );
}
