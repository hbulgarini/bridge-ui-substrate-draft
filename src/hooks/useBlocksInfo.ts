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

import { VoidFn } from '@polkadot/api/types';
import { ApiPromise } from '@polkadot/api';
import { useEffect } from 'react';
import { useMountedState } from '../hooks/useMountedState';
import useApiCalls from '../hooks/useApiCalls';
import logger from '../util/logger';

interface Props {
  chain: string;
  api: ApiPromise;
  isApiReady: boolean;
}

const useBlocksInfo = ({ isApiReady, chain }: Props) => {
  const [bestBlock, setBestBlock] = useMountedState('');
  const [bestBlockFinalized, setBestBlockFinalized] = useMountedState('');
  const { derive } = useApiCalls();
  const chainDerive = derive(chain);

  useEffect(() => {
    let unsubscribeBestNumber: Promise<VoidFn>;
    let unsubscribeBestNumberFinalized: Promise<VoidFn>;
    if (isApiReady && chain) {
      try {
        unsubscribeBestNumber = chainDerive.bestNumber((res: any) => {
          setBestBlock(res.toString());
        });

        unsubscribeBestNumberFinalized = chainDerive.bestNumberFinalized((res: any) => {
          setBestBlockFinalized(res.toString());
        });
      } catch (e) {
        logger.error('error reading blocks', e);
      }
    }
    return function cleanup() {
      unsubscribeBestNumber
        .then((u) => {
          u();
        })
        .catch((e) => logger.error('error unsubscribing bestNumber', e));
      unsubscribeBestNumberFinalized
        .then((u) => u())
        .catch((e) => logger.error('error unsubscribing bestNumberFinalized', e));
    };
  }, [isApiReady, chain, setBestBlock, setBestBlockFinalized, derive, chainDerive]);

  return { bestBlock, bestBlockFinalized };
};

export default useBlocksInfo;
