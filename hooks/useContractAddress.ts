import { useCallback } from 'react';
import { useWeb3 } from './useWeb3';
import { Address } from 'viem';
import { mainnet, optimismSepolia } from 'viem/chains';

function useGetContractAddress() {
  const { chain: displayNetwork } = useWeb3();
  const getContractAddress = useCallback(
    async (contractName: string): Promise<Address> => {
      const { address } = await import(
        `@exactly/protocol/deployments/${
          {
            [mainnet.id]: 'ethereum',
            [optimismSepolia.id]: 'op-sepolia',
          }[displayNetwork.id] ?? displayNetwork.network
        }/${contractName}.json`,
        { assert: { type: 'json' } }
      );
      return address;
    },
    [displayNetwork.id, displayNetwork.network],
  );

  return getContractAddress;
}

export default useGetContractAddress;
