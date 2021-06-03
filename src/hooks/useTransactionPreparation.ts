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

import { compactAddLength } from '@polkadot/util';
import { useEffect, useState } from 'react';
import { TransactionActionCreators } from '../actions/transactionActions';
import { useAccountContext } from '../contexts/AccountContextProvider';
import { useSourceTarget } from '../contexts/SourceTargetContextProvider';
import { useUpdateTransactionContext } from '../contexts/TransactionContext';
import { useApiCallsContext } from '../contexts/ApiCallsContextProvider';
import useLaneId from '../hooks/useLaneId';
import useLoadingApi from './api/useLoadingApi';
import useTransactionType from '../hooks/useTransactionType';
import { getSubstrateDynamicNames } from '../util/getSubstrateDynamicNames';
import logger from '../util/logger';

interface Props {
  input: string;
  type: string;
  weightInput?: string;
  isValidCall?: boolean;
}

interface FeeAndPayload {
  payload: any;
}

export default function useTransactionPreparation({
  input,
  type,
  weightInput,
  isValidCall = true
}: Props): FeeAndPayload {
  const areApiReady = useLoadingApi();
  const laneId = useLaneId();
  const {
    sourceChainDetails: { chain: sourceChain },
    targetChainDetails: { chain: targetChain }
  } = useSourceTarget();
  const { account } = useAccountContext();

  const [payload, setPayload] = useState<null | {}>(null);
  const { call, weight } = useTransactionType({ input, type, weightInput });

  const { dispatchTransaction } = useUpdateTransactionContext();
  const { createType, stateCall } = useApiCallsContext();
  const { estimatedFeeMethodName } = getSubstrateDynamicNames(targetChain);

  useEffect(() => {
    const calculateFee = async () => {
      // Ignoring custom types missed for TS for now.
      // Need to apply: https://polkadot.js.org/docs/api/start/typescript.user
      // @ts-ignore
      const payloadType = createType(sourceChain, 'OutboundPayload', payload);
      // @ts-ignore
      const messageFeeType = createType(sourceChain, 'MessageFeeData', {
        lane_id: laneId,
        payload: payloadType.toHex()
      });

      const estimatedFeeCall = await stateCall(sourceChain, messageFeeType.toHex());

      // @ts-ignore
      const estimatedFeeType = createType(sourceChain, 'Option<Balance>', estimatedFeeCall);
      const estimatedFee = estimatedFeeType.toString();

      dispatchTransaction(TransactionActionCreators.estimateFee(estimatedFee));
    };

    if (areApiReady && payload) {
      calculateFee();
    }
  }, [
    areApiReady,
    createType,
    dispatchTransaction,
    estimatedFeeMethodName,
    laneId,
    payload,
    sourceChain,
    stateCall,
    targetChain
  ]);

  useEffect(() => {
    if (!(isValidCall && account && call && weight)) {
      return;
    }

    const payload = {
      call: compactAddLength(call),
      origin: {
        SourceAccount: account.addressRaw
      },
      // TODO [#122] This must not be hardcoded.
      spec_version: 1,
      weight
    };
    // @ts-ignore
    const payloadType = createType(sourceChain, 'OutboundPayload', payload);
    logger.info(`OutboundPayload: ${JSON.stringify(payload)}`);
    logger.info(`OutboundPayload.toHex(): ${payloadType.toHex()}`);
    setPayload(payload);
  }, [account, call, isValidCall, type, weight, createType, sourceChain]);

  return {
    payload
  };
}
