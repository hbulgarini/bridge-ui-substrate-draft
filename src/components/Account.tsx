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

import Container from '@material-ui/core/Container';
import People from '@material-ui/icons/People';
import React from 'react';
import styled from 'styled-components';

import useBalance from '../hooks/useBalance';

interface Props {
  value: string;
  text: string;
  className?: string;
  showDerivedBalance?: boolean;
}

const Account = ({ className, text, value, showDerivedBalance = false }: Props) => {
  const results = useBalance(value, true);
  const source = results[0];
  const target = results[1];

  return (
    <Container className={className}>
      <div className="address">
        <div className="topAddress">
          <People />
          <div className="text">
            <p>{text}</p>
          </div>
        </div>
        <div className="bottomAddress">
          <p>{value}</p>
        </div>
      </div>

      <div className="balances">
        <div className="balance">
          <p>{source ? source[0] : '-'}</p>
        </div>
        {showDerivedBalance && (
          <div className="balance">
            <p>{target ? target[0] : '-'}</p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default styled(Account)`
  margin: auto 0;
  display: flex;
  justify-content: space-between;

  .address {
    min-width: 70%;
    display: flex;
    flex-direction: column;
  }

  .topAddress {
    display: flex;
  }

  .bottomAddress {
    min-width: 100%;
  }

  .text {
  }
  .balances {
    min-width: 20%;
    float: right;
  }
  .balance {
    padding: 5px;
    border: 1px solid;
  }
`;
