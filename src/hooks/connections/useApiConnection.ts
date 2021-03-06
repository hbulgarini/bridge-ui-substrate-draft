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
import { TypeRegistry } from '@polkadot/types';
import isEmpty from 'lodash/isEmpty';
import React, { useEffect, useState } from 'react';
import { ApiPromiseConnectionType, Configs, ConnectionChainInformation } from '../../types/sourceTargetTypes';
import logger from '../../util/logger';
import { getConfigs } from '../../util/getConfigs';

export const ApiPromiseContext: React.Context<ApiPromiseConnectionType> = React.createContext(
  {} as ApiPromiseConnectionType
);

const registry = new TypeRegistry();

type ConfigsType = {
  configs: Configs;
};

type PolkadotJsURL = {
  polkadotjsUrl: string;
};

type ConnectionType = ApiPromiseConnectionType & ConfigsType & PolkadotJsURL;

export function useApiConnection(connectionDetails: ConnectionChainInformation): ConnectionType {
  const [apiPromise, setApiPromise] = useState<ApiPromise>({} as ApiPromise);
  const [isReady, setIsReady] = useState(false);
  const [configs, setConfigs] = useState<Configs>({} as Configs);
  const { chainNumber, hasher, provider, types, polkadotjsUrl } = connectionDetails;

  useEffect(() => {
    ApiPromise.create({ hasher: hasher || undefined, provider, types })
      .then((api): void => {
        logger.info(`Chain ${chainNumber}: connection created.`);
        setApiPromise(api);
      })
      .catch((err): void => {
        logger.error(`Chain ${chainNumber}: Error creating connection. Details: ${err}`);
      });
  }, [chainNumber, hasher, provider, types]);

  useEffect(() => {
    !isReady &&
      apiPromise &&
      apiPromise.isReady &&
      apiPromise.isReady
        .then(() => {
          if (types) {
            registry.register(types);
          }
          logger.info(`Chain ${chainNumber}: types registration ready`);
          setIsReady(true);
        })
        .catch((err): void => {
          logger.error(`Chain ${chainNumber}: Error registering types. Details: ${err}`);
        });
  }, [apiPromise, apiPromise.isReady, chainNumber, isReady, types]);

  useEffect(() => {
    const getChainConfigs = async () => {
      if (await apiPromise.isReady) {
        const values = await getConfigs(apiPromise);
        setConfigs(values);
      }
    };

    if (isEmpty(configs)) {
      getChainConfigs();
    }
  }, [apiPromise, apiPromise.isReady, configs]);

  return { api: apiPromise, isApiReady: isReady, configs, polkadotjsUrl };
}
