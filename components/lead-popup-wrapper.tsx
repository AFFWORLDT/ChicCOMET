"use client"

import { LeadCapturePopup, useLeadPopup } from "@/components/lead-capture-popup"

export function LeadPopupWrapper() {
  const { showPopup, setShowPopup } = useLeadPopup()

  if (!showPopup) return null

  return <LeadCapturePopup onClose={() => setShowPopup(false)} />
}

