import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Button from 'components/common/Button';
import Wallet from 'components/Wallet';

import { LangKeys } from 'types/Lang';

import LangContext from 'contexts/LangContext';

import styles from './style.module.scss';

import keys from './translations.json';
import { useWeb3Context } from 'contexts/Web3Context';

function Navbar() {
  const lang: string = useContext(LangContext);
  const translations: { [key: string]: LangKeys } = keys;
  const { web3Provider, connect, disconnect, address } = useWeb3Context();

  const router = useRouter();
  const { pathname } = router;

  const routes = [
    {
      pathname: '/pools',
      href: '/pools',
      name: translations[lang].pools
    },
    {
      pathname: '/assets/[id]',
      href: '/assets/dai',
      name: translations[lang].assets
    },
    {
      pathname: '/dashboard',
      href: '/dashboard',
      name: translations[lang].dashboard
    },
    { pathname: '/nerd-mode', href: '/', name: translations[lang].nerdMode }
  ];

  return (
    <nav className={styles.navBar}>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <Link href="/">
            <img src="/img/logo.svg" alt="Exactly Logo" className={styles.logo} />
          </Link>
          <ul className={styles.linksContainer}>
            {routes.map((route) => {
              return (
                <li
                  className={
                    route.pathname === pathname ? `${styles.link} ${styles.active}` : styles.link
                  }
                  key={route.pathname}
                >
                  <Link href={route.href}>{route.name}</Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.right}>
          {connect && !address ? (
            <div className={styles.buttonContainer}>
              <Button text="Conectar" onClick={() => connect()} />
            </div>
          ) : (
            disconnect &&
            address && (
              <div className={styles.buttonContainer}>
                <Wallet walletAddress={address} disconnect={() => disconnect()} />
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
