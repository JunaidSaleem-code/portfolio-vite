"use client";

import { forwardRef, useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

const PasswordInput = forwardRef(function PasswordInput({ className = "", ...props }, ref) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        ref={ref}
        type={visible ? "text" : "password"}
        className={"st-input pr-11 " + className}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[var(--st-muted)] transition hover:bg-[var(--st-bg-2)] hover:text-[var(--st-ink)]"
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {visible ? <LuEyeOff className="h-4 w-4" /> : <LuEye className="h-4 w-4" />}
      </button>
    </div>
  );
});

export default PasswordInput;
