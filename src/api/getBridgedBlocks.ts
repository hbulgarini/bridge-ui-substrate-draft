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

import { Hash } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import BN from 'bn.js';
import { useGetApi, ReturnApi } from './useGetApi';
import { DataType } from './types';
interface HeaderId {
  number: BN;
  hash: Hash;
}

type CodecHeaderId = Codec & HeaderId;

export const getBridgedBlocks = async ({ api, apiMethod, separator, setter, arg1 }: DataType): Promise<VoidFn> => {
  if (separator === 'bestFinalized') {
    return apiMethod
      ? await api.query[apiMethod][separator]((res: CodecHeaderId) => {
          setter(res.toString());
        })
      : ({} as Promise<VoidFn>);
  } else if (separator === 'importedHeaders') {
    return apiMethod
      ? await api.query[apiMethod][separator](arg1, (res: any) => {
          const importedHeader = res?.toJSON()?.number;
          importedHeader && setter(importedHeader);
        })
      : ({} as Promise<VoidFn>);
  }
  return {} as Promise<VoidFn>;
};

export const useGetBridgedBlocks = (options: DataType): ReturnApi => {
  return useGetApi<DataType>(getBridgedBlocks, options);
};