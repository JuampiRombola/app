import styles from './style.module.scss';

import { formatWallet } from 'utils/utils';

import { Network } from 'types/Network';

type Props = {
  walletAddress: String;
  cogwheel?: Boolean;
  network?: Network;
};

function Wallet({ walletAddress, cogwheel = true, network }: Props) {
  const formatedWallet = formatWallet(walletAddress);

  return (
    <div className={styles.container}>
      <p className={styles.wallet}>{formatedWallet}</p>
      {cogwheel && <img src="/img/icons/cogwheel.svg" alt="settings" />}
      {network && (
        <div className={styles.networkContainer}>
          <div className={styles.dot} />
          <p className={styles.network}> {network}</p>
        </div>
      )}
    </div>
  );
}

export default Wallet;
