# iTabs Queue Builder

Build a staff/operator queue val to pair with an iTabs ordering menu — a live, shared order list showing QR/customer orders and manually-typed walk-up orders together, with paid/done status flags.

## When to use this skill

Use this whenever a venue needs staff to see incoming orders on one screen next to the till — not a payment integration, a smart whiteboard that sits next to whatever POS/EFTPOS the venue already uses. Trigger on requests like "build a queue for [venue]", "staff order screen", "operator side for the menu", or when a venue using an iTabs menu says orders get lost or hard to track during a rush.

## How it works

Two separate Val.town HTTP vals, sharing data through a common `SLUG`:

- **`template-menu.ts`** — customer-facing ordering page. Customers place orders via QR/browser; each order gets written to a shared orders blob (`itabs-orders-<SLUG>`).
- **`template-queue.ts`** — staff-facing queue page, bookmarked on the venue's iPad/device. Reads the same orders blob. Staff can also manually add walk-up orders here directly.

Both vals must have the exact same `SLUG` set, or they won't share data.

## Setup for a new venue

1. Copy `template-menu.ts` into a new Val.town HTTP val. Set `SLUG` to a unique venue identifier (e.g. `"venue-name"`). Update the `SEED` object with the venue's actual menu items and settings (name, colour, phone, etc.) — this is only the fallback shown until the first Save.
2. Copy `template-queue.ts` into a second, separate Val.town HTTP val. Set `SLUG` to the **exact same** value as the menu val. Nothing else needs manual editing — venue name, accent colour, and item list all pull live from the menu val's settings blob at request time.
3. Bookmark the queue val's URL on the venue's staff device (iPad, tablet, etc.).

## Key design decisions (v2, current)

- **Multi-item cart on the staff side.** Staff build up an order (multiple items, quantities) before submitting — mirrors the customer-facing cart pattern. Do not regress to the old v1 behaviour where each tap on an item submitted immediately as a single-item order.
- **No payment integration.** Payment happens exactly as it does today at the venue (cash, EFTPOS terminal, whatever POS they use) — the queue only tracks a manual paid/unpaid flag staff tap themselves. Do not build POS/Square/Tyro integration as part of this skill; that is a separate, larger, and currently deprioritized direction.
- **Shared blob keys, not global state.** `itabs-menu-<SLUG>` and `itabs-orders-<SLUG>` — always import from `https://esm.town/v/std/blob` (global, not the newer `/main.ts` scoped variant) so the two vals can see each other's data.
- **Venue branding pulled live, not duplicated.** The queue val has no hardcoded venue name/colour — it always reflects whatever's currently saved in the menu val's settings.

## Known limitations / open items

- No per-item notes yet — only one shared notes field per whole order. Revisit if a real venue hits this as a recurring pain point (not yet requested beyond one instance).
- The menu val's `/save` endpoint must be triggered at least once (via the PIN editor) before the queue val will show real venue data — until then it shows a generic "Venue" fallback.
