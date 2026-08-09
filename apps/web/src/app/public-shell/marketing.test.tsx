// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ContentGrid, ContentPanel, EmptyState, PageHero } from "./marketing";

afterEach(cleanup);

describe("public marketing structures", () => {
  it("uses an explicit hero visual without changing the page content", () => {
    const { container } = render(
      <PageHero
        description="How published results are retained."
        eyebrow="Performance"
        marker="P01"
        title="Verified performance"
        visual="archive"
      />,
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Verified performance",
    );
    expect(container.querySelector("section")).toHaveAttribute(
      "data-visual",
      "archive",
    );
  });

  it("renders reusable content and empty-state structures semantically", () => {
    render(
      <>
        <ContentGrid>
          <ContentPanel title="Source checks">
            <p>Inputs must pass validation.</p>
          </ContentPanel>
        </ContentGrid>
        <EmptyState title="No records have been published." />
      </>,
    );

    expect(screen.getByRole("article")).toHaveTextContent("Source checks");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "No records have been published.",
    );
  });
});
