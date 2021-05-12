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

/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Balance from './Balance';
import shorterItem from '../util/shortenItem';
import AccountIdenticon from './AccountIdenticon';

interface Props {
  addressKind?: AddressKind | string;
  address?: string;
  friendlyName?: string | null;
  hideAddress?: boolean;
  onClick?: () => void;
  derived?: boolean;
  balance?: string | null | undefined;
}

const useStyles = makeStyles(() => ({
  onlyBalance: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    padding: '0 10px'
  },
  icon: {
    float: 'left'
  },
  container: {
    display: 'flex',
    alignItems: 'center'
  },
  address: {
    marginLeft: '10px',
    width: '100%'
  },
  missingAddress: {
    marginLeft: '10px',
    width: '100%',
    color: '#b2b2b2'
  },
  balances: {
    marginLeft: 'auto'
  }
}));

const AccountDisplay = ({ address = '', addressKind, balance, friendlyName, hideAddress = false, onClick }: Props) => {
  const classes = useStyles();
  const displayText = () => {
    const shortAddress = shorterItem(address);
    const name = friendlyName ? `${friendlyName} [${shortAddress}]` : shortAddress;
    const justFriendlyName = friendlyName || shortAddress;
    const displayName = hideAddress ? justFriendlyName : name;

    if (addressKind) {
      return `${addressKind}(${displayName})`;
    }

    return displayName;
  };

  return (
    <div onClick={onClick} className={classes.container}>
      <div className={classes.icon}>{<AccountIdenticon address={address} />}</div>
      <div className={!address ? classes.missingAddress : classes.address}>{displayText()}</div>
      <Balance balance={balance} />
    </div>
  );
};

export enum AddressKind {
  NATIVE = 'native',
  COMPANION = 'companion'
}

export default AccountDisplay;
