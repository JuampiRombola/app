import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { createConfig, configureChains, ChainProviderFn, Chain, createStorage, Address } from 'wagmi';
import * as wagmiChains from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { SafeConnector } from 'wagmi/connectors/safe';
import { optimism } from 'wagmi/chains';

import E2EConnector from './connectors';

declare global {
  interface Window {
    e2e: { rpc: string; chainId: number; privateKey: Address };
  }
}

export const walletConnectId = '11ddaa8aaede72cb5d6b0dae2fed7baa';
const e2e = typeof window !== 'undefined' ? window.e2e : null;
export const isE2E: boolean = JSON.parse(process.env.NEXT_PUBLIC_IS_E2E ?? 'false') && e2e;

const networkId = Number(process.env.NEXT_PUBLIC_NETWORK ?? optimism.id);
export const defaultChain = Object.values(wagmiChains).find((c) => c.id === networkId) ?? optimism;

const sortedChains = isE2E
  ? [defaultChain]
  : [defaultChain, ...Object.values(wagmiChains).filter((c) => c.id !== defaultChain.id)];

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

const providers: ChainProviderFn<Chain>[] =
  isE2E && e2e
    ? [jsonRpcProvider({ rpc: () => ({ http: e2e ? e2e.rpc : 'http://127.0.0.1:8545' }) })]
    : [
        ...(alchemyKey ? [alchemyProvider({ apiKey: alchemyKey })] : []),
        publicProvider(),
        w3mProvider({ projectId: walletConnectId }),
      ];

const { chains, publicClient } = configureChains<Chain>(sortedChains, providers);

const noopStorage = {
  getItem: () => '',
  setItem: () => null,
  removeItem: () => null,
};

export const wagmi = createConfig({
  connectors: [
    ...(isE2E && e2e
      ? [new E2EConnector({ chains, ...e2e })]
      : [...w3mConnectors({ projectId: walletConnectId, chains }), new SafeConnector({ chains })]),
  ],
  publicClient,
  ...(isE2E ? { storage: createStorage({ storage: noopStorage }) } : {}),
});

export const web3modal = new EthereumClient(wagmi, chains);
