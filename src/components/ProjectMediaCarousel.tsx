"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface Props {
  basePath: string;
  title: string;
  images?: string[];
  video?: string;
  videos?: string[];
  /** Media vertical (telemóvel): zoom e carrossel mais altos. */
  mediaZoom?: "mobile";
}

type Slide =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string };

/**
 * Carrossel: vídeo primeiro, depois imagens. Clique abre zoom; clique no fundo fecha.
 */
export default function ProjectMediaCarousel({
  basePath,
  title,
  images = [],
  video,
  videos,
  mediaZoom,
}: Props) {
  const isMobileMedia = mediaZoom === "mobile";
  const slideClass = isMobileMedia
    ? "project-media-slide project-media-slide--mobile"
    : "project-media-slide";
  const zoomMediaClass = isMobileMedia
    ? "project-media-zoom-media project-media-zoom-media--mobile"
    : "project-media-zoom-media";
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
  const [portalReady, setPortalReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lightboxVideoRef = useRef<HTMLVideoElement>(null);
  const resumeTimeRef = useRef(0);

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

  const openZoom = useCallback(() => {
    if (slides[index]?.kind === "video" && videoRef.current) {
      resumeTimeRef.current = videoRef.current.currentTime;
    }
    setExpanded(true);
  }, [index, slides]);

  const closeZoom = useCallback(() => {
    setExpanded(false);
  }, []);

  useEffect(() => {
    setPortalReady(true);
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
    el.currentTime = resumeTimeRef.current;
    void el.play().catch(() => {
      el.muted = true;
      void el.play();
    });
  }, [expanded, index, slides]);

  const goInZoom = useCallback(
    (next: number) => {
      resumeTimeRef.current = 0;
      go(next);
    },
    [go]
  );

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeZoom();
      if (slides.length <= 1) return;
      if (e.key === "ArrowLeft") goInZoom(index - 1);
      if (e.key === "ArrowRight") goInZoom(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeZoom, expanded, goInZoom, index, slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[index];
  const showControls = slides.length > 1;

  const stopMediaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const renderCarouselSlide = (current: Slide) => {
    if (current.kind === "image") {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={current.src}
          alt={current.alt}
          className={slideClass}
        />
      );
    }

    return (
      <video
        ref={videoRef}
        key={current.src}
        src={current.src}
        className={slideClass}
        controlsList="nofullscreen"
        autoPlay
        muted
        preload="auto"
        playsInline
        onEnded={goNext}
      />
    );
  };

  const renderZoomSlide = (current: Slide) => {
    if (current.kind === "image") {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={current.src}
          alt={current.alt}
          className={zoomMediaClass}
          onClick={stopMediaClick}
        />
      );
    }

    return (
      <video
        ref={lightboxVideoRef}
        key={`zoom-${current.src}`}
        src={current.src}
        className={zoomMediaClass}
        controls
        controlsList="nofullscreen"
        preload="auto"
        playsInline
        onClick={stopMediaClick}
      />
    );
  };

  const zoomLayer =
    expanded &&
    portalReady &&
    createPortal(
      <div
        className="project-media-zoom"
        role="dialog"
        aria-modal="true"
        aria-label="Enlarged media"
      >
        {showControls && (
          <>
            <button
              type="button"
              className="project-media-zoom-arrow project-media-zoom-arrow--prev"
              onClick={(e) => {
                e.stopPropagation();
                goInZoom(index - 1);
              }}
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              type="button"
              className="project-media-zoom-arrow project-media-zoom-arrow--next"
              onClick={(e) => {
                e.stopPropagation();
                goInZoom(index + 1);
              }}
              aria-label="Next slide"
            >
              →
            </button>
          </>
        )}
        <div
          className="project-media-zoom-scroll"
          onClick={closeZoom}
          role="presentation"
        >
          <div className="project-media-zoom-content">
            {renderZoomSlide(slide)}
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <div
        className={`project-media-carousel${isMobileMedia ? " project-media-carousel--mobile" : ""}`}
      >
        <div
          role="button"
          tabIndex={0}
          className={`project-media-carousel-viewport project-media-carousel-viewport--zoomable${isMobileMedia ? " project-media-carousel-viewport--mobile" : ""}`}
          onClick={openZoom}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openZoom();
            }
          }}
          aria-label="Enlarge media"
        >
          {renderCarouselSlide(slide)}
        </div>
        {showControls && (
          <div className="project-media-carousel-controls">
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
        )}
      </div>
      {zoomLayer}
    </>
  );
}
