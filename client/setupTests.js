// client/setupTests.js
// Provide Vitest's `expect` as a global so @testing-library/jest-dom can register matchers.
import { expect as vitestExpect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

// Register jest-dom matchers with Vitest's expect implementation
vitestExpect.extend(matchers);

// Ensure DOM is cleaned up between tests to avoid leaking elements across tests
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});
