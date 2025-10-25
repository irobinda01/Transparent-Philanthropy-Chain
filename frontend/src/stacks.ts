import { StacksTestnet } from "@stacks/network";

export const NETWORK = new StacksTestnet();
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as string;
export const CONTRACT_NAME = import.meta.env.VITE_CONTRACT_NAME as string;