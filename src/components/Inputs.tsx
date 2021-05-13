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

import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

interface SelectLabelProps {
  children: string;
}

const useStyles = makeStyles((theme) => ({
  selectLabel: {
    ...theme.typography.h4,
    color: theme.palette.text.hint,
    marginBottom: theme.spacing()
  }
}));

export const styleAccountCompanion = (theme: Theme) => {
  return {
    marginTop: -1,
    padding: theme.spacing(0.5),
    paddingLeft: theme.spacing(1.25),
    paddingRight: theme.spacing(3),
    border: `1px solid ${theme.palette.divider}`,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderRadius: theme.spacing(1.5)
  };
};

export const SelectLabel = ({ children }: SelectLabelProps) => {
  const classes = useStyles();
  return <div className={classes.selectLabel}>{children}</div>;
};
