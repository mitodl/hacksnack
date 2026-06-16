import React, { useEffect, useRef, useState } from "react"
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from "pdfjs-dist"
import { PdfViewerRoot, PdfStatus } from "../styled"
import { useAsset } from "../AssetContext"

export function PdfFactViewer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [status, setStatus] = useState("Loading PDF...")
  const [error, setError] = useState("")
  // The PDF worker is served as a static asset from the consuming app.
  const asset = useAsset()
  const pdfWorkerUrl = asset("pdf.worker.mjs")

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cancelled = false
    let loadingTask: PDFDocumentLoadingTask | null = null
    let pdfDocument: PDFDocumentProxy | null = null
    container.replaceChildren()
    setError("")
    setStatus("Loading PDF...")

    const renderPdf = async () => {
      const pdfjsLib = await import("pdfjs-dist")
      if (cancelled) return

      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl
      loadingTask = pdfjsLib.getDocument({ url })
      pdfDocument = await loadingTask.promise
      if (cancelled) return

      for (
        let pageNumber = 1;
        pageNumber <= pdfDocument.numPages;
        pageNumber += 1
      ) {
        setStatus(`Rendering page ${pageNumber} of ${pdfDocument.numPages}...`)
        const page = await pdfDocument.getPage(pageNumber)
        if (cancelled) return

        const baseViewport = page.getViewport({ scale: 1 })
        const availableWidth = Math.min(container.clientWidth || 720, 880)
        const viewport = page.getViewport({
          scale: availableWidth / baseViewport.width,
        })
        const outputScale = Math.min(window.devicePixelRatio || 1, 2)
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        if (!context) throw new Error("Canvas rendering is not available.")

        canvas.width = Math.floor(viewport.width * outputScale)
        canvas.height = Math.floor(viewport.height * outputScale)
        canvas.style.width = `${Math.floor(viewport.width)}px`
        canvas.style.height = `${Math.floor(viewport.height)}px`
        container.appendChild(canvas)

        await page.render({
          canvas,
          canvasContext: context,
          viewport,
          transform:
            outputScale === 1
              ? undefined
              : [outputScale, 0, 0, outputScale, 0, 0],
        }).promise
        page.cleanup()
      }

      if (!cancelled) setStatus("")
    }

    renderPdf().catch(() => {
      if (!cancelled) {
        container.replaceChildren()
        setStatus("")
        setError("PDF preview unavailable.")
      }
    })

    return () => {
      cancelled = true
      container.replaceChildren()
      void loadingTask?.destroy()
      void pdfDocument?.destroy()
    }
  }, [url, pdfWorkerUrl])

  return (
    <PdfViewerRoot>
      {(status || error) && <PdfStatus>{error || status}</PdfStatus>}
      <div ref={containerRef} />
    </PdfViewerRoot>
  )
}
