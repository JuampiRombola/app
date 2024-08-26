import React from 'react';
import type { NextPage } from 'next';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import { t } from 'i18next';
import { StakeEXAProvider } from 'contexts/StakeEXAContext';
import { useModal } from 'contexts/ModalContext';
import StakedEXASummary from 'components/staking/StakedEXASummary';
import StakingOperations from 'components/staking/StakingOperations';
import StakeChart from 'components/charts/StakeChart';
import Progress from 'components/staking/Progress';

const Staking: NextPage = () => {
  const { open: openGetEXA } = useModal('get-exa');

  return (
    <StakeEXAProvider>
      <Box display="flex" flexDirection="column" gap={3} maxWidth={800} mx="auto" my={5}>
        <Box display="flex" flexDirection="column" gap={3}>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" gap={1}>
              <Image
                src={`/img/assets/EXA.svg`}
                alt={'EXA'}
                width={32}
                height={32}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
              <Typography fontSize={24} fontWeight={700}>
                {t('EXA Staking')}
              </Typography>
            </Box>
            <Button
              variant="contained"
              sx={{ paddingX: '40px' }}
              onClick={() => {
                openGetEXA();
              }}
            >
              {t('Get EXA')}
            </Button>
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography>
              {t(
                'The staking period is twelve months. You can add more EXA, claim fees, or unstake anytime. Keep your EXA staked for the entire period to receive the full fees. Early or late withdrawal will reduce your eligible rewards.',
              )}
            </Typography>
            <Typography>
              {t('For further details, ')}
              <Typography sx={{ textDecoration: 'underline' }} component="span">
                <a target="_blank" rel="noreferrer noopener" href="https://docs.exact.ly/">
                  {t('please check our documentation.')}
                </a>
              </Typography>
            </Typography>
          </Box>
        </Box>
        <StakedEXASummary />
        <StakingOperations />
        <Progress />
        <StakeChart />
      </Box>
    </StakeEXAProvider>
  );
};

export default Staking;
