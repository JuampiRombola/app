import React, { ReactNode, useCallback, useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Typography } from '@mui/material';
import { track } from 'utils/mixpanel';

type Tab = {
  label: string;
  value: string;
  content: ReactNode;
};

type Props = {
  initialTab: string;
  allTabs: Tab[];
};

function DashboardTabs({ initialTab, allTabs }: Props) {
  const [currentTab, setCurrentTab] = useState<Tab['value']>(initialTab);

  const handleChange = useCallback(
    (_: React.SyntheticEvent, newTab: string) => {
      setCurrentTab(newTab);
      track('Option Selected', {
        location: 'Dashboard',
        name: 'operation',
        value: newTab,
        prevValue: currentTab,
      });
    },
    [currentTab],
  );

  return (
    <TabContext value={currentTab}>
      <Box>
        <TabList
          onChange={handleChange}
          TabIndicatorProps={{ sx: { height: 0 } }}
          textColor="inherit"
          sx={{
            '& button:hover': {
              backgroundColor: ({ palette }) => (palette.mode === 'light' ? '#5c5a5a' : '#fafafa'),
              color: ({ palette }) => (palette.mode === 'light' ? 'white' : 'black'),
            },
            '& button.Mui-selected, & button:focus': {
              backgroundColor: ({ palette }) => (palette.mode === 'light' ? '#0E0E0E' : '#fafafa'),
              color: ({ palette }) => (palette.mode === 'light' ? 'white' : 'black'),
            },
          }}
        >
          {allTabs.map(({ label, value }) => (
            <Tab
              data-testid={`tab-${value}`}
              key={`tab_${value}`}
              value={value}
              sx={{ paddingX: 2.5, textTransform: 'none' }}
              label={
                <Typography fontWeight={700} fontSize="14px">
                  {label}
                </Typography>
              }
            />
          ))}
        </TabList>
        <Box sx={{ borderBottom: 4, borderColor: 'divider', marginTop: '-4px' }} width="100%" />
      </Box>
      {allTabs.map(({ content, value }) => (
        <TabPanel value={value} sx={{ width: '100%', padding: 0 }} key={value}>
          {content}
        </TabPanel>
      ))}
    </TabContext>
  );
}

export default DashboardTabs;
