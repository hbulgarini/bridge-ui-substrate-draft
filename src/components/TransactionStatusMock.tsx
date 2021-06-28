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

import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { Step, TransactionStatusEnum } from '../types/transactionTypes';
import TransactionReceipt from './TransactionReceipt';
import TransactionSwitchTab from './TransactionSwitchTab';
import useTransactionPayloadDisplay from '../hooks/transactions/useTransactionPayloadDisplay';
interface Props {
  type?: string;
}

const TransactionStatusMock = ({ type }: Props) => {
  const [steps, setSteps] = useState<Array<Step>>([]);

  const {
    sourceChainDetails: { chain: sourceChain },
    targetChainDetails: { chain: targetChain }
  } = useSourceTarget();
  const { payloadHex, TransactionDisplayPayload } = useTransactionPayloadDisplay();

  useEffect(() => {
    setSteps([
      {
        id: 'test-step-include-message-block',
        chainType: sourceChain,
        label: 'Include message in block',
        labelOnChain: '',
        status: TransactionStatusEnum.NOT_STARTED
      },
      {
        id: 'test-step-finalized-block',
        chainType: sourceChain,
        label: 'Finalise block',
        status: TransactionStatusEnum.NOT_STARTED
      },
      {
        id: 'test-step-relay-block',
        chainType: targetChain,
        label: 'Relay block',
        status: TransactionStatusEnum.NOT_STARTED
      },
      {
        id: 'test-step-deliver-message-block',
        chainType: targetChain,
        label: 'Deliver message',
        labelOnChain: '',
        status: TransactionStatusEnum.NOT_STARTED
      },
      {
        id: 'test-step-finalized-message',
        chainType: targetChain,
        label: 'Finalise message in target block',
        labelOnChain: '',
        status: TransactionStatusEnum.NOT_STARTED
      },
      {
        id: 'test-step-confirm-delivery',
        chainType: sourceChain,
        label: 'Confirm delivery',
        status: TransactionStatusEnum.NOT_STARTED
      }
    ]);
  }, [sourceChain, targetChain]);

  return (
    <TransactionSwitchTab payloadHex={payloadHex} TransactionDisplayPayload={TransactionDisplayPayload}>
      <TransactionReceipt steps={steps} type={type} status={TransactionStatusEnum.NOT_STARTED} />
    </TransactionSwitchTab>
  );
};

export default TransactionStatusMock;
