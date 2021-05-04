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

import React, { useContext, useReducer } from 'react';
import sourceTargetReducer from '../reducers/sourceTargetReducer';
import { ChainDetails, SourceTargetAction, SourceTargetState, Connection } from '../types/sourceTargetTypes';

export interface UpdateSourceTargetContext {
  dispatchChangeSourceTarget: React.Dispatch<SourceTargetAction>;
}

export interface SourceTargetContextProps {
  connections: Array<Connection>;
  children: React.ReactElement;
}

export const SourceTargetContext: React.Context<SourceTargetState> = React.createContext({} as SourceTargetState);

export function useSourceTarget() {
  return useContext(SourceTargetContext);
}

export const UpdateSourceTargetContext: React.Context<UpdateSourceTargetContext> = React.createContext(
  {} as UpdateSourceTargetContext
);

export function useUpdateSourceTarget() {
  return useContext(UpdateSourceTargetContext);
}

const initState = (connections: Array<Connection>) => {
  const {
    apiConnection: sourceApiConnection,
    chainName: sourceChain,
    polkadotjsUrl: sourcePolkadotjsUrl,
    configs: sourceConfigs
  } = connections[0];
  const {
    apiConnection: targetApiConnection,
    chainName: targetChain,
    configs: targetConfigs,
    polkadotjsUrl: targetPolkadotjsUrl
  } = connections[1];
  return {
    [ChainDetails.SOURCE]: {
      sourceConfigs,
      sourceApiConnection,
      sourceChain,
      sourcePolkadotjsUrl
    },
    [ChainDetails.TARGET]: {
      targetConfigs,
      targetApiConnection,
      targetChain,
      targetPolkadotjsUrl
    }
  };
};

export function SourceTargetContextProvider({ connections, children }: SourceTargetContextProps): React.ReactElement {
  const initialState = initState(connections);
  const [sourceTargetChains, dispatchChangeSourceTarget] = useReducer(sourceTargetReducer, initialState);

  return (
    <SourceTargetContext.Provider value={sourceTargetChains}>
      <UpdateSourceTargetContext.Provider value={{ dispatchChangeSourceTarget }}>
        {children}
      </UpdateSourceTargetContext.Provider>
    </SourceTargetContext.Provider>
  );
}
