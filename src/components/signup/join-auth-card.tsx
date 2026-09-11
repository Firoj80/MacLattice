import { useState, type FormEvent } from "react";
import {
  GROK_PROVIDERS,
  authClient,
  authEnabled,
  signIn,
} from "@/lib/auth/client";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SITE } from "@/data/site";
import { cn } from "@/lib/utils";

const CALLBACK = "/";

export function JoinAuthCard({ initialMode = "signup" }: { initialMode?: "signup" | "signin" }) {
  const { user, isPending } = useCurrentUserState();

  if (isPending) {
    return (
      <div className="rounded-[28px] border border-border bg-card p-6 shadow-[0_20px_50px_rgb(28_27_25/0.08)] md:p-8">
        <div className="h-8 w-40 animate-pulse rounded-md bg-fg/8" />
        <div className="mt-6 space-y-3">
          <div className="h-11 animate-pulse rounded-xl bg-fg/8" />
          <div className="h-11 animate-pulse rounded-xl bg-fg/8" />
          <div className="h-12 animate-pulse rounded-xl bg-fg/8" />
        </div>
      </div>
    );
  }

  if (user) {
    return <SignedInPanel name={user.displayName ?? user.primaryEmail ?? "there"} />;
  }

  return <AuthForm initialMode={initialMode} />;
}

function SignedInPanel({ name }: { name: string }) {
  return (
    <div className="rounded-[28px] border border-border bg-card p-6 shadow-[0_20px_50px_rgb(28_27_25/0.08)] md:p-8">
      <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">You are in</p>
      <h2 className="font-display mt-2 text-3xl leading-tight font-medium tracking-tight text-fg">
        Welcome, {name.split(" ")[0]}.
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        Your {SITE.name} account is ready. Lifetime access is {SITE.lifetimePrice} —
        paid once, yours forever.
      </p>
      <a
        href="#pricing"
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg transition-transform duration-150 hover:brightness-110 active:scale-[0.98]"
      >
        Get lifetime access — {SITE.lifetimePrice}
      </a>
      <div className="mt-6 border-t border-border pt-4">
        <UserButton />
      </div>
    </div>
  );
}

function AuthForm({ initialMode }: { initialMode: "signup" | "signin" }) {
  const [mode, setMode] = useState<"signup" | "signin">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error: err } = await authClient.signUp.email({
          name: name.trim() || email.split("@")[0],
          email: email.trim(),
          password,
          callbackURL: CALLBACK,
        });
        if (err) throw new Error(err.message || "Could not create the account.");
      } else {
        const { error: err } = await authClient.signIn.email({
          email: email.trim(),
          password,
          callbackURL: CALLBACK,
        });
        if (err) throw new Error(err.message || "Could not sign in.");
      }
      await authClient.getSession();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-[28px] border border-border bg-card p-6 shadow-[0_20px_50px_rgb(28_27_25/0.08)] md:p-8">
      <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
        {mode === "signup" ? "Create your account" : "Welcome back"}
      </p>
      <h2 className="font-display mt-2 text-3xl leading-tight font-medium tracking-tight text-fg">
        {mode === "signup" ? "Start with a free account." : `Sign in to ${SITE.name}.`}
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">
        Then unlock every visualisation, duplicate finder, scan comparison, and
        cleanup preset for {SITE.lifetimePrice} lifetime.
      </p>

      {authEnabled ? (
        <div className="mt-6 flex flex-col gap-2">
          {GROK_PROVIDERS.map((p) => (
            <button
              key={p.providerId}
              type="button"
              onClick={() => signIn(p.providerId, { callbackURL: CALLBACK })}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-bg text-sm font-semibold text-fg transition-colors hover:bg-fg/4"
            >
              Continue with {p.label}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-sm text-muted">Sign-in is disabled.</p>
      )}

      <div className="my-5 flex items-center gap-3 text-[11px] tracking-[0.16em] text-muted uppercase">
        <span className="h-px flex-1 bg-border" />
        or email
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        {mode === "signup" ? (
          <Field label="Name" autoComplete="name" value={name} onChange={setName} />
        ) : null}
        <Field
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          required
        />
        <Field
          label="Password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          value={password}
          onChange={setPassword}
          required
          minLength={8}
        />
        {error ? (
          <p className="text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy || !authEnabled}
          className={cn(
            "inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-fg transition-transform duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-60",
          )}
        >
          {busy ? "Working…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-muted">
        {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
        <button
          type="button"
          className="font-semibold text-primary underline-offset-4 hover:underline"
          onClick={() => {
            setError(null);
            setMode((m) => (m === "signup" ? "signin" : "signup"));
          }}
        >
          {mode === "signup" ? "Sign in" : "Create one"}
        </button>
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  required,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium tracking-wide text-muted">{label}</span>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-border bg-bg px-3 text-[15px] text-fg outline-none ring-primary/30 transition-shadow focus:ring-2"
      />
    </label>
  );
}
