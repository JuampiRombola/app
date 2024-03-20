import React, { useMemo } from 'react';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useTranslation } from 'react-i18next';
import { formatUnits, parseUnits } from 'viem';
import WAD from '@exactly/lib/esm/fixed-point-math/WAD';

import formatNumber from 'utils/formatNumber';
import getBeforeBorrowLimit from 'utils/getBeforeBorrowLimit';
import ModalInfo, { FromTo, Variant } from 'components/common/modal/ModalInfo';
import type { Operation } from 'types/Operation';
import useAccountData from 'hooks/useAccountData';

type Props = {
  qty: string;
  symbol: string;
  operation: Operation;
  variant?: Variant;
};

function ModalInfoBorrowLimit({ qty, symbol, operation, variant = 'column' }: Props) {
  const { t } = useTranslation();
  const { marketAccount } = useAccountData(symbol);

  const newQty = useMemo(() => {
    if (!marketAccount || !symbol) return;

    if (!qty) return 0n;

    return parseUnits(qty, marketAccount.decimals);
  }, [marketAccount, symbol, qty]);

  const [beforeBorrowLimit, afterBorrowLimit] = useMemo(() => {
    if (!marketAccount) return [undefined, undefined];

    const { usdPrice, decimals, adjustFactor, isCollateral } = marketAccount;

    const beforeBorrowLimitUSD = getBeforeBorrowLimit(marketAccount, operation);
    const newBeforeBorrowLimit = Number(formatUnits(beforeBorrowLimitUSD, 18)).toFixed(2);
    if (!newQty) return [newBeforeBorrowLimit, undefined];

    const newQtyUsd = (newQty * usdPrice) / 10n ** BigInt(decimals);

    let newAfterBorrowLimit = newBeforeBorrowLimit;

    switch (operation) {
      case 'deposit':
        if (isCollateral) {
          const adjustedDepositBorrowLimit = (newQtyUsd * adjustFactor) / WAD;

          newAfterBorrowLimit = Number(formatUnits(beforeBorrowLimitUSD + adjustedDepositBorrowLimit, 18)).toFixed(2);
        } else {
          newAfterBorrowLimit = Number(formatUnits(beforeBorrowLimitUSD, 18)).toFixed(2);
        }
        break;

      case 'withdrawAtMaturity':
      case 'depositAtMaturity':
        newAfterBorrowLimit = Number(formatUnits(beforeBorrowLimitUSD, 18)).toFixed(2);
        break;

      case 'withdraw':
        newAfterBorrowLimit = Number(formatUnits(beforeBorrowLimitUSD - newQtyUsd, 18)).toFixed(2);
        break;

      case 'borrow':
      case 'borrowAtMaturity':
        newAfterBorrowLimit = Number(formatUnits(beforeBorrowLimitUSD - newQtyUsd, 18)).toFixed(2);
        break;

      case 'repay':
      case 'repayAtMaturity':
        if (isCollateral) {
          const adjustedRepayBorrowLimit = (newQtyUsd * adjustFactor) / WAD;

          newAfterBorrowLimit = Number(formatUnits(beforeBorrowLimitUSD + adjustedRepayBorrowLimit, 18)).toFixed(2);
        } else {
          newAfterBorrowLimit = Number(formatUnits(beforeBorrowLimitUSD, 18)).toFixed(2);
        }
        break;
    }

    return [newBeforeBorrowLimit, newAfterBorrowLimit];
  }, [marketAccount, newQty, operation]);

  return (
    <ModalInfo label={t('Borrow Limit')} icon={SwapHorizIcon} variant={variant}>
      <FromTo
        from={beforeBorrowLimit ? `$${formatNumber(beforeBorrowLimit, 'USD')}` : undefined}
        to={afterBorrowLimit ? `$${formatNumber(afterBorrowLimit, 'USD')}` : undefined}
        variant={variant}
      />
    </ModalInfo>
  );
}

export default React.memo(ModalInfoBorrowLimit);
