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

import { TransactionStatusType, UpdatedTransactionStatusType, ReceiverPayload } from '../types/transactionTypes';

enum TransactionActionTypes {
  SET_ESTIMATED_FEE = 'SET_ESTIMATED_FEE',
  SET_PAYLOAD = 'SET_PAYLOAD',
  RESET_PAYLOAD = 'RESET_PAYLOAD',
  SET_PAYLOAD_ERROR = 'SET_PAYLOAD_ERROR',
  SET_RECEIVER = 'SET_RECEIVER',
  SET_RECEIVER_ADDRESS = 'SET_RECEIVER_ADDRESS',
  SET_RECEIVER_VALIDATION = 'SET_RECEIVER_VALIDATION',
  CREATE_TRANSACTION_STATUS = 'CREATE_TRANSACTION_STATUS',
  UPDATE_CURRENT_TRANSACTION_STATUS = 'UPDATE_CURRENT_TRANSACTION_STATUS',
  SET_TRANSACTION_COMPLETED = 'SET_TRANSACTION_COMPLETED',
  RESET = 'RESET'
}

const setEstimatedFee = (estimatedFeeError: string | null, estimatedFee: string | null) => {
  return {
    payload: { estimatedFee, estimatedFeeError },
    type: TransactionActionTypes.SET_ESTIMATED_FEE
  };
};

const setPayload = (payloadError: string | null, payload: Object | null) => ({
  payload: { payload, payloadError },
  type: TransactionActionTypes.SET_PAYLOAD
});

const setReceiverAddress = (receiverAddress: string | null) => ({
  payload: { receiverAddress },
  type: TransactionActionTypes.SET_RECEIVER_ADDRESS
});

const setReceiver = (receiverPayload: ReceiverPayload) => ({
  payload: { receiverPayload },
  type: TransactionActionTypes.SET_RECEIVER
});

const createTransactionStatus = (initialTransaction: TransactionStatusType) => {
  return {
    payload: { initialTransaction },
    type: TransactionActionTypes.CREATE_TRANSACTION_STATUS
  };
};

const updateTransactionStatus = (updatedValues: UpdatedTransactionStatusType, id: string) => {
  return {
    payload: { id, updatedValues },
    type: TransactionActionTypes.UPDATE_CURRENT_TRANSACTION_STATUS
  };
};

const reset = () => ({
  payload: {},
  type: TransactionActionTypes.RESET
});

const TransactionActionCreators = {
  setEstimatedFee,
  createTransactionStatus,
  setReceiverAddress,
  setReceiver,
  updateTransactionStatus,
  setPayload,
  reset
};

export { TransactionActionCreators, TransactionActionTypes };
