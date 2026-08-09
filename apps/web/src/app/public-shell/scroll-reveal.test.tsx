// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ScrollReveal } from "./scroll-reveal";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("ScrollReveal", () => {
  it("reveals an intersecting section once", () => {
    class ObserverMock {
      readonly root = null;
      readonly rootMargin = "0px 0px -8%";
      readonly thresholds = [0.12];

      constructor(private readonly callback: IntersectionObserverCallback) {}

      disconnect = vi.fn();
      takeRecords = () => [];
      unobserve = vi.fn();

      observe = (target: Element) => {
        this.callback(
          [{ isIntersecting: true, target } as IntersectionObserverEntry],
          this as unknown as IntersectionObserver,
        );
      };
    }

    vi.stubGlobal("IntersectionObserver", ObserverMock);
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: false })),
    );

    render(
      <ScrollReveal>
        <section data-reveal="up">Evidence</section>
      </ScrollReveal>,
    );

    expect(screen.getByText("Evidence")).toHaveAttribute("data-reveal-visible", "true");
  });

  it("shows content immediately when reduced motion is requested", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: true })),
    );

    render(
      <ScrollReveal>
        <section data-reveal="up">Workflow</section>
      </ScrollReveal>,
    );

    expect(screen.getByText("Workflow")).toHaveAttribute("data-reveal-visible", "true");
  });
});
