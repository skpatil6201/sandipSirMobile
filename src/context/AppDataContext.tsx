/**
 * In-memory demo state shared between screens (receiving accounts, trusted
 * devices). Seeded from static mock data.
 *
 * TODO(Firebase): back this with Firestore listeners.
 *
 * @format
 */

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { RECEIVING_ACCOUNTS, TRUSTED_DEVICES, USER, type ReceivingAccount } from '../data/mock';

type Device = (typeof TRUSTED_DEVICES)[number];

type AppData = {
  /** UEMOA country the user is sending from (any of the 8). */
  senderCountry: string;
  setSenderCountry: (code: string) => void;
  accounts: ReceivingAccount[];
  defaultAccountId: string | null;
  addAccount: (a: Omit<ReceivingAccount, 'id'>, makeDefault: boolean) => void;
  removeAccount: (id: string) => void;
  setDefaultAccount: (id: string) => void;
  devices: Device[];
  removeDevice: (id: string) => void;
  signOutOtherDevices: () => void;
};

const Ctx = createContext<AppData | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<ReceivingAccount[]>(RECEIVING_ACCOUNTS);
  const [defaultAccountId, setDefault] = useState<string | null>(RECEIVING_ACCOUNTS[0]?.id ?? null);
  const [devices, setDevices] = useState<Device[]>(TRUSTED_DEVICES);
  const [senderCountry, setSenderCountry] = useState<string>(USER.countryCode);

  const value = useMemo<AppData>(
    () => ({
      senderCountry,
      setSenderCountry,
      accounts,
      defaultAccountId,
      addAccount: (a, makeDefault) => {
        const id = `a${Date.now()}`;
        setAccounts(prev => [...prev, { ...a, id }]);
        if (makeDefault || accounts.length === 0) {
          setDefault(id);
        }
      },
      removeAccount: id => {
        setAccounts(prev => {
          const next = prev.filter(x => x.id !== id);
          if (id === defaultAccountId) {
            setDefault(next[0]?.id ?? null);
          }
          return next;
        });
      },
      setDefaultAccount: id => setDefault(id),
      devices,
      removeDevice: id => setDevices(prev => prev.filter(d => d.id !== id)),
      signOutOtherDevices: () => setDevices(prev => prev.filter(d => d.current)),
    }),
    [senderCountry, accounts, defaultAccountId, devices],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppData(): AppData {
  const v = useContext(Ctx);
  if (!v) {
    throw new Error('useAppData must be used inside AppDataProvider');
  }
  return v;
}
