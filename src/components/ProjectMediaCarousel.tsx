"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Props {
  basePath: string;
  title: string;
  images?: string[];
  video?: string;
  videos?: string[];
}

type Slide =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string };

/**
 * Carrossel simples: vídeo primeiro, depois imagens. Clique abre vista ampliada.
 */
export default function ProjectMediaCarousel({
  basePath,
  title,
  images = [],
  video,
  videos,
}: Props) {
  const slides = useMemo<Slide[]>(() => {
    const list: Slide[] = [];
    const videoPaths =
      videos && videos.length > 0 ? videos : video ? [video] : [];
    for (const path of videoPaths) {
      list.push({ kind: "video", src: `${basePath}${path}` });
    }
    list.push(
      ...images.map((path, i) => ({
        kind: "image" as const,
        src: `${basePath}${path}`,
        alt: `${title} screenshot ${i + 1}`,
      }))
    );
    return list;
  }, [basePath, images, video, videos, title]);

  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lightboxVideoRef = useRef<HTMLVideoElement>(null);

  const go = useCallback(
    (next: number) => {
      if (slides.length === 0) return;
      setIndex((next + slides.length) % slides.length);
    },
    [slides.length]
  );

  const goNext = useCallback(() => {
    go(index + 1);
  }, [go, index]);

  const openLightbox = useCallback(() => {
    setExpanded(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setExpanded(false);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || expanded) return;
    if (slides[index]?.kind !== "video") {
      el.pause();
      return;
    }
    el.currentTime = 0;
    const tryPlay = () => {
      void el.play().catch(() => {
        el.muted = true;
        void el.play();
      });
    };
    if (el.readyState >= 2) tryPlay();
    else el.addEventListener("loadeddata", tryPlay, { once: true });
    return () => el.removeEventListener("loadeddata", tryPlay);
  }, [index, slides, expanded]);

  useEffect(() => {
    if (!expanded) return;
    const el = lightboxVideoRef.current;
    if (!el || slides[index]?.kind !== "video") return;
    void el.play().catch(() => {
      el.muted = true;
      void el.play();
    });
  }, [expanded, index, slides]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "ArrowRight") go(index + 1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [closeLightbox, expanded, go, index]);

  if (slides.length === 0) return null;

  const slide = slides[index];
  const showControls = slides.length > 1;

  const renderSlide = (
    current: Slide,
    opts: { large?: boolean; videoRef?: React.RefObject<HTMLVideoElement | null> }
  ) => {
    const className = opts.large
      ? "project-media-slide project-media-slide--large"
      : "project-media-slide";

    if (current.kind === "image") {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={current.src} alt={current.alt} className={className} />
      );
    }

    return (
      <video
        ref={opts.videoRef}
        key={current.src}
        src={current.src}
        className={className}
        controls={opts.large}
        controlsList="nofullscreen"
        autoPlay
        preload="auto"
        playsInline
        onEnded={goNext}
      />
    );
  };

  const renderControls = (className?: string) =>
    showControls && (
      <div className={className ?? "project-media-carousel-controls"}>
        <button
          type="button"
          className="project-media-carousel-btn"
          onClick={() => go(index - 1)}
          aria-label="Previous slide"
        >
          ←
        </button>
        <div className="project-media-carousel-dots" role="tablist">
          {slides.map((s, i) => (
            <button
              key={`${s.kind}-${s.src}`}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={s.kind === "video" ? "Video" : `Image ${i + 1}`}
              className={`project-media-carousel-dot${i === index ? " is-active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button
          type="button"
          className="project-media-carousel-btn"
          onClick={() => go(index + 1)}
          aria-label="Next slide"
        >
          →
        </button>
      </div>
    );

  return (
    <>
      <div className="project-media-carousel">
        <div
          role="button"
          tabIndex={0}
          className="project-media-carousel-viewport"
          onClick={openLightbox}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openLightbox();
            }
          }}
          aria-label="Open enlarged media view"
        >
          {renderSlide(slide, { videoRef })}
        </div>
        {renderControls()}
      </div>

      {expanded && (
        <div
          className="project-media-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Project media"
          onClick={closeLightbox}
        >
          <div
            className="project-media-lightbox-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="project-media-lightbox-close"
              onClick={closeLightbox}
              aria-label="Close"
            >
              ×
            </button>
            <div className="project-media-lightbox-viewport">
              <div
                key={`${index}-${slide.src}`}
                className="project-media-lightbox-slide"
              >
                {renderSlide(slide, { large: true, videoRef: lightboxVideoRef })}
              </div>
            </div>
            {renderControls("project-media-carousel-controls project-media-carousel-controls--lightbox")}
          </div>
        </div>
      )}
    </>
  );
}
