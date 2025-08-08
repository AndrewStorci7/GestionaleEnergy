import { render, screen } from "@testing-library/react";
import Footer from "../src/app/components/footer/footer.js";
import packageJson from "../package.json";

describe("Footer", () => {
  it("renders the logo image", () => {
    render(<Footer />);
    const logo = screen.getByAltText("Oppimittinetworking Logo");
    expect(logo).toBeInTheDocument();
  });

  it("displays 'Powered by' text", () => {
    render(<Footer />);
    const poweredBy = screen.getByText(/powered by/i);
    expect(poweredBy).toBeInTheDocument();
    expect(poweredBy).toHaveTextContent("Powered by");
  });

  it("shows current year", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    const yearText = screen.getByText(new RegExp(`${year} @‌copyright`, "i"));
    expect(yearText).toBeInTheDocument();
  });

  it("shows the current version from package.json", () => {
    render(<Footer />);
    const versionText = screen.getByText(`v${packageJson.version}`);
    expect(versionText).toBeInTheDocument();
  });
});
