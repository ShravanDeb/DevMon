"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const subject = `DevMon Contact — ${name || "New message"}`;
  const body = `From: ${name} <${email}>\n\n${message}`;
  const mailtoHref = `mailto:shravandeb@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="rounded-[14px] neu-raised-lg p-8 md:p-10">
      <div className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-[13px] font-mono text-text-tertiary uppercase tracking-[0.08em] mb-2"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-[8px] neu-input px-4 py-3 text-[14px] text-text-primary placeholder:text-text-tertiary"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-[13px] font-mono text-text-tertiary uppercase tracking-[0.08em] mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-[8px] neu-input px-4 py-3 text-[14px] text-text-primary placeholder:text-text-tertiary"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-[13px] font-mono text-text-tertiary uppercase tracking-[0.08em] mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            placeholder="What's on your mind?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-[8px] neu-input px-4 py-3 text-[14px] text-text-primary placeholder:text-text-tertiary resize-none"
          />
        </div>

        <a
          href={mailtoHref}
          className="inline-flex items-center gap-2 rounded-[8px] neu-btn-accent px-6 py-3 text-[13px] font-medium"
        >
          Send via Email
        </a>

        <p className="text-[12px] text-text-tertiary">
          This form opens your email client with a pre-filled message.
          We don&apos;t collect or store form submissions on a server.
        </p>
      </div>
    </div>
  );
}
