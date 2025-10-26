import { StacksMocknet } from "@stacks/network";

// Use StacksMocknet for local development and testing
export const NETWORK = new StacksMocknet({
  url: 'http://localhost:3999',
});

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS ?? "";
export const CONTRACT_NAME = import.meta.env.VITE_CONTRACT_NAME ?? "tpc";