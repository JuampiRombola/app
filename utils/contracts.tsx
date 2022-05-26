import { ethers } from 'ethers';

export function getContractData(
  network: string | undefined,
  address: string,
  abi: ethers.ContractInterface,
  providerData?: ethers.Signer
) {
  if (!address || !abi) return;

  const publicNetwork = network ?? process.env.NEXT_PUBLIC_NETWORK;

  let provider;

  if (providerData) {
    provider = providerData;
  } else {
    provider =
      publicNetwork == 'local'
        ? new ethers.providers.JsonRpcProvider()
        : ethers.getDefaultProvider(publicNetwork);
  }

  return new ethers.Contract(address, abi, provider).connect(provider);
}
