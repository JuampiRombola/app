import { useCustomTheme } from 'contexts/ThemeContext';
import { useExtraFinanceLendingGetReserveStatus } from 'types/abi';
import { WAD } from 'utils/queryRates';
import { toPercentage } from 'utils/utils';
import { optimism } from 'wagmi/chains';

const EXA_RESERVE_ID = 50n;
const COMPOUNDING_INTERVAL = 60n * 60n * 24n;
const LENDING_CONTRACT_ADDRESS = '0xBB505c54D71E9e599cB8435b4F0cEEc05fC71cbD';

const useExtraDepositAPR = () => {
  const { data: reserves } = useExtraFinanceLendingGetReserveStatus({
    args: [[EXA_RESERVE_ID]],
    address: LENDING_CONTRACT_ADDRESS,
    chainId: optimism.id,
  });
  if (!reserves) return undefined;
  const [{ borrowingRate, totalBorrows, totalLiquidity }] = reserves;
  const utilizationRate = (totalBorrows * WAD) / totalLiquidity;
  return (borrowingRate * utilizationRate) / WAD;
};

export const useExtra = () => {
  const { aprToAPY } = useCustomTheme();
  const apr = useExtraDepositAPR();
  if (!apr) return { apr: undefined, apy: undefined };
  return { apr: toPercentage(Number(aprToAPY(apr, COMPOUNDING_INTERVAL)) / 1e18) };
};
