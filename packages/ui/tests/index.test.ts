import { describe, expect, it } from "vitest";

import { packageId } from "../src/index";

describe("@playtoday/ui package identity", () => {
  it("exports its stable workspace identifier", () => {
    expect(packageId).toBe("@playtoday/ui");
  });
});
