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

import { Card, CardContent, CardHeader, makeStyles } from '@material-ui/core';
import React from 'react';

import { Step, TransactionStatusEnum, TransanctionStatus } from '../types/transactionTypes';
import { ButtonSwitchMode } from './Buttons';

interface Props {
  steps: Array<Step>;
  transaction: TransanctionStatus;
}

const useStyles = makeStyles((theme) => ({
  card: {
    '& *': {
      ...theme.typography.body2
    },
    '& .MuiCardHeader-root': {
      padding: 0,
      '& .MuiTypography-root': {
        fontWeight: 600
      }
    },
    '& .MuiCardContent-root': {
      padding: 0
    }
  }
}));

export const TransactionDisplay = ({ transaction, steps }: Props) => {
  const classes = useStyles();
  if (!steps.length) {
    return null;
  }

  console.log(transaction);

  const status = transaction.status === TransactionStatusEnum.COMPLETED ? 'Completed' : 'In Progress';
  return (
    <>
      <ButtonSwitchMode disabled> Payload</ButtonSwitchMode>
      <ButtonSwitchMode color="primary"> Reciept</ButtonSwitchMode>
      <ButtonSwitchMode disabled> Human</ButtonSwitchMode>
      <Card elevation={24} className={classes.card}>
        <CardHeader title={`${transaction.type} ${transaction.sourceChain} -> ${transaction.targetChain}`} />
        <CardContent>
          <h4>Status: {status}</h4>
          {steps.map(({ chainType, label, status }, idx) => (
            <p key={idx}>
              {chainType}: {label}: {status}
            </p>
          ))}
        </CardContent>
      </Card>
    </>
  );
};
