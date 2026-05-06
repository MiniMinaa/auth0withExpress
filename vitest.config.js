import { defineConfig } from "vite";

export default defineConfig({
  test: {
    // Ensure tests run with a DOM-like environment
    environment: "jsdom",
    // Load jest-dom matchers for assertions like toBeInTheDocument
    setupFiles: "./client/setupTests.js",
    // Only include tests from the client source tree
    include: [
      "client/src/**/*.test.{js,jsx,ts,tsx}",
      "client/src/**/*.spec.{js,jsx,ts,tsx}",
    ],
  },
});
