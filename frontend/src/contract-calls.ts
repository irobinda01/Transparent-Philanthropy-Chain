import { 
  cvToValue, 
  ClarityValue, 
  standardPrincipalCV,
  uintCV
} from "@stacks/transactions";
import { CONTRACT_ADDRESS, CONTRACT_NAME, NETWORK, readOnlyCall } from "./lib/stacks";

export async function getCampaigns() {
  const response = await readOnlyCall({
    functionName: "get-all-campaigns",
    functionArgs: [],
    senderAddress: CONTRACT_ADDRESS,
  });

  const campaigns = cvToValue(response).value.map((campaign: any) => ({
    id: campaign.value.id.value,
    title: campaign.value.title.value,
    description: campaign.value.description.value,
    goalAmount: Number(campaign.value['goal-amount'].value),
    raisedAmount: Number(campaign.value['raised-amount'].value),
    deadline: new Date(Number(campaign.value.deadline.value) * 1000).toISOString(),
    verifier: campaign.value.verifier.value,
    status: campaign.value.status.value,
    proofHash: campaign.value['proof-hash'].value,
  }));

  return campaigns;
}

export async function getCampaignById(id: string) {
  const response = await readOnlyCall({
    functionName: "get-campaign-by-id",
    functionArgs: [uintCV(parseInt(id))],
    senderAddress: CONTRACT_ADDRESS,
  });

  const campaign = cvToValue(response).value;
  return {
    id: campaign.id.value,
    title: campaign.title.value,
    description: campaign.description.value,
    goalAmount: Number(campaign['goal-amount'].value),
    raisedAmount: Number(campaign['raised-amount'].value),
    deadline: new Date(Number(campaign.deadline.value) * 1000).toISOString(),
    verifier: campaign.verifier.value,
    status: campaign.status.value,
    proofHash: campaign['proof-hash'].value,
  };
}

export async function getDonationsByUser(address: string) {
  const response = await readOnlyCall({
    functionName: "get-user-donations",
    functionArgs: [standardPrincipalCV(address)],
    senderAddress: CONTRACT_ADDRESS,
  });

  const donations = cvToValue(response).value.map((donation: any) => ({
    campaignId: donation.value['campaign-id'].value,
    amount: Number(donation.value.amount.value),
    timestamp: new Date(Number(donation.value.timestamp.value) * 1000).toISOString(),
  }));

  return donations;
}