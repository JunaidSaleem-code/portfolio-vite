"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LuArrowUp, LuCircle, LuSparkles, LuTrash2 } from "react-icons/lu";

const EASE = [0.22, 1, 0.36, 1];

const STARTERS = [
  "What's your strongest AI project?",
  "Walk me through your RAG experience.",
  "Are you available for contract work?",
  "What's your tech stack?",
];

const ALL_STARTERS = [
  ...STARTERS,
  "Tell me about Vanar.",
  "How do you handle production LLM costs?",
  "What's a project you're proud of?",
  "Where are you based and what's your timezone?",
  "What kind of teams do you work best with?",
];

const MAX_HISTORY = 10;

const AskJunaid = ({ className = "" }) => {
  const reduced = useReducedMotion();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle"); // idle | thinking | streaming | error
  const [error, setError] = useState("");
  const transcriptRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  const hasConversation = messages.length > 0;

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages, status]);

  async function ask(question) {
    const trimmed = question.trim();
    if (!trimmed || status === "thinking" || status === "streaming") return;

    setError("");
    const nextHistory = messages.slice(-MAX_HISTORY).map((m) => ({
      role: m.role === "junaid" ? "model" : "user",
      content: m.text,
    }));

    const userMsg = { id: cryptoId(), role: "user", text: trimmed };
    const aiMsg = { id: cryptoId(), role: "junaid", text: "", streaming: true };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
    setStatus("thinking");

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed, history: nextHistory }),
        signal: ctrl.signal,
      });

      if (!res.ok) {
        let msg = "Something went wrong.";
        try {
          const data = await res.json();
          if (data?.error) msg = data.error;
        } catch {}
        setError(msg);
        setStatus("error");
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsg.id ? { ...m, text: msg, streaming: false, error: true } : m))
        );
        return;
      }

      if (!res.body) {
        setError("No response stream.");
        setStatus("error");
        return;
      }

      setStatus("streaming");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";
      let headerParsed = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Parse the sources header — first line, prefixed with `__SOURCES__:`,
        // terminated by a blank line. Everything after is the answer text.
        if (!headerParsed) {
          const sep = buffer.indexOf("\n\n");
          if (sep === -1) continue;
          const header = buffer.slice(0, sep);
          answer = buffer.slice(sep + 2);
          headerParsed = true;
          if (header.startsWith("__SOURCES__:")) {
            try {
              const meta = JSON.parse(header.slice("__SOURCES__:".length));
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === aiMsg.id
                    ? { ...m, sources: meta.sources || [], fallback: meta.fallback }
                    : m
                )
              );
            } catch {}
          }
        } else {
          answer = buffer.slice(buffer.indexOf("\n\n") + 2);
        }

        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsg.id ? { ...m, text: answer } : m))
        );
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === aiMsg.id ? { ...m, streaming: false } : m))
      );
      setStatus("idle");
    } catch (e) {
      if (e?.name === "AbortError") return;
      setError("Couldn't reach the model. Try again in a moment.");
      setStatus("error");
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsg.id
            ? { ...m, text: "Couldn't reach the model. Try again in a moment.", streaming: false, error: true }
            : m
        )
      );
    } finally {
      abortRef.current = null;
    }
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    setError("");
    setStatus("idle");
    inputRef.current?.focus();
  }

  function onSubmit(e) {
    e.preventDefault();
    ask(input);
  }

  const busy = status === "thinking" || status === "streaming";

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, ease: EASE, delay: 0.2 }}
      className={
        "relative overflow-hidden rounded-[2px] border border-[var(--st-ink)] bg-[var(--st-paper)] " +
        className
      }
    >
      {/* Header band */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-[var(--st-ink)] bg-[var(--st-bg-2)] px-3 py-2.5 sm:px-4 md:px-5">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full bg-[var(--st-accent)]"
              animate={
                reduced
                  ? undefined
                  : { boxShadow: ["0 0 0 0 rgba(194,248,79,0.55)", "0 0 0 8px rgba(194,248,79,0)"] }
              }
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="relative h-2.5 w-2.5 rounded-full bg-[var(--st-accent)]" />
          </span>
          <span className="st-mono truncate text-[9px] uppercase tracking-[0.28em] text-[var(--st-ink)] sm:text-[9.5px] sm:tracking-[0.3em]">
            Live transcript
          </span>
          <span className="hidden h-px w-8 bg-[var(--st-line-2)] md:inline-block" />
          <span className="st-mono hidden truncate text-[9.5px] uppercase tracking-[0.3em] text-[var(--st-muted)] md:inline">
            Powered by RAG over my own dossier
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <StatusLabel status={status} />
          {hasConversation && (
            <button
              type="button"
              onClick={reset}
              className="st-mono inline-flex items-center gap-1.5 rounded-full border border-[var(--st-line-2)] bg-[var(--st-paper)] px-2 py-1 text-[9px] uppercase tracking-[0.22em] text-[var(--st-ink-2)] transition hover:border-[var(--st-ink)] hover:text-[var(--st-ink)] sm:px-2.5 sm:text-[9.5px] sm:tracking-[0.25em]"
              aria-label="Reset conversation"
            >
              <LuTrash2 className="h-3 w-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="grid">
        {/* Transcript / Empty state */}
        <div
          ref={transcriptRef}
          className="relative max-h-[60vh] min-h-[200px] overflow-y-auto px-4 py-5 sm:max-h-[440px] sm:px-5 sm:py-6 md:px-8 md:py-8"
        >
          {!hasConversation ? (
            <EmptyState onPick={ask} reduced={reduced} />
          ) : (
            <ul className="space-y-7">
              <AnimatePresence initial={false}>
                {messages.map((m) =>
                  m.role === "user" ? (
                    <UserBubble key={m.id} text={m.text} reduced={reduced} />
                  ) : (
                    <JunaidBubble
                      key={m.id}
                      text={m.text}
                      streaming={m.streaming}
                      error={m.error}
                      sources={m.sources}
                      reduced={reduced}
                    />
                  )
                )}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* Composer */}
        <form
          onSubmit={onSubmit}
          className="border-t border-[var(--st-line-2)] bg-[var(--st-paper)]"
        >
          <div className="flex items-stretch gap-0">
            <span className="st-mono hidden shrink-0 items-center px-3 text-[10px] uppercase tracking-[0.3em] text-[var(--st-muted)] sm:flex sm:px-4 md:px-5">
              You
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                hasConversation
                  ? "Follow-up?"
                  : "Ask anything — projects, stack, availability…"
              }
              maxLength={800}
              disabled={busy}
              className="st-italic w-full min-w-0 bg-transparent px-4 py-3.5 text-[15px] text-[var(--st-ink)] placeholder:text-[var(--st-muted)]/70 focus:outline-none disabled:opacity-60 sm:px-0 sm:py-4 sm:text-[16px] md:text-[17px]"
              aria-label="Your question for Junaid"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="group flex shrink-0 items-center justify-center gap-2 border-l border-[var(--st-line-2)] bg-[var(--st-ink)] px-3.5 text-[var(--st-paper)] transition disabled:opacity-50 enabled:hover:bg-[var(--st-accent)] enabled:hover:text-[var(--st-ink)] sm:px-4 md:px-5"
              aria-label="Send"
            >
              <span className="st-mono hidden text-[10px] uppercase tracking-[0.28em] sm:inline">
                Send
              </span>
              <LuArrowUp className="h-4 w-4 transition-transform group-enabled:group-hover:-translate-y-0.5" />
            </button>
          </div>

          {/* Quick suggestions */}
          {hasConversation && status === "idle" && (
            <div className="flex flex-wrap items-center gap-1.5 border-t border-[var(--st-line-2)] px-4 py-2.5 sm:gap-2 sm:px-5 sm:py-3 md:px-8">
              <span className="st-mono text-[9px] uppercase tracking-[0.26em] text-[var(--st-muted)] sm:text-[9.5px] sm:tracking-[0.28em]">
                Try
              </span>
              {pickSuggestions(messages, 3).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => ask(q)}
                  className="st-mono rounded-full border border-[var(--st-line-2)] bg-[var(--st-bg)] px-2.5 py-1 text-[9.5px] uppercase tracking-[0.18em] text-[var(--st-ink-2)] transition hover:border-[var(--st-ink)] hover:bg-[var(--st-ink)] hover:text-[var(--st-accent)] sm:px-3 sm:text-[10px] sm:tracking-[0.2em]"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {error && status === "error" && (
            <p className="st-mono border-t border-[var(--st-line-2)] bg-[var(--st-bg-2)] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[var(--st-ink-2)] sm:px-5 sm:text-[10.5px] sm:tracking-[0.22em] md:px-8">
              {error}
            </p>
          )}
        </form>
      </div>
    </motion.div>
  );
};

/* ─────────────────────────────  PARTS  ───────────────────────────── */

function pickSuggestions(messages, n) {
  const recentText = messages
    .slice(-3)
    .map((m) => m.text.toLowerCase())
    .join(" ");
  const fresh = ALL_STARTERS.filter(
    (s) => !recentText.includes(s.slice(0, 18).toLowerCase())
  );
  return fresh.slice(0, n);
}

function cryptoId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

const StatusLabel = ({ status }) => {
  const map = {
    idle: { text: "Ready", color: "text-[var(--st-muted)]" },
    thinking: { text: "Thinking", color: "text-[var(--st-ink-2)]" },
    streaming: { text: "Answering", color: "text-[var(--st-ink)]" },
    error: { text: "Error", color: "text-[var(--st-ink)]" },
  };
  const cfg = map[status] || map.idle;
  return (
    <span className={"st-mono text-[9.5px] uppercase tracking-[0.3em] " + cfg.color}>
      {cfg.text}
    </span>
  );
};

const EmptyState = ({ onPick, reduced }) => (
  <div className="flex flex-col gap-6">
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--st-ink)] text-[var(--st-accent)]"
      >
        <LuSparkles className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="st-italic text-[clamp(1.05rem,1.6vw,1.35rem)] leading-snug text-[var(--st-ink)]">
          Ask me about my work — I&rsquo;ll answer from my actual project
          dossier.
        </p>
        <p className="st-mono mt-1 text-[10px] uppercase tracking-[0.22em] text-[var(--st-muted)]">
          Streamed in real time · grounded in my projects, experience, recognition
        </p>
      </div>
    </div>

    <div className="flex flex-wrap gap-2">
      {STARTERS.map((q, i) => (
        <motion.button
          key={q}
          type="button"
          onClick={() => onPick(q)}
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: EASE }}
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--st-line-2)] bg-[var(--st-bg)] px-3.5 py-1.5 text-[var(--st-ink)] transition hover:border-[var(--st-ink)] hover:bg-[var(--st-ink)] hover:text-[var(--st-accent)]"
        >
          <span className="st-mono text-[10px] uppercase tracking-[0.22em]">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-[12.5px]">{q}</span>
        </motion.button>
      ))}
    </div>
  </div>
);

const UserBubble = ({ text, reduced }) => (
  <motion.li
    initial={reduced ? false : { opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35, ease: EASE }}
    className="flex flex-col items-end gap-1.5"
  >
    <span className="st-mono text-[9.5px] uppercase tracking-[0.28em] text-[var(--st-muted)]">
      You
    </span>
    <p className="max-w-[92%] break-words rounded-[2px] border border-[var(--st-ink)] bg-[var(--st-ink)] px-3.5 py-2.5 text-[14px] leading-relaxed text-[var(--st-paper)] sm:max-w-[85%] sm:px-4 sm:text-[14.5px]">
      {text}
    </p>
  </motion.li>
);

const JunaidBubble = ({ text, streaming, error, sources, reduced }) => (
  <motion.li
    initial={reduced ? false : { opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35, ease: EASE }}
    className="flex flex-col gap-1.5"
  >
    <span className="st-mono inline-flex items-center gap-2 text-[9.5px] uppercase tracking-[0.28em] text-[var(--st-ink)]">
      <LuCircle className="h-1.5 w-1.5 fill-[var(--st-accent)] text-[var(--st-accent)]" />
      Junaid
    </span>
    {!error && sources && sources.length > 0 && (
      <SourceChips sources={sources} />
    )}
    <div
      className={
        "max-w-full break-words rounded-[2px] border bg-[var(--st-bg)] px-3.5 py-3 text-[14.5px] leading-relaxed text-[var(--st-ink)] sm:max-w-[88%] sm:px-4 sm:text-[15px] " +
        (error ? "border-[var(--st-ink)]/40 italic" : "border-[var(--st-line-2)]")
      }
    >
      <RichText text={text} />
      {streaming && !text && <ThinkingDots />}
      {streaming && text && <span className="ml-0.5 inline-block h-4 w-[2px] -translate-y-0.5 animate-pulse bg-[var(--st-ink)]" />}
    </div>
  </motion.li>
);

const KIND_LABEL = {
  project: "Project",
  experience: "Role",
  achievement: "Award",
  testimonial: "Quote",
  identity: "About",
  contact: "Contact",
};

const SourceChips = ({ sources }) => (
  <div className="flex flex-wrap items-center gap-1.5">
    <span className="st-mono text-[9px] uppercase tracking-[0.26em] text-[var(--st-muted)] sm:tracking-[0.28em]">
      Retrieved · top {sources.length}
    </span>
    {sources.map((s) => {
      const label = `${KIND_LABEL[s.kind] || s.kind} · ${s.title || s.refId}`;
      const score = typeof s.score === "number" ? s.score.toFixed(2) : "";
      const inner = (
        <>
          <span className="st-mono max-w-[55vw] truncate text-[9px] uppercase tracking-[0.16em] sm:max-w-[16rem] sm:tracking-[0.18em]">
            {label}
          </span>
          {score && (
            <span className="st-mono shrink-0 text-[8.5px] tracking-[0.18em] text-[var(--st-muted)]">
              {score}
            </span>
          )}
        </>
      );
      const className =
        "inline-flex max-w-full items-center gap-1.5 rounded-full border border-[var(--st-line-2)] bg-[var(--st-paper)] px-2 py-0.5 text-[var(--st-ink-2)] transition hover:border-[var(--st-ink)] hover:bg-[var(--st-ink)] hover:text-[var(--st-accent)]";
      return s.url && s.url.startsWith("/") ? (
        <Link key={s.chunkId} href={s.url} className={className}>
          {inner}
        </Link>
      ) : s.url ? (
        <a key={s.chunkId} href={s.url} className={className}>
          {inner}
        </a>
      ) : (
        <span key={s.chunkId} className={className}>
          {inner}
        </span>
      );
    })}
  </div>
);

const ThinkingDots = () => (
  <span className="inline-flex items-center gap-1">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--st-ink-2)]"
        style={{ animationDelay: `${i * 0.18}s` }}
      />
    ))}
  </span>
);

/**
 * Renders Junaid's answer with citations like [project:slug] turned into
 * inline links to the project page. Other citations are rendered as small chips.
 */
const RichText = ({ text }) => {
  if (!text) return null;
  const parts = parseCitations(text);
  return (
    <span className="whitespace-pre-wrap">
      {parts.map((p, i) => {
        if (p.type === "text") return <span key={i}>{p.value}</span>;
        if (p.type === "project") {
          return (
            <Link
              key={i}
              href={`/projects/${p.slug}`}
              className="st-mono ml-0.5 inline-flex translate-y-[-1px] items-center rounded-sm border border-[var(--st-ink)] bg-[var(--st-paper)] px-1.5 py-[1px] text-[10px] uppercase tracking-[0.18em] text-[var(--st-ink)] transition hover:bg-[var(--st-accent)]"
            >
              ↗ {p.slug}
            </Link>
          );
        }
        return (
          <span
            key={i}
            className="st-mono ml-0.5 inline-block translate-y-[-1px] rounded-sm border border-[var(--st-line-2)] bg-[var(--st-paper)] px-1.5 py-[1px] text-[10px] uppercase tracking-[0.18em] text-[var(--st-muted)]"
          >
            {p.kind} {p.value}
          </span>
        );
      })}
    </span>
  );
};

function parseCitations(text) {
  const parts = [];
  const regex = /\[(project|experience|testimonial):([a-zA-Z0-9_-]+)\]/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    const [, kind, value] = match;
    if (kind === "project") {
      parts.push({ type: "project", slug: value });
    } else {
      parts.push({ type: "cite", kind, value });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }
  return parts;
}

export default AskJunaid;
