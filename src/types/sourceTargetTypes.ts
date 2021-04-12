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

import { ApiPromise } from '@polkadot/api';

import { SourceTargetActionsTypes } from '../actions/sourceTargetActions';

export interface ApiPromiseConnectionType {
  api: ApiPromise; // From @polkadot/api\
  isApiReady: boolean;
}

interface Payload {
  [propName: string]: string;
}

export type SourceTargetAction = { type: SourceTargetActionsTypes; payload?: Payload };
export interface ApiPromiseContextType {
  api: ApiPromise; // From @polkadot/api\
  isApiReady: boolean;
  polkadotjsUrl: string;
}

export enum ChainDetails {
  SOURCE = 'sourceChainDetails',
  TARGET = 'targetChainDetails'
}

export interface SourceTargetState {
  [ChainDetails.SOURCE]: {
    sourceApiConnection: ApiPromiseConnectionType;
    sourceChain: string;
    sourcePolkadotjsUrl: string;
  };
  [ChainDetails.TARGET]: {
    targetApiConnection: ApiPromiseConnectionType;
    targetChain: string;
    targetPolkadotjsUrl: string;
  };
}
