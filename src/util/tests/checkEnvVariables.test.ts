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

import { checkEnvVariable } from '../checkEnvVariables';

describe('checkEnvVariables', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {};
  });

  afterAll(() => {
    process.env = {};
  });

  test('Should validate and return chain value according env value', () => {
    const envValue = 'chain';
    process.env.REACT_APP_CHAIN_1 = envValue;

    const result = checkEnvVariable('REACT_APP_CHAIN_1');
    expect(result).toEqual(envValue);
  });

  test('Should validate and return prefix value according env value', () => {
    const envValue = '58';
    process.env.REACT_APP_SS58_PREFIX_CHAIN_1 = envValue;

    const result = checkEnvVariable('REACT_APP_SS58_PREFIX_CHAIN_1');
    expect(result).toEqual(envValue);
  });

  test('should throw error because REACT_APP_DOES_NOT_EXIST was not defined', () => {
    const variable = 'REACT_APP_DOES_NOT_EXIST';
    try {
      checkEnvVariable('REACT_APP_DOES_NOT_EXIST');
      fail('it should not reach here');
    } catch (e) {
      expect(e.message).toEqual(`Env Variable ${variable} was not defined`);
    }
  });
});
