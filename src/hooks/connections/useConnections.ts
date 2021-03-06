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

import { useState, useEffect } from 'react';
import { useApiConnection } from './useApiConnection';
import isEmpty from 'lodash/isEmpty';
import { SourceTargetState, ChainDetails, ConnectionChainInformation } from '../../types/sourceTargetTypes';
import { Subscriptions } from '../../types/subscriptionsTypes';

export function useConnections(chainsConnections: ConnectionChainInformation[]) {
  const [connectionDetails1, connectionDetails2] = chainsConnections;
  const { configs: chain1Configs, polkadotjsUrl: polkadotjsUrl1, ...apiConnection1 } = useApiConnection(
    connectionDetails1
  );
  const { configs: chain2Configs, polkadotjsUrl: polkadotjsUrl2, ...apiConnection2 } = useApiConnection(
    connectionDetails2
  );
  const [connections, setConnections] = useState<SourceTargetState>({} as SourceTargetState);
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    if (chain1Configs && chain2Configs) {
      const chainName1 = chain1Configs.chainName;
      const chainName2 = chain2Configs.chainName;
      const apiReady = apiConnection1?.isApiReady && apiConnection2?.isApiReady;
      if (chainName1 && chainName2 && isEmpty(connections)) {
        const connections = {
          [ChainDetails.SOURCE]: {
            configs: chain1Configs,
            apiConnection: apiConnection1,
            chain: chainName1,
            polkadotjsUrl: polkadotjsUrl1,
            subscriptions: {} as Subscriptions
          },
          [ChainDetails.TARGET]: {
            configs: chain2Configs,
            apiConnection: apiConnection2,
            chain: chainName2,
            polkadotjsUrl: polkadotjsUrl2,
            subscriptions: {} as Subscriptions
          }
        };
        setConnections(connections);
        setApiReady(apiReady);
      }
    }
  }, [apiConnection1, apiConnection2, chain1Configs, chain2Configs, connections, polkadotjsUrl1, polkadotjsUrl2]);

  return { connections, apiReady };
}
