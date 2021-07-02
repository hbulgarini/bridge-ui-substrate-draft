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

import { evalUnits, EvalMessages } from '../evalUnits';

const defaultChainDecimals = 9;

describe('Tests suite - evalUnits', () => {
  // Happy paths
  it('Should input string', () => {
    const [actualResult, msg] = evalUnits('666', defaultChainDecimals);
    expect(actualResult?.toString()).toBe('666000000000');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input, float (dot for decimal symbol)', () => {
    const [actualResult, msg] = evalUnits('1.23', defaultChainDecimals);
    expect(actualResult?.toString()).toBe('1230000000');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input, float (comma for decimal symbol)', () => {
    const [actualResult, msg] = evalUnits('1,23', defaultChainDecimals);
    expect(actualResult?.toString()).toBe('1230000000');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input an expression (1k)', () => {
    const [actualResult, msg] = evalUnits('1k', defaultChainDecimals);
    expect(actualResult?.toString()).toBe('1000000000000');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input an float expression with dot as symbol (1.2k)', () => {
    const [actualResult, msg] = evalUnits('1.2k', defaultChainDecimals);
    expect(actualResult?.toString()).toBe('1200000000000');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  it('Should accept as input an float expression with commas as symbol (1,2k)', () => {
    const [actualResult, msg] = evalUnits('1,2k', defaultChainDecimals);
    expect(actualResult?.toString()).toBe('1200000000000');
    expect(msg).toBe(EvalMessages.SUCCESS);
  });

  // Not so happy paths
  it('Should accept as input an expression (3Y)', () => {
    const [actualResult, msg] = evalUnits('3Y', defaultChainDecimals);
    expect(actualResult?.toString()).toBeFalsy;
    expect(msg).toBe(EvalMessages.BITLENGTH_EXCEEDED);
  });

  it('Should accept as input something gibberish (good23) and return error message', () => {
    const [actualValue, msg] = evalUnits('good23', defaultChainDecimals);
    expect(actualValue).toBeFalsy;
    expect(msg).toBe(EvalMessages.GIBBERISH);
  });

  it('Should accept as input double decimal symbols (1,23.445k) and return error message', () => {
    const [actualValue, msg] = evalUnits('1,23.445k', defaultChainDecimals);
    expect(actualValue).toBeFalsy;
    expect(msg).toBe(EvalMessages.GIBBERISH);
  });
});
