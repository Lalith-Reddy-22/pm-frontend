import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DataPagination from "@/components/DataPagination";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns a minimal, valid prop set for the component. Override any field. */
function makeProps(overrides = {}) {
  return {
    page: 1,
    totalPages: 5,
    totalItems: 50,
    startIndex: 1,
    endIndex: 10,
    hasPrev: false,
    hasNext: true,
    prevPage: jest.fn(),
    nextPage: jest.fn(),
    goToPage: jest.fn(),
    pageNumbers: [1, 2, 3, 4, 5],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("DataPagination", () => {
  // ── Rendering ────────────────────────────────────────────────────────────

  it("renders nothing when totalItems is 0", () => {
    const { container } = render(<DataPagination {...makeProps({ totalItems: 0 })} />);
    expect(container.firstChild).toBeNull();
  });

  it("shows the correct entry range and total", () => {
    render(<DataPagination {...makeProps({ startIndex: 11, endIndex: 20, totalItems: 50 })} />);
    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  // ── Navigation buttons ────────────────────────────────────────────────────

  it("disables Prev and First buttons on the first page", () => {
    render(<DataPagination {...makeProps({ hasPrev: false })} />);
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
    expect(screen.getByLabelText("First page")).toBeDisabled();
  });

  it("disables Next and Last buttons on the last page", () => {
    render(
      <DataPagination
        {...makeProps({ page: 5, totalPages: 5, hasPrev: true, hasNext: false })}
      />
    );
    expect(screen.getByLabelText("Next page")).toBeDisabled();
    expect(screen.getByLabelText("Last page")).toBeDisabled();
  });

  it("enables all nav buttons when on a middle page", () => {
    render(
      <DataPagination
        {...makeProps({ page: 3, totalPages: 5, hasPrev: true, hasNext: true })}
      />
    );
    expect(screen.getByLabelText("Previous page")).not.toBeDisabled();
    expect(screen.getByLabelText("Next page")).not.toBeDisabled();
  });

  // ── Callbacks ─────────────────────────────────────────────────────────────

  it("calls prevPage when the Previous button is clicked", () => {
    const prevPage = jest.fn();
    render(<DataPagination {...makeProps({ page: 3, hasPrev: true, prevPage })} />);
    fireEvent.click(screen.getByLabelText("Previous page"));
    expect(prevPage).toHaveBeenCalledTimes(1);
  });

  it("calls nextPage when the Next button is clicked", () => {
    const nextPage = jest.fn();
    render(<DataPagination {...makeProps({ hasNext: true, nextPage })} />);
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(nextPage).toHaveBeenCalledTimes(1);
  });

  it("calls goToPage(1) when the First button is clicked", () => {
    const goToPage = jest.fn();
    render(<DataPagination {...makeProps({ page: 3, hasPrev: true, goToPage })} />);
    fireEvent.click(screen.getByLabelText("First page"));
    expect(goToPage).toHaveBeenCalledWith(1);
  });

  it("calls goToPage(totalPages) when the Last button is clicked", () => {
    const goToPage = jest.fn();
    render(
      <DataPagination {...makeProps({ page: 3, totalPages: 5, hasNext: true, goToPage })} />
    );
    fireEvent.click(screen.getByLabelText("Last page"));
    expect(goToPage).toHaveBeenCalledWith(5);
  });

  it("calls goToPage with the correct page number when a page button is clicked", () => {
    const goToPage = jest.fn();
    render(<DataPagination {...makeProps({ page: 1, totalPages: 3, hasNext: true, goToPage })} />);
    fireEvent.click(screen.getByLabelText("Page 2"));
    expect(goToPage).toHaveBeenCalledWith(2);
  });

  // ── Active page indicator ─────────────────────────────────────────────────

  it("marks the current page button with aria-current='page'", () => {
    render(<DataPagination {...makeProps({ page: 2, totalPages: 3 })} />);
    expect(screen.getByLabelText("Page 2")).toHaveAttribute("aria-current", "page");
  });

  it("does not mark other page buttons with aria-current", () => {
    render(<DataPagination {...makeProps({ page: 2, totalPages: 3 })} />);
    expect(screen.getByLabelText("Page 1")).not.toHaveAttribute("aria-current");
    expect(screen.getByLabelText("Page 3")).not.toHaveAttribute("aria-current");
  });

  // ── Mobile label ──────────────────────────────────────────────────────────

  it("shows 'page / totalPages' for mobile view", () => {
    render(<DataPagination {...makeProps({ page: 2, totalPages: 7 })} />);
    // The mobile span renders "2 / 7"
    expect(screen.getByText("2 / 7")).toBeInTheDocument();
  });
});
