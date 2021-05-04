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

const http = require('https'); // or 'https' for https:// URLs
const fs = require('fs');

const commonBridgesRepo = 'https://raw.githubusercontent.com/paritytech/parity-bridges-common/master/deployments';
const customTypesDir = 'src/configs/substrateConfigs';

const filesConfig = [
  {
    path: `${customTypesDir}/customTypesMillau.json`,
    url: `${commonBridgesRepo}/types-millau.json`
  },
  {
    path: `${customTypesDir}/customTypesRialto.json`,
    url: `${commonBridgesRepo}/types-rialto.json`
  }
];

filesConfig.map(({ path, url }) => {
  console.log('Start downloading file: ', url);
  const file = fs.createWriteStream(path, { flags: 'w' });
  http.get(url, function (response) {
    response.pipe(file);
  });
});
