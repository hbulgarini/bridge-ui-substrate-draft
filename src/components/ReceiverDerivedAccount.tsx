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

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import Account from './Account';
import AccountDisplay from './AccountDisplay';

interface Props {
  setError: (value: string) => void;
}

const useStyles = makeStyles(() => ({
  derived: {
    padding: '10px',
    minHeight: '50px',
    minWidth: '100%',
    border: '1px solid grey',
    borderRadius: '0 0 5px 5px',
    borderTop: 'none'
  }
}));

const ReceiverDerivedAccount = ({ setError }: Props) => {
  const classes = useStyles();
  const { genericReceiverAccount, derivedReceiverAccount, receiverAddress } = useTransactionContext();

  const {
    targetChainDetails: { targetChain }
  } = useSourceTarget();

  if (genericReceiverAccount) {
    // TO-DO to replace this callback with proper <GenericAccount /> component.
    setError('A generic account was provided. Please provide a source/target valid account');
  }

  if (derivedReceiverAccount) {
    return (
      <div className={classes.derived}>
        <Account value={receiverAddress!} chain={targetChain} isDerived />
      </div>
    );
  }
  return (
    <div className={classes.derived}>
      <AccountDisplay isDerived />
    </div>
  );
};

export default ReceiverDerivedAccount;
