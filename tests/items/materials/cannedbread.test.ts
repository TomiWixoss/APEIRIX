import { test } from "@minecraft/server-gametest";

test("cannedbread_basic", async (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
  
  // TODO: Implement test
  // Give item to player
  // Check inventory
  
  test.succeed();
})
  .maxTicks(100)
  .tag("item")
  .tag("cannedbread");
