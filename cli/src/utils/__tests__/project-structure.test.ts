import fs from "fs-extra";
import { detectProjectStructure } from "../project-structure";

jest.mock("fs-extra");

const mockedFs = fs as jest.Mocked<typeof fs>;

describe("detectProjectStructure", () => {
  beforeEach(() => {
    mockedFs.pathExists.mockReset();
  });

  it("detects common Next.js layouts", async () => {
    mockedFs.pathExists.mockImplementation((requestedPath: string) => {
      if (requestedPath.includes("/app")) return Promise.resolve(true);
      if (requestedPath.includes("/app/components")) return Promise.resolve(true);
      if (requestedPath.includes("/src")) return Promise.resolve(true);
      if (requestedPath.includes("/src/components")) return Promise.resolve(false);
      if (requestedPath.includes("/pages")) return Promise.resolve(true);
      if (requestedPath.endsWith("/components")) return Promise.resolve(true);
      return Promise.resolve(false);
    });

    const choices = await detectProjectStructure("/project");
    const values = choices.map((choice) => choice.value);

    expect(values).toContain("app/vizzy");
    expect(values).toContain("app/components/vizzy");
    expect(values).toContain("components/vizzy");
    expect(values).toContain("src/vizzy");
    expect(values).toContain("custom");
  });

  it("falls back to custom when no folders exist", async () => {
    mockedFs.pathExists.mockResolvedValue(false);
    const choices = await detectProjectStructure("/empty");
    expect(choices).toHaveLength(1);
    expect(choices[0].value).toBe("custom");
  });
});


