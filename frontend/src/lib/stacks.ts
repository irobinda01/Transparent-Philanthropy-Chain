import { showConnect } from "@stacks/connect";
import { StacksTestnet } from "@stacks/network";
import {
  AnchorMode,
  PostConditionMode,
  standardPrincipalCV,
  stringUtf8CV,
  uintCV,
  callReadOnlyFunction,
  ClarityValue,
  cvToValue,
} from "@stacks/transactions";
import { UserSession } from "@stacks/auth";

export const userSession = new UserSession();

interface ReadOnlyFunctionSuccessResponse {
  okay: true;
  result: any;
}

// For testnet during development
export const NETWORK = new StacksTestnet();

export const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS || "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
export const CONTRACT_NAME = import.meta.env.VITE_CONTRACT_NAME || "tpc";

interface ContractCallOptions {
  functionName: string;
  functionArgs?: any[];
  postConditionMode?: PostConditionMode;
  anchorMode?: AnchorMode;
  onFinish?: () => void;
  onCancel?: () => void;
}

// Helper function for contract function calls
export async function callContractFunction({
  functionName,
  functionArgs = [],
  postConditionMode = PostConditionMode.Deny,
  anchorMode = AnchorMode.Any,
  onFinish = () => {},
  onCancel = () => {},
}: ContractCallOptions) {
  await showConnect({
    userSession,
    appDetails: {
      name: "Transparent Philanthropy Chain",
      icon: "/logo.svg",
    },
    onFinish,
    onCancel,
  });
}

interface ReadOnlyCallOptions {
  functionName: string;
  functionArgs?: any[];
  senderAddress?: string;
}

// Helper function for read-only function calls
export async function readOnlyCall({
  functionName,
  functionArgs = [],
  senderAddress = CONTRACT_ADDRESS,
}: ReadOnlyCallOptions) {
  const clarityValue = await callReadOnlyFunction({
    network: NETWORK,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName,
    functionArgs,
    senderAddress,
  });

  return cvToValue(clarityValue);
}