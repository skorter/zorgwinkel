// The basket (screens 1.4, 1.5, 2.2, 2.3): everything the patient wants
// to send, collected before anything leaves the phone.
// It lives only in memory, not in Supabase or AsyncStorage: nothing is
// sent until the patient taps Send request, and an unsent basket is gone
// when the app closes (a choice in the technical design).
// The allowed values match the "check" lines in supabase/schema.sql.
// The field names are camelCase as usual in TypeScript; submitBasket()
// in lib/api.ts turns them into the snake_case names the database uses.
import { createContext, ReactNode, useContext, useState } from "react";

export type Provider = "gp" | "nurse";
export type Reason = "checkup" | "pain" | "other" | "tell_doctor";
export type PartOfDay = "morning" | "afternoon";

// One appointment request: who, why, and which day and part of the day.
export type AppointmentRequest = {
  provider: Provider;
  reason: Reason;
  note?: string; // the optional few words on 1.2
  preferredDate: string; // "YYYY-MM-DD"
  partOfDay: PartOfDay;
};

// One medicine from the patient's own list (US02, Phase 5).
// Name and strength are kept so the basket can show them without
// asking Supabase again.
export type MedicineRequest = {
  medicineId: string;
  name: string;
  strength: string;
};

// An item is either an appointment or a medicine. The "kind" tells
// the basket screen which card to show and which step Change opens.
export type BasketItem =
  | { id: string; kind: "appointment"; appointment: AppointmentRequest }
  | { id: string; kind: "medicine"; medicine: MedicineRequest };

// What a screen passes in: the basket gives the item its id itself.
export type NewBasketItem =
  | { kind: "appointment"; appointment: AppointmentRequest }
  | { kind: "medicine"; medicine: MedicineRequest };

type BasketContextValue = {
  items: BasketItem[];
  count: number;
  add: (item: NewBasketItem) => string; // returns the new item's id
  remove: (id: string) => void;
  change: (id: string, item: NewBasketItem) => void;
  empty: () => void;
};

const BasketContext = createContext<BasketContextValue | null>(null);

// A local id, only used on the phone to find an item again for Change
// and Remove. Supabase gives the real ids when the basket is sent.
function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);

  function add(item: NewBasketItem) {
    // The same medicine twice would become two requests for one box:
    // if it is already in the basket, keep the one that is there.
    if (item.kind === "medicine") {
      const existing = items.find(
        (i) =>
          i.kind === "medicine" &&
          i.medicine.medicineId === item.medicine.medicineId,
      );
      if (existing) return existing.id;
    }
    const id = newId();
    setItems((current) => [...current, { ...item, id } as BasketItem]);
    return id;
  }

  function remove(id: string) {
    setItems((current) => current.filter((i) => i.id !== id));
  }

  // Change keeps the item in its place and with its id, so the basket
  // does not jump around after the patient edits an appointment.
  function change(id: string, item: NewBasketItem) {
    setItems((current) =>
      current.map((i) => (i.id === id ? ({ ...item, id } as BasketItem) : i)),
    );
  }

  // Only called after submit_basket succeeded, never before.
  function empty() {
    setItems([]);
  }

  return (
    <BasketContext.Provider
      value={{ items, count: items.length, add, remove, change, empty }}
    >
      {children}
    </BasketContext.Provider>
  );
}

// In a screen: const { items, add } = useBasket();
export function useBasket() {
  const value = useContext(BasketContext);
  if (!value) throw new Error("useBasket must be used inside BasketProvider");
  return value;
}
