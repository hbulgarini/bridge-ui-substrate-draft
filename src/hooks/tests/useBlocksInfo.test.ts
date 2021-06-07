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
import { renderHook } from '@testing-library/react-hooks';
import { useApiSubscription } from '../useApiSubscription';
import useBlocksInfo from '../useBlocksInfo';
import logger from '../../util/logger';

jest.spyOn(logger, 'error');
jest.mock('../useMakeSubscription');

const CHAIN = 'chain';

interface Props {
  chain: string;
  api: jest.Mocked<ApiPromise>;
  isApiReady: boolean;
}

describe('useBlocksInfo', () => {
  const bestNumberMock = jest.fn() as jest.MockedFunction<any>;
  const bestNumberFinalizedMock = jest.fn() as jest.MockedFunction<any>;

  const api: jest.Mocked<ApiPromise> = {
    derive: {
      chain: {
        bestNumber: bestNumberMock,
        bestNumberFinalized: bestNumberFinalizedMock
      }
    }
  };

  const props: Props = {
    api,
    isApiReady: true,
    chain: CHAIN
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('bestNumber', () => {
    it('should call hook useApiSubscription with callbacks api.derive.chain.bestNumber & api.derive.chain.bestNumberFinalized', () => {
      renderHook(() => useBlocksInfo(props));
      expect(useApiSubscription).toHaveBeenCalledTimes(2);

      expect(useApiSubscription.mock.calls[0][0]).toEqual(expect.any(Function));
      expect(useApiSubscription.mock.calls[0][1]).toBe(true);

      expect(useApiSubscription.mock.calls[1][0]).toEqual(expect.any(Function));
      expect(useApiSubscription.mock.calls[1][1]).toBe(true);
    });

    it('should NOT call hook useApiSubscription with callbacks api.derive.chain.bestNumber & api.derive.chain.bestNumberFinalized with isReady to false', () => {
      props.isApiReady = false;
      renderHook(() => useBlocksInfo(props));
      expect(useApiSubscription).toHaveBeenCalledTimes(2);

      expect(useApiSubscription.mock.calls[0][1]).toBe(false);
      expect(useApiSubscription.mock.calls[1][1]).toBe(false);
    });
  });
});
