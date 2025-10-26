import { useCallback } from 'react';
import { showConnect, openContractCall } from '@stacks/connect';
import { userSession, NETWORK as network, CONTRACT_ADDRESS, CONTRACT_NAME } from '../lib/stacks';
import {
  uintCV,
  stringUtf8CV,
  standardPrincipalCV,
  PostConditionMode,
  ContractCallOptions,
} from '@stacks/transactions';

// reuse shared userSession/network/constants from lib/stacks

export function useAuth() {
  const authenticate = useCallback(() => {
    showConnect({
      appDetails: {
        name: 'Transparent Philanthropy Chain',
        icon: '/logo.svg',
      },
      redirectTo: '/',
      onFinish: () => {
        window.location.reload();
      },
    });
  }, []);

  const disconnect = useCallback(() => {
    userSession.signUserOut('/');
  }, []);

  const isAuthenticated = userSession.isUserSignedIn();
  const address = isAuthenticated
    ? userSession.loadUserData().profile?.stxAddress?.testnet ?? null
    : null;

  return {
    isAuthenticated,
    authenticate,
    disconnect,
    address,
  };
}

export function useContractCalls() {
  const createCampaign = useCallback(
    async (title: string, description: string, goalAmount: number, deadline: Date, verifier: string) => {
      const functionArgs = [
        stringUtf8CV(title),
        stringUtf8CV(description),
        uintCV(goalAmount),
        uintCV(Math.floor(deadline.getTime() / 1000)),
        standardPrincipalCV(verifier),
      ];

      await openContractCall({
        network,
        anchorMode: 1,
        contractAddress: CONTRACT_ADDRESS,
        contractName: CONTRACT_NAME,
        functionName: 'create-campaign',
        functionArgs,
        postConditionMode: PostConditionMode.Deny,
        onFinish: (data) => {
          console.log('Transaction:', data);
        },
        onCancel: () => {
          console.log('Transaction canceled');
        },
      });
    },
    []
  );

  const donate = useCallback(async (campaignId: number, amount: number) => {
    await openContractCall({
      network,
      anchorMode: 1,
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'donate',
      functionArgs: [uintCV(campaignId)],
      postConditionMode: PostConditionMode.Allow,
      onFinish: (data) => {
        console.log('Transaction:', data);
      },
      onCancel: () => {
        console.log('Transaction canceled');
      },
    });
  }, []);

  return {
    createCampaign,
    donate,
  };
}