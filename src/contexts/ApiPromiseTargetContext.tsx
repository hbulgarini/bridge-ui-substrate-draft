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

import React, { useContext } from 'react';

import { getChainConfigs } from '../configs/substrateProviders';
import { TARGET } from '../constants';
import { ApiPromiseContextType } from '../types/sourceTargetTypes';
import { ApiPromiseContextProvider } from './ApiPromiseContextProvider';
import { useSourceTarget } from './SourceTargetContextProvider';

interface ApiRxContextTargetProviderProps {
  children: React.ReactElement;
}

export const ApiPromiseTargetContext: React.Context<ApiPromiseContextType> = React.createContext(
  {} as ApiPromiseContextType
);

export function useApiTargetPromiseContext() {
  return useContext(ApiPromiseTargetContext);
}

export function ApiPromiseTargetContextProvider(props: ApiRxContextTargetProviderProps): React.ReactElement {
  const { children } = props;
  const { targetChain } = useSourceTarget();
  const chainsConfigs = getChainConfigs();
  const { hasher, types, provider } = chainsConfigs[targetChain];

  return (
    <ApiPromiseContextProvider
      contextType={TARGET}
      ApiPromiseContext={ApiPromiseTargetContext}
      provider={provider}
      types={types}
      hasher={hasher}
    >
      {children}
    </ApiPromiseContextProvider>
  );
}
