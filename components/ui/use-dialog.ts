"use client";

import { useCallback, useRef, useState } from "react";

export function useDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => {
    setIsOpen(true);
    ref.current?.showModal();
  }, []);

  const close = useCallback(() => ref.current?.close(), []);
  const onClose = useCallback(() => setIsOpen(false), []);

  return { ref, isOpen, open, close, onClose };
}
