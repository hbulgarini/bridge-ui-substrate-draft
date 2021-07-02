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

import React, { useEffect, useState } from 'react';
import { Box, makeStyles, TextField, Typography } from '@material-ui/core';
import BN from 'bn.js';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import useAccounts from '../hooks/accounts/useAccounts';
import useBalance from '../hooks/subscriptions/useBalance';
import useSendMessage from '../hooks/chain/useSendMessage';
import { TransactionTypes } from '../types/transactionTypes';
import { TokenSymbol } from './TokenSymbol';
import Receiver from './Receiver';
import { evalUnits } from '../util/evalUnits';
import { Alert, ButtonSubmit } from '../components';
import useDebounceState from '../hooks/react/useDebounceState';

const useStyles = makeStyles((theme) => ({
  inputAmount: {
    '& .MuiInputBase-root': {
      '& .MuiInputAdornment-root': {
        position: 'absolute',
        right: theme.spacing(2),
        ...theme.typography.subtitle2
      },
      '& input': {
        textAlign: 'center',
        ...theme.typography.subtitle2,
        fontSize: theme.typography.h1.fontSize,
        color: theme.palette.primary.main
      }
    }
  }
}));

function Transfer() {
  const classes = useStyles();
  const [isRunning, setIsRunning] = useState(false);
  const [helperText, setHelperText] = useState('');

  const [amountNotCorrect, setAmountNotCorrect] = useState<boolean>(false);
  const { sourceChainDetails, targetChainDetails } = useSourceTarget();
  const { account } = useAccounts();

  const planck = 10 ** targetChainDetails.apiConnection.api.registry.chainDecimals[0];
  const { estimatedFee, receiverAddress, estimatedFeeLoading } = useTransactionContext();
  const { api, isApiReady } = sourceChainDetails.apiConnection;
  const balance = useBalance(api, account?.address || '');

  const transformInput = (value: string) => {
    const [actualValue, message] = evalUnits(value || '0');
    setHelperText(message);
    return actualValue && actualValue * planck;
  };

  const [transferInput, actualInput, setActualInput] = useDebounceState('', null, transformInput);

  const { isButtonDisabled, sendLaneMessage } = useSendMessage({
    input: actualInput?.toString() ?? '',
    isRunning,
    setIsRunning,
    type: TransactionTypes.TRANSFER
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setActualInput(event.target.value);
  };

  useEffect((): void => {
    isRunning && setActualInput('');
  }, [isRunning, setActualInput]);

  // To extract estimated fee logic to specific component. Issue #171
  useEffect((): void => {
    console.log('estimatedFee', estimatedFee);
    console.log('actualInput', actualInput);

    estimatedFee &&
      actualInput &&
      setAmountNotCorrect(new BN(balance.free).sub(new BN(actualInput).add(new BN(estimatedFee))).toNumber() < 0);
  }, [actualInput, estimatedFee, balance, isApiReady]);

  return (
    <>
      <Box mb={2}>
        <TextField
          id="test-amount-send"
          onChange={onChange}
          value={transferInput}
          placeholder={'0'}
          className={classes.inputAmount}
          fullWidth
          variant="outlined"
          helperText={helperText}
          InputProps={{
            endAdornment: <TokenSymbol position="start" />
          }}
        />
      </Box>
      <Receiver />
      <ButtonSubmit disabled={isButtonDisabled() || amountNotCorrect} onClick={sendLaneMessage}>
        Send bridge transfer from {sourceChainDetails.chain} to {targetChainDetails.chain}
      </ButtonSubmit>
      {amountNotCorrect ? (
        <Alert severity="error">
          Account&apos;s amount (including fees: {estimatedFee}) is not enough for this transaction.
        </Alert>
      ) : estimatedFeeLoading ? (
        <Typography variant="body1" color="secondary">
          Estimated source Fee loading...
        </Typography>
      ) : (
        <Typography variant="body1" color="secondary">
          {receiverAddress && estimatedFee && `Estimated source Fee: ${estimatedFee}`}
        </Typography>
      )}
    </>
  );
}

export default Transfer;
