'use client'

import { useState } from 'react'

export function useDashboardMenu() {
  const [activeTab, setActiveTab] = useState('student')

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  return {
    activeTab,
    handleTabChange,
  }
}
