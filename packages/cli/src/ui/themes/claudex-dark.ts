/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { type ColorsTheme, Theme } from './theme.js';
import { darkSemanticColors } from './semantic-tokens.js';

const claudexDarkColors: ColorsTheme = {
  type: 'dark',
  Background: '#0b0e14',
  Foreground: '#bfbdb6',
  LightBlue: '#59C2FF',
  AccentBlue: '#39BAE6',
  AccentPurple: '#D2A6FF',
  AccentCyan: '#95E6CB',
  AccentGreen: '#AAD94C',
  AccentYellow: '#FFD700',
  AccentRed: '#F26D78',
  AccentYellowDim: '#8B7530',
  AccentRedDim: '#8B3A4A',
  DiffAdded: '#AAD94C',
  DiffRemoved: '#F26D78',
  Comment: '#646A71',
  Gray: '#3D4149',
  GradientColors: ['#FFD700', '#da7959'],
};

export const ClaudexDark: Theme = new Theme(
  'Claudex Dark',
  'dark',
  {
    hljs: {
      display: 'block',
      overflowX: 'auto',
      padding: '0.5em',
      background: claudexDarkColors.Background,
      color: claudexDarkColors.Foreground,
    },
    'hljs-keyword': {
      color: claudexDarkColors.AccentYellow,
    },
    'hljs-literal': {
      color: claudexDarkColors.AccentPurple,
    },
    'hljs-symbol': {
      color: claudexDarkColors.AccentCyan,
    },
    'hljs-name': {
      color: claudexDarkColors.LightBlue,
    },
    'hljs-link': {
      color: claudexDarkColors.AccentBlue,
    },
    'hljs-function .hljs-keyword': {
      color: claudexDarkColors.AccentYellow,
    },
    'hljs-subst': {
      color: claudexDarkColors.Foreground,
    },
    'hljs-string': {
      color: claudexDarkColors.AccentGreen,
    },
    'hljs-title': {
      color: claudexDarkColors.AccentYellow,
    },
    'hljs-type': {
      color: claudexDarkColors.AccentBlue,
    },
    'hljs-attribute': {
      color: claudexDarkColors.AccentYellow,
    },
    'hljs-bullet': {
      color: claudexDarkColors.AccentYellow,
    },
    'hljs-addition': {
      color: claudexDarkColors.AccentGreen,
    },
    'hljs-variable': {
      color: claudexDarkColors.Foreground,
    },
    'hljs-template-tag': {
      color: claudexDarkColors.AccentYellow,
    },
    'hljs-template-variable': {
      color: claudexDarkColors.AccentYellow,
    },
    'hljs-comment': {
      color: claudexDarkColors.Comment,
      fontStyle: 'italic',
    },
    'hljs-quote': {
      color: claudexDarkColors.AccentCyan,
      fontStyle: 'italic',
    },
    'hljs-deletion': {
      color: claudexDarkColors.AccentRed,
    },
    'hljs-meta': {
      color: claudexDarkColors.AccentYellow,
    },
    'hljs-doctag': {
      fontWeight: 'bold',
    },
    'hljs-strong': {
      fontWeight: 'bold',
    },
    'hljs-emphasis': {
      fontStyle: 'italic',
    },
  },
  claudexDarkColors,
  darkSemanticColors,
);
