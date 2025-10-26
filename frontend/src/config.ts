import { StacksMainnet, StacksTestnet } from "@stacks/network";

export const NETWORK = new StacksTestnet();
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
export const CONTRACT_NAME = import.meta.env.VITE_CONTRACT_NAME || 'tpc';