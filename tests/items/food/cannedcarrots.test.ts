import { test } from "@minecraft/server-gametest";

test("cannedcarrots_eating", async (test) => {
  const player = test.spawnSimulatedPlayer({ x: 1, y: 2, z: 1 }, "TestPlayer");
  
  // TODO: Implement test
  // Give food to player
  // Test eating
  // Check hunger/saturation
  
  test.succeed();
})
  .maxTicks(200)
  .tag("food")
  .tag("cannedcarrots");
