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

import { ChainDetails } from '../../types/sourceTargetTypes';
import { Subscriptions } from '../../types/subscriptionsTypes';
import useChainProfile from '../chain/useChainProfile';
import { useApiCallAndSubscriptions, getBlocksInfo } from '../../api';
import useMessagesLane from './useMessagesLane';
import useBridgedBlocks from './useBridgedBlocks';

interface Source {
  source: string;
  polkadotjsUrl: string;
}

type Output = Subscriptions & Source;

const useSubscriptions = (ChainDetail: ChainDetails): Output => {
  const {
    apiConnection: { api, isApiReady },
    target,
    source,
    polkadotjsUrl
  } = useChainProfile(ChainDetail);

  const blocks = useApiCallAndSubscriptions({
    isApiReady,
    api,
    chain: source,
    apiFunc: getBlocksInfo,
    separators: ['bestNumber', 'bestNumberFinalized']
  });

  const bestBlock = blocks.state1;
  const bestBlockFinalized = blocks.state2;

  const { bestBridgedFinalizedBlock } = useBridgedBlocks({ api, chain: target, isApiReady });
  const messagesLane = useMessagesLane({ api, chain: target, isApiReady });

  return {
    bestBlock,
    bestBlockFinalized,
    bestBridgedFinalizedBlock,
    ...messagesLane,
    source,
    polkadotjsUrl
  };
};

export default useSubscriptions;
