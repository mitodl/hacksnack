/// <reference types="vite/client" />
import { createRoot } from "react-dom/client"
import { HackSnackGame } from "../src"

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const container = document.getElementById("root")
if (!container) throw new Error("Missing #root element")

createRoot(container).render(
  <HackSnackGame assetBasePath="" googleMapsApiKey={googleMapsApiKey} />,
)
