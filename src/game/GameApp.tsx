"use client"

import React, { useEffect, useState } from "react"
import styled from "@emotion/styled"
import LearnToPlay from "./LearnToPlay"
import Game from "./Game"

type Route = "game" | "learn"

const Root = styled.div({
  minHeight: "100vh",
})

function getRouteFromHash(hash: string): Route {
  const cleaned = hash.replace(/^#\/?/, "").trim()
  if (cleaned === "learn") return "learn"
  return "game"
}

export default function GameApp() {
  const [route, setRoute] = useState<Route>("game")

  useEffect(() => {
    const onHashChange = () => setRoute(getRouteFromHash(window.location.hash))
    onHashChange() // sync on mount
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  return (
    <Root>{route === "learn" ? <LearnToPlay /> : <Game />}</Root>
  )
}
