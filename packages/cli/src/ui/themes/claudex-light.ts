/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { type ColorsTheme, Theme } from './theme.js';
import { lightSemanticColors } from './semantic-tokens.js';

const claudexLightColors: ColorsTheme = {
  type: 'light',
  Background: '#f8f9fa',
  Foreground: '#5c6166',
  LightBlue: '#55b4d4',
  AccentBlue: '#399ee6',
  AccentPurple: '#a37acc',
  AccentCyan: '#4cbf99',
  AccentGreen: '#86b300',
  AccentYellow: '#f2ae49',
  AccentRed: '#f07171',
  AccentYellowDim: '#8B7000',
  AccentRedDim: '#993333',
  DiffAdded: '#86b300',
  DiffRemoved: '#f07171',
  Comment: '#ABADB1',
  Gray: '#CCCFD3',
  GradientColors: ['#399ee6', '#86b300'],
};

export const ClaudexLight: Theme = new Theme(
  'Claudex Light',
  'light',
  {
    hljs: {
      display: 'block',
      overflowX: 'auto',
      padding: '0.5em',
      background: claudexLightColors.Background,
      color: claudexLightColors.Foreground,
    },
    'hljs-comment': {
      color: claudexLightColors.Comment,
      fontStyle: 'italic',
    },
    'hljs-quote': {
      color: claudexLightColors.AccentCyan,
      fontStyle: 'italic',
    },
    'hljs-string': {
      color: claudexLightColors.AccentGreen,
    },
    'hljs-constant': {
      color: claudexLightColors.AccentCyan,
    },
    'hljs-number': {
      color: claudexLightColors.AccentPurple,
    },
    'hljs-keyword': {
      color: claudexLightColors.AccentYellow,
    },
    'hljs-selector-tag': {
      color: claudexLightColors.AccentYellow,
    },
    'hljs-attribute': {
      color: claudexLightColors.AccentYellow,
    },
    'hljs-variable': {
      color: claudexLightColors.Foreground,
    },
    'hljs-variable.language': {
      color: claudexLightColors.LightBlue,
      fontStyle: 'italic',
    },
    'hljs-title': {
      color: claudexLightColors.AccentBlue,
    },
    'hljs-section': {
      color: claudexLightColors.AccentGreen,
      fontWeight: 'bold',
    },
    'hljs-type': {
      color: claudexLightColors.LightBlue,
    },
    'hljs-class .hljs-title': {
      color: claudexLightColors.AccentBlue,
    },
    'hljs-tag': {
      color: claudexLightColors.LightBlue,
    },
    'hljs-name': {
      color: claudexLightColors.AccentBlue,
    },
    'hljs-builtin-name': {
      color: claudexLightColors.AccentYellow,
    },
    'hljs-meta': {
      color: claudexLightColors.AccentYellow,
    },
    'hljs-symbol': {
      color: claudexLightColors.AccentRed,
    },
    'hljs-bullet': {
      color: claudexLightColors.AccentYellow,
    },
    'hljs-regexp': {
      color: claudexLightColors.AccentCyan,
    },
    'hljs-link': {
      color: claudexLightColors.LightBlue,
    },
    'hljs-deletion': {
      color: claudexLightColors.AccentRed,
    },
    'hljs-addition': {
      color: claudexLightColors.AccentGreen,
    },
    'hljs-emphasis': {
      fontStyle: 'italic',
    },
    'hljs-strong': {
      fontWeight: 'bold',
    },
    'hljs-literal': {
      color: claudexLightColors.AccentCyan,
    },
    'hljs-built_in': {
      color: claudexLightColors.AccentRed,
    },
    'hljs-doctag': {
      color: claudexLightColors.AccentRed,
    },
    'hljs-template-variable': {
      color: claudexLightColors.AccentCyan,
    },
    'hljs-selector-id': {
      color: claudexLightColors.AccentRed,
    },
  },
  claudexLightColors,
  lightSemanticColors,
);
