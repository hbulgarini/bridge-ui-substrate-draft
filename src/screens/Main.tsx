// Copyright 2021 Parity Technologies (UK) Ltd.
// This file is part of Parity Bridges UI.
//
// Parity Bridges UI is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Parity Bridges UI is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Parity Bridges UI.  If not, see <http://www.gnu.org/licenses/>.

import { Box, Container, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState, useCallback } from 'react';

import { BoxSidebar, BoxUI, ButtonExt, MenuAction, NetworkSides, NetworkStats } from '../components';
import CustomCall from '../components/CustomCall';
import DashboardCard from '../components/DashboardCard';
import ExtensionAccountCheck from '../components/ExtensionAccountCheck';
import Remark from '../components/Remark';
import Sender from '../components/Sender';
import SnackBar from '../components/SnackBar';
import Transactions from '../components/Transactions';
import Transfer from '../components/Transfer';
import { ChainDetails } from '../types/sourceTargetTypes';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

interface MenuActionItemsProps {
  idx: number;
  title: string;
  isEnabled: boolean;
  component: React.ReactElement;
}

const MenuContents = [
  {
    idx: 0,
    title: 'Transfer',
    isEnabled: true,
    component: <Transfer />
  },
  {
    idx: 1,
    title: 'Remark',
    isEnabled: true,
    component: <Remark />
  },
  {
    idx: 2,
    title: 'Custom Call',
    isEnabled: true,
    component: <CustomCall />
  }
];

function Main() {
  const [items, setItems] = useState<MenuActionItemsProps[]>([] as MenuActionItemsProps[]);
  const [index, setIndex] = useState<number>(0);

  const searchItems = (choice: number) => items.find((x) => x.idx === choice);

  useEffect(() => {
    setItems(MenuContents);
  }, []);

  const isConnectedToWallet = useCallback(() => index !== 3, [index]);

  return (
    <>
      <BoxSidebar>
        <div>
          <Typography variant="button">Bridges UI</Typography>
          <NetworkSides />
          <NetworkStats />
        </div>
        <ButtonExt> Help & Feedback </ButtonExt>
      </BoxSidebar>
      <BoxUI>
        <MenuAction items={items} menuIdx={index} changeMenu={setIndex} />
        <Container>
          <Grid container>
            <Grid item md={12}>
              <ExtensionAccountCheck component={<Sender />} />
            </Grid>
            <Box marginY={2} textAlign="center" width="100%">
              <ArrowDownwardIcon fontSize="large" color="primary" />
            </Box>
          </Grid>
          <Grid container>
            <Grid item md={12}>
              {searchItems(index)?.component}
            </Grid>
          </Grid>
          {isConnectedToWallet() && (
            <Grid container>
              <Grid item md={12}>
                <Transactions type={searchItems(index)?.title} />
              </Grid>
            </Grid>
          )}
        </Container>
        <SnackBar />
        <br />
        <br />
        <Grid container alignItems="center">
          <Grid item md={5}>
            <DashboardCard chainDetail={ChainDetails.SOURCE} />
          </Grid>
          <Grid item md={5}>
            <DashboardCard chainDetail={ChainDetails.TARGET} />
          </Grid>
        </Grid>
      </BoxUI>
    </>
  );
}

export default Main;
