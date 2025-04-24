"use client"

import { useState, useEffect, useRef } from "react"

export default function LazyMap() {
  const [mapLoaded, setMapLoaded] = useState(false)
  const mapRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMapLoaded(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (mapRef.current) {
      observer.observe(mapRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={mapRef} className="mt-8 h-64 w-full bg-gray-200 rounded-lg overflow-hidden">
      {mapLoaded ? (
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.3!2d-38.5!3d-3.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwNDInMDAuMCJTIDM4wrAzMCcwMC4wIlc!5e0!3m2!1sen!2sbr!4v1620000000000!5m2!1sen!2sbr"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Localização do consultório"
          aria-label="Mapa mostrando a localização do consultório"
        ></iframe>
      ) : (
        <div className="h-full w-full flex items-center justify-center text-[#735B43]">Carregando mapa...</div>
      )}
    </div>
  )
}

