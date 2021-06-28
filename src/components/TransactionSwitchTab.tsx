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

import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import { ButtonSwitchMode } from './Buttons';
import TransactionPayload from './TransactionPayload';
import { DisplayPayload } from '../types/transactionTypes';
import { SwitchSwitchTab } from '../types/transactionTypes';

export interface TransactionDisplayProps {
  size?: 'sm';
}
interface Props {
  transactionDisplayProps?: TransactionDisplayProps;
  children: JSX.Element | JSX.Element[];
  payloadHex: string | null;
  displayPayload: DisplayPayload | null;
}

const TransactionSwitchTab = ({ transactionDisplayProps, children, payloadHex, displayPayload }: Props) => {
  const [tab, setTab] = useState(SwitchSwitchTab.RECEIPT);

  const getColorByState = (value: string) => (value === tab ? 'primary' : 'secondary');

  return (
    <>
      <Box mt={2}>
        <ButtonSwitchMode
          color={getColorByState(SwitchSwitchTab.PAYLOAD)}
          onClick={() => setTab(SwitchSwitchTab.PAYLOAD)}
        >
          Payload
        </ButtonSwitchMode>
        <ButtonSwitchMode
          color={getColorByState(SwitchSwitchTab.RECEIPT)}
          onClick={() => setTab(SwitchSwitchTab.RECEIPT)}
        >
          Receipt
        </ButtonSwitchMode>
        <ButtonSwitchMode
          color={getColorByState(SwitchSwitchTab.DECODED)}
          onClick={() => setTab(SwitchSwitchTab.DECODED)}
        >
          Decoded
        </ButtonSwitchMode>
      </Box>
      {tab === SwitchSwitchTab.RECEIPT && children}
      <TransactionPayload
        tab={tab}
        transactionDisplayProps={transactionDisplayProps}
        payloadHex={payloadHex}
        displayPayload={displayPayload}
      />
    </>
  );
};

export default TransactionSwitchTab;
