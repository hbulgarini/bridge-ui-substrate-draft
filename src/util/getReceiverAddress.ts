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
import { checkAddress } from '@polkadot/util-crypto';
import { SourceState, TargetState } from '../types/sourceTargetTypes';
import { INCORRECT_FORMAT } from '../constants';
import getDeriveAccount from './getDeriveAccount';
import { getBridgeId } from './getConfigs';

interface Props {
  getChainBySS58Prefix: (prefix: string) => string;
  receiverAddress: string;
  targetChainDetails: TargetState;
  sourceChainDetails: SourceState;
}
const getReceiverAddress = ({
  getChainBySS58Prefix,
  targetChainDetails,
  sourceChainDetails,
  receiverAddress
}: Props) => {
  const { sourceConfigs } = sourceChainDetails;
  const { targetChain, targetConfigs } = targetChainDetails;

  const targetSS58Format = targetConfigs.ss58Format;
  const bridgeId = getBridgeId(targetConfigs, sourceConfigs.chainName);

  try {
    const [validatedDerivedAcccount, rest] = checkAddress(receiverAddress, targetSS58Format);
    if (validatedDerivedAcccount) {
      return { address: receiverAddress, formatFound: targetChain };
    }
    // should be extracted as a separate component/function

    const parts = rest?.split(',');
    const prefix = parts![2].split(' ');
    const formatFound = getChainBySS58Prefix(prefix[2]) || prefix[2];

    const address = getDeriveAccount({
      ss58Format: targetSS58Format,
      address: receiverAddress,
      bridgeId
    });

    return { address, formatFound };
  } catch (e) {
    if (receiverAddress) {
      throw new Error(INCORRECT_FORMAT);
    }
    return { address: '', formatFound: null };
  }
};

export default getReceiverAddress;
