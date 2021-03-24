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

import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type { KeyringPair } from '@polkadot/keyring/types';
import keyring from '@polkadot/ui-keyring';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { chainsConfigs } from '../configs/substrateProviders';
import { KeyringContextType, KeyringStatuses } from '../types/keyringTypes';
import logger from '../util/logger';
import { useSourceTarget } from './SourceTargetContextProvider';

interface KeyringContextProviderProps {
  children: React.ReactElement;
}

export const KeyringContext: React.Context<KeyringContextType> = React.createContext({} as KeyringContextType);

export function useKeyringContext() {
  return useContext(KeyringContext);
}

export function KeyringContextProvider(props: KeyringContextProviderProps): React.ReactElement {
  const { children = null } = props;
  const { sourceChain } = useSourceTarget();
  const sourceChainSS58Format = chainsConfigs[sourceChain].SS58Format;
  const [keyringStatus, setKeyringStatus] = useState(KeyringStatuses.INIT);

  const [keyringPairs, setKeyringPairs] = useState<Array<KeyringPair>>([]);
  const [keyringPairsReady, setkeyringPairsReady] = useState(false);

  const isDevelopment = Boolean(process.env.REACT_APP_KEYRING_DEV_LOAD_ACCOUNTS);

  const loadAccounts = useCallback(() => {
    const asyncLoadAccounts = async () => {
      setKeyringStatus(KeyringStatuses.LOADING);
      try {
        await web3Enable('Substrate Bridges UI');
        let allAccounts = await web3Accounts();
        allAccounts = allAccounts.map(({ address, meta }) => ({
          address,
          meta: { ...meta, name: `${meta.name} (${meta.source})` }
        }));
        keyring.loadAll({ isDevelopment, ss58Format: sourceChainSS58Format }, allAccounts);
        setKeyringStatus(KeyringStatuses.READY);
      } catch (e) {
        logger.error(e);
        setKeyringStatus(KeyringStatuses.ERROR);
      }
    };

    if (keyringStatus === KeyringStatuses.LOADING || keyringStatus === KeyringStatuses.READY) return;

    asyncLoadAccounts();
  }, [isDevelopment, keyringStatus, sourceChainSS58Format]);

  useEffect(() => {
    if (keyringStatus === KeyringStatuses.INIT) {
      loadAccounts();
    }
  }, [keyringStatus, loadAccounts]);

  useEffect(() => {
    if (keyringStatus === KeyringStatuses.READY) {
      const keyringOptions = keyring.getPairs();
      setKeyringPairs(keyringOptions);
      setkeyringPairsReady(true);
    }
  }, [keyringStatus]);

  return <KeyringContext.Provider value={{ keyringPairs, keyringPairsReady }}>{children}</KeyringContext.Provider>;
}
