import React, { type PropsWithChildren } from 'react';
import Image from 'next/image';
import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TypographyProps,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import WAD from '@exactly/lib/esm/fixed-point-math/WAD';

import OperationSquare from 'components/common/OperationSquare';
import parseTimestamp from 'utils/parseTimestamp';
import formatNumber from 'utils/formatNumber';
import BestPill from 'components/common/BestPill';
import { Rates as RewardRates } from 'hooks/useRewards';
import { formatEther, formatUnits } from 'viem';
import Rates from 'components/Rates';

export type PositionTableRow = {
  symbol: string;
  maturity?: bigint;
  balance?: bigint;
  fee?: bigint;
  usdPrice: bigint;
  decimals: number;
  apr: bigint;
  rewards?: RewardRates[string];
  isBest?: boolean;
};

type Props = {
  data: PositionTableRow[];
  onClick: (row: PositionTableRow) => void;
  loading?: boolean;
  showBalance?: boolean;
};

function PositionTable({ data, onClick, loading = false, showBalance = false }: Props) {
  const { t } = useTranslation();
  return (
    <TableContainer sx={{ maxHeight: '100%' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <HeaderCell>{t('Asset')}</HeaderCell>
            <HeaderCell>{t('Type')}</HeaderCell>
            <HeaderCell>{t('Maturity Date')}</HeaderCell>
            {showBalance && <HeaderCell>{t('Value')}</HeaderCell>}
            <HeaderCell>{t('APR')}</HeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading
            ? [1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton width={60} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={60} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  {showBalance && (
                    <TableCell>
                      <Skeleton width={60} />
                    </TableCell>
                  )}
                  <TableCell>
                    <Skeleton width={60} />
                  </TableCell>
                </TableRow>
              ))
            : data.map((row) => {
                const balance = row.balance
                  ? formatNumber(formatUnits((row.balance * row.usdPrice) / WAD, row.decimals), 'USD')
                  : '0';
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.symbol + row.maturity + row.balance}
                    sx={{
                      '&:last-child td': { border: 0 },
                      cursor: 'pointer',
                    }}
                    onClick={() => onClick(row)}
                    data-testid={`rollover-sheet-row-${row.symbol}${row.maturity ? `-${row.maturity}` : ''}`}
                  >
                    <TableCell sx={{ maxWidth: 64 }}>
                      <AssetCell symbol={row.symbol} />
                    </TableCell>
                    <TableCell>
                      <TypeCell maturity={row.maturity} />
                    </TableCell>
                    <TableCell>
                      <TextCell>{row.maturity ? parseTimestamp(row.maturity) : t('Open-ended')}</TextCell>
                    </TableCell>
                    {showBalance && (
                      <TableCell>
                        <TextCell>${balance}</TextCell>
                      </TableCell>
                    )}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Rates type="borrow" apr={Number(formatEther(row.apr))} symbol={row.symbol} />
                        {row.isBest && <BestPill />}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function HeaderCell({ children }: PropsWithChildren) {
  const { palette } = useTheme();
  return (
    <TableCell
      sx={{
        borderTop: 1,
        borderTopColor: palette.mode === 'dark' ? '#515151' : 'grey.300',
        backgroundColor: 'components.bg',
      }}
    >
      <Typography variant="subtitle2" color="figma.grey.500" fontWeight={500} fontSize={14}>
        {children}
      </Typography>
    </TableCell>
  );
}

function AssetCell({ symbol }: { symbol: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Image src={`/img/assets/${symbol}.svg`} alt={symbol} width="16" height="16" />
      <Typography fontWeight={400} fontSize={14} ml={0.5} color="grey.900">
        {symbol}
      </Typography>
    </Box>
  );
}

function TypeCell({ maturity }: { maturity?: bigint }) {
  return <OperationSquare type={maturity ? 'fixed' : 'floating'} />;
}

function TextCell({ ...props }: TypographyProps) {
  return <Typography fontWeight={500} fontSize={16} fontFamily="fontFamilyMonospaced" color="grey.900" {...props} />;
}

export default React.memo(PositionTable);
