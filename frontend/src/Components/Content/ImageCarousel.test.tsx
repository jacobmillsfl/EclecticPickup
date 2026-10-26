import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BandPhotoCarousel } from "./ImageCarousel";

test("does not render an empty photo carousel", () => {
  const { container } = render(<BandPhotoCarousel images={[]} />);
  expect(container).toBeEmptyDOMElement();
});

test("keeps a single photo caption and hides unused navigation", () => {
  render(
    <BandPhotoCarousel
      images={[{ id: 1, filename: "/band.jpg", caption: "On stage" }]}
    />
  );
  expect(screen.getByRole("img", { name: "On stage" })).toHaveAttribute(
    "loading",
    "lazy"
  );
  expect(screen.getByText("On stage")).toBeInTheDocument();
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});

test("supports hero photos without visible captions and loads only the first eagerly", () => {
  const { container } = render(
    <BandPhotoCarousel
      images={[
        { id: 1, filename: "/first.jpg", caption: "" },
        { id: 2, filename: "/second.jpg", caption: "A real photo caption" },
      ]}
      showCaptions={false}
      eagerFirst
    />
  );
  expect(
    screen.getByRole("img", { name: "Eclectic Pickup band photo" })
  ).toHaveAttribute("loading", "eager");
  expect(
    screen.getByRole("img", { name: "A real photo caption" })
  ).toHaveAttribute("loading", "lazy");
  expect(container.querySelector(".carousel-caption")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
});

test("changes the active photo with the next control", async () => {
  const firstPhoto = { id: 1, filename: "/first.jpg", caption: "First" };
  const { container, rerender } = render(
    <BandPhotoCarousel images={[firstPhoto]} />
  );
  rerender(
    <BandPhotoCarousel
      images={[
        firstPhoto,
        { id: 2, filename: "/second.jpg", caption: "Second" },
      ]}
    />
  );
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
  await waitFor(() =>
    expect(
      container.querySelector(".carousel-item.active img")
    ).toHaveAttribute("src", "/second.jpg")
  );
});
