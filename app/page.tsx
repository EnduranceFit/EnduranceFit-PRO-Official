"use client";

import { useAppContext } from "@/context/AppContext";
import LockScreen from "@/components/LockScreen";
import Wizard from "@/components/Wizard";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const { isLocked, isHydrated } = useAppContext();

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  if (isLocked) {
    return <LockScreen />;
  }

  return <Wizard />;
}
