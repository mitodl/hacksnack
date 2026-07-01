import React from "react"
import { PuzzleBox } from "./PuzzleBox"
import { PuzzleInput } from "./PuzzleInput"
import { parseLatLngFromClue, streetViewEmbedUrl } from "../../lib/url"
import { getGoogleMaps, loadGoogleMaps } from "../../lib/maps"
import {
  SmallPrompt,
  MapFrame,
  FullFrame,
  MapBlockedMsg,
  Message,
} from "../../styled"
import type { MapCoordType, TextPuzzleProps } from "../../types"

export function PuzzleMap({
  mapCoord,
  input,
  setInput,
  onSubmit,
  message,
  stepIndex,
  totalSteps,
  apiKey,
  isSolved,
  hint,
  hintShown,
  onToggleHint,
}: { mapCoord: MapCoordType; apiKey?: string } & TextPuzzleProps) {
  const [mapMessage, setMapMessage] = React.useState<string>("")
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const coords = React.useMemo(
    () => parseLatLngFromClue(mapCoord.clue),
    [mapCoord.clue],
  )
  // With an API key we render the interactive Street View panorama; without
  // one we fall back to a keyless Street View <iframe> embed built from the
  // same coordinates.
  const showPanorama = !!apiKey && !!coords
  const embedUrl = coords
    ? streetViewEmbedUrl(coords.lat, coords.lng)
    : null

  React.useEffect(() => {
    if (!showPanorama || !coords) {
      setMapMessage("")
      return
    }
    let rafId = 0
    let cancelled = false
    let pano: unknown = null
    let resizeTimer = 0
    let mapsRef: ReturnType<typeof getGoogleMaps> = undefined

    const loadMap = async () => {
      try {
        await loadGoogleMaps(apiKey)
        if (cancelled) return
        const el = containerRef.current
        if (!el) return

        const rect = el.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) {
          rafId = requestAnimationFrame(loadMap)
          return
        }

        const maps = getGoogleMaps()
        if (!maps) return
        mapsRef = maps
        const sv = new maps.StreetViewService()
        sv.getPanorama(
          {
            location: { lat: coords.lat, lng: coords.lng },
            radius: 200,
            source: maps.StreetViewSource.OUTDOOR,
          },
          (data, status) => {
            if (cancelled) return
            if (status === maps.StreetViewStatus.OK) {
              pano = new maps.StreetViewPanorama(el, {
                position: data.location.latLng,
                pov: { heading: 0, pitch: 0 },
                zoom: 0,
                addressControl: false,
                motionTracking: false,
                linksControl: true,
                fullscreenControl: true,
                visible: true,
              })

              resizeTimer = window.setTimeout(() => {
                if (cancelled) return
                if (maps.event?.trigger) {
                  maps.event.trigger(pano, "resize")
                }
              }, 0)
            } else {
              setMapMessage("Couldn't find a Street View for this location.")
            }
          },
        )
      } catch {
        if (!cancelled)
          setMapMessage(
            "Google Maps failed to load. You may need an API key with billing enabled.",
          )
      }
    }

    loadMap()
    return () => {
      cancelled = true
      if (rafId) cancelAnimationFrame(rafId)
      if (resizeTimer) window.clearTimeout(resizeTimer)
      // Tear down the panorama + its listeners so remounting the puzzle
      // (e.g. Prev/Next navigation) doesn't leak an instance each time.
      if (pano && mapsRef?.event?.clearInstanceListeners) {
        mapsRef.event.clearInstanceListeners(pano)
      }
      pano = null
    }
  }, [showPanorama, coords, apiKey])

  return (
    <PuzzleBox
      label="Map"
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      hint={hint}
      hintShown={hintShown}
      onToggleHint={onToggleHint}
      isSolved={isSolved}
    >
      <SmallPrompt>What country is this?</SmallPrompt>
      {showPanorama ? (
        <MapFrame ref={containerRef} />
      ) : embedUrl ? (
        <MapFrame>
          <FullFrame
            title="Map puzzle embed"
            src={embedUrl}
            allowFullScreen
            loading="lazy"
          />
        </MapFrame>
      ) : (
        <MapFrame>
          <MapBlockedMsg>Invalid coordinates for this puzzle.</MapBlockedMsg>
        </MapFrame>
      )}
      <PuzzleInput
        input={input}
        setInput={setInput}
        onSubmit={onSubmit}
        isSolved={isSolved}
        hint={hint}
        hintShown={hintShown}
      />
      {mapMessage && <Message>{mapMessage}</Message>}
      {message && <Message>{message}</Message>}
    </PuzzleBox>
  )
}
