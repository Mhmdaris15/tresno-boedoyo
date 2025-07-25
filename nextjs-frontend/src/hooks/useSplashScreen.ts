'use client'

import { useEffect, useState } from 'react'

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const mobileKeywords = [
        'android', 'webos', 'iphone', 'ipad', 'ipod', 
        'blackberry', 'windows phone', 'mobile'
      ]
      
      const isMobileDevice = mobileKeywords.some(keyword => 
        userAgent.includes(keyword)
      )
      
      const isSmallScreen = window.innerWidth <= 768
      
      setIsMobile(isMobileDevice || isSmallScreen)
      setIsLoading(false)
    }

    // Check on mount
    checkMobile()

    // Check on resize
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return { isMobile, isLoading }
}

export function useSplashScreen(showOnMobile: boolean = true) {
  const [showSplash, setShowSplash] = useState(false)
  const [splashCompleted, setSplashCompleted] = useState(false)
  const { isMobile, isLoading } = useMobileDetection()

  useEffect(() => {
    if (!isLoading) {
      // Check if splash was already shown in this session
      const splashShown = sessionStorage.getItem('splashShown')
      
      if (!splashShown && showOnMobile && isMobile) {
        setShowSplash(true)
      } else {
        setSplashCompleted(true)
      }
    }
  }, [isMobile, isLoading, showOnMobile])

  const completeSplash = () => {
    setShowSplash(false)
    setSplashCompleted(true)
    sessionStorage.setItem('splashShown', 'true')
  }

  return {
    showSplash,
    splashCompleted,
    isMobile,
    isLoading,
    completeSplash
  }
}
