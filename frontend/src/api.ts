import { openContractCall } from "@stacks/connect";
import {
  uintCV, principalCV, stringUtf8CV, standardPrincipalCV
} from "@stacks/transactions";
import { NETWORK, CONTRACT_ADDRESS, CONTRACT_NAME } from "./stacks";

export async function callRegisterCharity(name: string, info: string) {
  return openContractCall({
    network: NETWORK,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "register-charity",
    functionArgs: [stringUtf8CV(name), stringUtf8CV(info)],
    onFinish: () => {},
  });
}

export async function callCreateCampaign(goalUstx: bigint, deadlineBBH: bigint, description: string, verifier: string) {
  return openContractCall({
    network: NETWORK,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "create-campaign",
    functionArgs: [
      uintCV(goalUstx),
      uintCV(deadlineBBH),
      stringUtf8CV(description),
      standardPrincipalCV(verifier),
    ],
    onFinish: () => {},
  });
}

export async function callDonate(id: bigint, ustx: bigint) {
  return openContractCall({
    network: NETWORK,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "donate",
    functionArgs: [uintCV(id)],
    attachment: undefined,
    sponsored: false,
    postConditions: [],
    onFinish: () => {},
    // use 'amount' in microstacks via 'sendMany' style is not available; attach via 'userOptions'
    // Workaround: openContractCall supports 'fee' but not amount; In practice donation via 'donate' should be
    // implemented by a payable method called with amount; some wallet SDKs infer from 'postConditions'.
    // For hackathon demo, you can switch to Explorer UI for donation calls if wallet doesn't pass amount.
  } as any);
}

export async function callSubmitProof(id: bigint, hash: string) {
  return openContractCall({
    network: NETWORK,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "submit-proof",
    functionArgs: [uintCV(id), stringUtf8CV(hash)],
    onFinish: () => {},
  });
}

export async function callRelease(id: bigint) {
  return openContractCall({
    network: NETWORK,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "verify-and-release",
    functionArgs: [uintCV(id)],
    onFinish: () => {},
  });
}

export async function callRefund(id: bigint) {
  return openContractCall({
    network: NETWORK,
    contractAddress: CONTRACT_ADDRESS,
    contractName: CONTRACT_NAME,
    functionName: "refund",
    functionArgs: [uintCV(id)],
    onFinish: () => {},
  });
}