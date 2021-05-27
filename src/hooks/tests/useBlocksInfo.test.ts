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

import { renderHook, act } from '@testing-library/react-hooks';
import useBlocksInfo from '../useBlocksInfo';

const chain = 'chain';

describe('useBlocksInfo', () => {
  const bestNumberMock = jest.fn() as jest.MockedFunction<any>;
  const bestNumberFinalizedMock = jest.fn() as jest.MockedFunction<any>;
  const unsubBestNumber = jest.fn();
  const unsubNumberFinalized = jest.fn();

  const api = {
    derive: {
      [chain]: {
        bestNumber: bestNumberMock,
        bestNumberFinalized: bestNumberFinalizedMock
      }
    }
  };

  let props = {};

  beforeEach(() => {
    bestNumberMock.mockResolvedValue(unsubBestNumber);
    bestNumberFinalizedMock.mockResolvedValue(unsubNumberFinalized);

    props = {
      api,
      isApiReady: true,
      chain
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('bestNumber', () => {
    it('should call the query api.derive.chain.bestNumber & api.derive.chain.bestNumberFinalized with expected callback function', () => {
      renderHook(() => useBlocksInfo(props));
      expect(bestNumberMock).toHaveBeenCalledWith(expect.any(Function));
      expect(bestNumberFinalizedMock).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should unsubscribe both subscriptions when useEffect gets unmounted', async () => {
      const { unmount } = await renderHook(() => useBlocksInfo(props));
      unmount();
      expect(unsubBestNumber).toHaveBeenCalled();
      expect(unsubNumberFinalized).toHaveBeenCalled();
    });

    it('should NOT call the query api.query.chain2.bestFinalized because the api is not ready', () => {
      props.isApiReady = false;
      renderHook(() => useBlocksInfo(props));
      expect(bestNumberMock).not.toHaveBeenCalled();
      expect(bestNumberFinalizedMock).not.toHaveBeenCalled();
    });
  });
});
