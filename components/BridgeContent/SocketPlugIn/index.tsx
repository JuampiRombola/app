import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import dynamic from 'next/dynamic';
import { useNetwork } from 'wagmi';
import { useTranslation } from 'react-i18next';
import { Box, useMediaQuery, useTheme } from '@mui/material';

import { Network } from '@socket.tech/plugin';
import useEthersProvider from 'hooks/useEthersProvider';
import { optimism } from 'viem/chains';

import { hexToRgb } from './utils';
import useAssetAddresses from 'hooks/useAssetAddresses';
import { Asset, NATIVE_TOKEN_ADDRESS, TokensResponse } from 'types/Bridge';

const DynamicBridge = dynamic(() => import('@socket.tech/plugin').then((mod) => mod.Bridge), {
  ssr: false,
});

type Props = {
  updateRoutes: () => void;
};

const SocketPlugIn = ({ updateRoutes }: Props) => {
  const { chain } = useNetwork();
  const { palette, breakpoints } = useTheme();
  const { t } = useTranslation();
  const provider = useEthersProvider();
  const [destinationNetwork, setDestinationNetwork] = useState<Network | undefined>();
  const [sourceNetwork, setSourceNetwork] = useState<Network | undefined>();
  const isMobile = useMediaQuery(breakpoints.down('sm'));
  const assets = useAssetAddresses();

  const [tokens, setTokens] = useState<Asset[]>();

  const fetchAssets = useCallback(async () => {
    const { result } = (await fetch('https://api.socket.tech/v2/token-lists/all', {
      headers: {
        'API-KEY': process.env.NEXT_PUBLIC_SOCKET_API_KEY || '',
      },
    }).then((res) => res.json())) as TokensResponse;

    setTokens(Object.values(result).flat());
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const tokenList = useMemo(() => {
    const markets = [...assets, NATIVE_TOKEN_ADDRESS];
    if (!tokens) return [];

    return tokens
      .filter(({ chainId, address }) => {
        const isBridgeToOPMainnet =
          destinationNetwork?.chainId === optimism.id && sourceNetwork?.chainId !== optimism.id;
        const isSourceToken = chainId === sourceNetwork?.chainId;

        return isBridgeToOPMainnet
          ? isSourceToken || markets.includes(address)
          : isSourceToken || chainId === destinationNetwork?.chainId;
      })
      .sort((t1, t2) => (markets.includes(t1.symbol) && !markets.includes(t2.symbol) ? -1 : 1));
  }, [assets, destinationNetwork?.chainId, sourceNetwork?.chainId, tokens]);

  const handleSourceNetworkChange = useCallback(setSourceNetwork, [setSourceNetwork]);

  const handleDestinationNetworkChange = useCallback(setDestinationNetwork, [setDestinationNetwork]);

  const handleSubmit = useCallback(() => {
    updateRoutes();
  }, [updateRoutes]);

  const handleSuccess = useCallback(() => {
    updateRoutes();
  }, [updateRoutes]);

  return (
    <Box
      borderRadius={1}
      display="flex"
      justifyContent="center"
      boxShadow="0px 3px 4px 0px #61666B1A"
      position={{ sm: 'relative', md: 'sticky' }}
      top={{ sm: undefined, md: 4 }}
      p={1.5}
      bgcolor="components.bg"
      sx={{
        '& ::-webkit-scrollbar': {
          '-webkit-appearance': 'none',
          width: 1,
        },
        '& ::-webkit-scrollbar-thumb': {
          'border-radius': 0.5,
          'background-color': 'rgba(0,0,0,.5)',
          '-webkit-box-shadow': '0 0 1px rgba(255,255,255,.5)',
        },
        '& .skt-w-max-h-\\[150px\\]': {
          maxHeight: '165px !important',
          boxShadow: '0px 3px 4px rgba(97, 102, 107, 0.1)',
        },
        '& .skt-w-bg-black': {
          backgroundColor: 'transparent !important',
        },
      }}
      alignSelf="start"
      minWidth={isMobile ? 348 : 448}
      minHeight={448}
    >
      <DynamicBridge
        provider={provider}
        enableSameChainSwaps
        API_KEY={process.env.NEXT_PUBLIC_SOCKET_API_KEY || ''}
        defaultSourceNetwork={chain?.id || optimism.id}
        defaultDestNetwork={optimism.id}
        defaultDestToken={NATIVE_TOKEN_ADDRESS}
        customize={{
          primary: hexToRgb(palette.components.bg),
          secondary: hexToRgb(palette.components.bg),
          text: hexToRgb(palette.text.primary),
          secondaryText: hexToRgb(palette.text.primary),
          interactive: hexToRgb(palette.grey[200]),
          outline: hexToRgb(palette.text.primary),
          accent: palette.mode === 'dark' ? hexToRgb(palette.text.primary) : hexToRgb(palette.grey[900]),
          onInteractive: hexToRgb(palette.text.primary),
          onAccent: hexToRgb(palette.components.bg),
          width: isMobile ? 348 : 448,
          borderRadius: 0.5,
        }}
        title={t('Select network and assets')}
        onSubmit={handleSubmit}
        onBridgeSuccess={handleSuccess}
        onSourceNetworkChange={handleSourceNetworkChange}
        onDestinationNetworkChange={handleDestinationNetworkChange}
        tokenList={tokenList}
        singleTxOnly
      />
    </Box>
  );
};

export default memo(SocketPlugIn);
