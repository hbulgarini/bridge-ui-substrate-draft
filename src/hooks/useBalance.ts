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
import { Balance } from '@polkadot/types/interfaces';
import { formatBalance } from '@polkadot/util';
import BN from 'bn.js';
import { useEffect } from 'react';

import { useMountedState } from './useMountedState';

import { useUpdateMessageContext } from '../contexts/MessageContext';
import { MessageActionsCreators } from '../actions/messageActions';
import logger from '../util/logger';

type State = {
  chainTokens: string;
  formattedBalance: string;
  free: Balance;
};

const ZERO = new BN(0);

const initValues = {
  chainTokens: '-',
  formattedBalance: '0',
  free: new BN(ZERO) as Balance
};

const useBalance = (api: ApiPromise, address: string, providedSi: boolean = false): State => {
  const { dispatchMessage } = useUpdateMessageContext();
  const [state, setState] = useMountedState<State>(initValues);

  useEffect((): (() => void) => {
    let unsubscribe: null | (() => void) = null;
    api?.query?.system
      .account(address, ({ data }): void => {
        setState({
          chainTokens: data.registry.chainTokens[0],
          formattedBalance: formatBalance(data.free, {
            decimals: api.registry.chainDecimals[0],
            withUnit: api.registry.chainTokens[0],
            withSi: providedSi
          }),
          free: data.free
        });
      })
      .then((u): void => {
        unsubscribe = u;
      })
      .catch((e) => {
        dispatchMessage(MessageActionsCreators.triggerErrorMessage({ message: e.message }));
        logger.error(e.message);
      });

    return (): void => {
      unsubscribe && unsubscribe();
    };
  }, [address, providedSi, dispatchMessage, api, setState]);

  return state as State;
};

export default useBalance;
