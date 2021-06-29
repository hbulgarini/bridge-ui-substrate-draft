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
const si = [
  // Deactivate these huge nums for now
  // > than 1e21 is too big for JS to handle
  // { value: -1e24, symbol: 'y' },
  // { value: -1e21, symbol: 'z' },
  { value: -1e18, symbol: 'a' },
  { value: -1e15, symbol: 'f' },
  { value: -1e12, symbol: 'p' },
  { value: -1e9, symbol: 'n' },
  { value: -1e6, symbol: 'μ' },
  { value: -1e3, symbol: 'm' },
  { value: 1, symbol: '' },
  { value: 1e3, symbol: 'k' },
  { value: 1e6, symbol: 'M' },
  { value: 1e9, symbol: 'G' },
  { value: 1e12, symbol: 'T' },
  { value: 1e15, symbol: 'P' },
  { value: 1e18, symbol: 'E' }
  // Deactivate these huge nums for now
  // > than 1e21 is too big for JS to handle
  // ,
  // { value: 1e21, symbol: 'Z' },
  // { value: 1e24, symbol: 'Y' }
];

const floats = /^[0-9]*[.,]{1}[0-9]*$/;
const ints = /^[0-9]+$/;
const alphaFloats = /^[0-9]*[.,]{1}[0-9]*[a-zA-Z]{1}$/;
const alphaInts = /^[0-9]*[a-zA-Z]{1}$/;

export enum EvalMessages {
  GIBBERISH = 'Input is not correct. Use numbers, floats or expression (e.g. 1k, 1.3m)',
  ZERO = 'You cannot send 0 funds',
  NEGATIVE = 'You cannot send negative amount of funds',
  SUCCESS = '',
  SYMBOL_ERROR = 'Provided symbol is not correct',
  GENERAL_ERROR = 'Check your input. Something went wrong'
}

/**
 * A function that identifes integer/float(comma or dot)/expressions (such as 1k)
 * and converts to actual value (or reports an error).
 * @param {string} input
 * @returns {[number | null, string]} an array of 2 items
 * the first is the actual calculated number (or null if none) while
 * the second is the message that should appear in case of error
 */
export function evalUnits(input: string): [number | null, string] {
  if (input.length >= Number.MAX_SAFE_INTEGER.toString().length) {
    return [null, EvalMessages.GENERAL_ERROR];
  }
  if (!floats.test(input) && !ints.test(input) && !alphaInts.test(input) && !alphaFloats.test(input)) {
    return [null, EvalMessages.GIBBERISH];
  }
  if (floats.test(input) || ints.test(input)) {
    return [parseFloat(input.replace(/[,]/g, '.')), EvalMessages.SUCCESS];
  }
  if (alphaInts.test(input) || alphaFloats.test(input)) {
    const numericPart = parseFloat(input.replace(/[,]/g, '.'));
    const charPart = input.replace(/[0-9.,]/g, '');
    const siVal = si.find((s) => s.symbol === charPart);
    const numeric = siVal ? numericPart * siVal.value : null;
    if (siVal && numeric) {
      return numeric > 0
        ? [numericPart * siVal.value, EvalMessages.SUCCESS]
        : [numericPart * siVal.value, EvalMessages.NEGATIVE];
    } else {
      return [null, EvalMessages.SYMBOL_ERROR];
    }
  }
  if (parseInt(input) === 0 || isNaN(parseInt(input))) {
    return [null, EvalMessages.ZERO];
  }
  if (Number.parseInt(input) < 0) {
    return [null, EvalMessages.NEGATIVE];
  }
  return [null, EvalMessages.GENERAL_ERROR];
}
