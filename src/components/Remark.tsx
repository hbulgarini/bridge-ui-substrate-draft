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
import { Button, Container, Input } from 'semantic-ui-react';
import styled from 'styled-components';

import { useAccountContext } from '../contexts/AccountContextProvider';
import { useTransactionContext } from '../contexts/TransactionContext';
import useLoadingApi from '../hooks/useLoadingApi';
import useSendMessage from '../hooks/useSendMessage';
import useTransactionPreparation from '../hooks/useTransactionPreparation';
import { TransactionTypes } from '../types/transactionTypes';
interface Props {
  className?: string;
}

const Remark = ({ className }: Props) => {
  const [isRunning, setIsRunning] = useState(false);

  const areApiReady = useLoadingApi();
  const [remarkInput, setRemarkInput] = useState('0x');

  const [executionStatus, setExecutionStatus] = useState('');
  const { account: currentAccount } = useAccountContext();
  const { payload } = useTransactionPreparation({ input: remarkInput, type: TransactionTypes.REMARK });
  const { estimatedFee } = useTransactionContext();
  const message = {
    error: 'Error sending remark',
    successfull: '- Remark was executed succesfully'
  };
  const sendLaneMessage = useSendMessage({
    estimatedFee,
    input: remarkInput,
    isRunning,
    message,
    payload,
    setExecutionStatus,
    setIsRunning
  });
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExecutionStatus('');
    setRemarkInput(event.target.value);
  };

  /*   async function sendMessageRemark() {
    if (isRunning) {
      return false;
    }
    setIsRunning(true);

    try {
      if (!account) {
        return;
      }
      const remarkCall = await targetApi.tx.system.remark(remarkInput);
      const remarkInfo = await sourceApi.tx.system.remark(remarkInput).paymentInfo(account);
      const weight = remarkInfo.weight.toNumber();
      const call = remarkCall.toU8a();

      const payload = {
        call,
        origin: {
          SourceAccount: account.addressRaw
        },
        spec_version: 1,
        weight
      };

      // Ignoring custom types missed for TS for now.
      // Need to apply: https://polkadot.js.org/docs/api/start/typescript.user
      // @ts-ignore
      const payloadType = sourceApi.registry.createType('OutboundPayload', payload);
      // @ts-ignore
      const messageFeeType = sourceApi.registry.createType('MessageFeeData', {
        lane_id,
        payload: u8aToHex(payloadType.toU8a())
      });

      const estimatedFeeCall = await sourceApi.rpc.state.call<Codec>(
        `To${targetChain}OutboundLaneApi_estimate_message_delivery_and_dispatch_fee`,
        u8aToHex(messageFeeType.toU8a())
      );

      // @ts-ignore
      const estimatedFeeType = sourceApi.registry.createType('Option<Balance>', estimatedFeeCall);
      const estimatedFee = estimatedFeeType.toString();

      const bridgeMessage = sourceApi.tx[`bridge${targetChain}MessageLane`].sendMessage(lane_id, payload, estimatedFee);

      const options: Partial<SignerOptions> = {
        nonce: -1
      };
      let sourceAccount: string | KeyringPair = account;
      if (account.meta.isInjected) {
        const injector = await web3FromSource(account.meta.source as string);
        options.signer = injector.signer;
        sourceAccount = account.address;
      }
      await bridgeMessage.signAndSend(sourceAccount, { ...options });
      setExecutionStatus('Remark delivered');
    } catch (e) {
      setExecutionStatus('Remark failed');

      console.error(e);
    } finally {
      setIsRunning(false);
    }
  } */

  if (!areApiReady) {
    return null;
  }

  return (
    <Container className={className}>
      <Input onChange={onChange} value={remarkInput} />
      <Button disabled={isRunning || !currentAccount} onClick={sendLaneMessage}>
        Send Remark
      </Button>
      {estimatedFee && <p>Estimated source Fee: {estimatedFee}</p>}
      {executionStatus !== '' && (
        <div className="status">
          <p>{executionStatus}</p>
        </div>
      )}
    </Container>
  );
};

export default styled(Remark)`
  display: flex !important;
  justify-content: center !important;
`;
