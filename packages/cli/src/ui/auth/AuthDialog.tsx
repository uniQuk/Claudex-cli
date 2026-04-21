/**
 * @license
 * Copyright 2025 Claudex CLI contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { useState } from 'react';
import { AuthType } from '@claudex/core';
import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
import { useKeypress } from '../hooks/useKeypress.js';
import { DescriptiveRadioButtonSelect } from '../components/shared/DescriptiveRadioButtonSelect.js';
import { useUIState } from '../contexts/UIStateContext.js';
import { useUIActions } from '../contexts/UIActionsContext.js';
import { useConfig } from '../contexts/ConfigContext.js';
import { t } from '../../i18n/index.js';

type ViewLevel = 'main' | 'custom-info';

function parseDefaultAuthType(
  defaultAuthType: string | undefined,
): AuthType | null {
  if (
    defaultAuthType &&
    Object.values(AuthType).includes(defaultAuthType as AuthType)
  ) {
    return defaultAuthType as AuthType;
  }
  return null;
}

export function AuthDialog(): React.JSX.Element {
  const { pendingAuthType, authError } = useUIState();
  const { handleAuthSelect: onAuthSelect, onAuthError } = useUIActions();
  const config = useConfig();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewLevel, setViewLevel] = useState<ViewLevel>('main');

  const mainItems = [
    {
      key: AuthType.USE_OPENAI,
      title: t('OpenAI-compatible API'),
      label: t('OpenAI-compatible API'),
      description: t(
        'LM Studio, Ollama, OpenAI, DeepSeek, OpenRouter — any OpenAI-compatible endpoint',
      ),
      value: AuthType.USE_OPENAI,
    },
    {
      key: AuthType.USE_ANTHROPIC,
      title: t('Anthropic'),
      label: t('Anthropic'),
      description: t('Claude models via the Anthropic API'),
      value: AuthType.USE_ANTHROPIC,
    },
  ];

  const initialAuthIndex = Math.max(
    0,
    mainItems.findIndex((item) => {
      if (pendingAuthType) return item.value === pendingAuthType;
      const currentAuthType = config.getAuthType();
      if (currentAuthType) return item.value === currentAuthType;
      const defaultAuthType = parseDefaultAuthType(
        process.env['CLAUDEX_DEFAULT_AUTH_TYPE'],
      );
      if (defaultAuthType) return item.value === defaultAuthType;
      return item.value === AuthType.USE_OPENAI;
    }),
  );

  const handleMainSelect = async (value: AuthType) => {
    setErrorMessage(null);
    onAuthError(null);
    await onAuthSelect(value);
    setViewLevel('custom-info');
  };

  const handleGoBack = () => {
    setErrorMessage(null);
    onAuthError(null);
    setViewLevel('main');
  };

  useKeypress(
    (key) => {
      if (key.name === 'escape') {
        if (viewLevel !== 'main') {
          handleGoBack();
          return;
        }
        if (errorMessage) return;
        if (config.getAuthType() === undefined) {
          setErrorMessage(
            t(
              'You must select an auth method to proceed. Press Ctrl+C again to exit.',
            ),
          );
          return;
        }
        onAuthSelect(undefined);
      }
    },
    { isActive: true },
  );

  const renderMainView = () => (
    <Box marginTop={1}>
      <DescriptiveRadioButtonSelect
        items={mainItems}
        initialIndex={initialAuthIndex}
        onSelect={handleMainSelect}
        itemGap={1}
      />
    </Box>
  );

  const renderCustomInfoView = () => (
    <>
      <Box marginTop={1}>
        <Text color={theme.text.primary}>
          {t(
            'Configure your provider in ~/.claudex/settings.json using the modelProviders key.',
          )}
        </Text>
      </Box>
      <Box marginTop={1}>
        <Text color={theme.text.secondary}>
          {t(
            'OpenAI-compatible: set OPENAI_API_KEY and OPENAI_BASE_URL environment variables.',
          )}
        </Text>
      </Box>
      <Box marginTop={1}>
        <Text color={theme.text.secondary}>
          {t('Anthropic: set ANTHROPIC_API_KEY and ANTHROPIC_BASE_URL.')}
        </Text>
      </Box>
      <Box marginTop={1}>
        <Text color={theme.text.secondary}>{t('Esc to go back')}</Text>
      </Box>
    </>
  );

  const getViewTitle = () => {
    switch (viewLevel) {
      case 'main':
        return t('Select API Provider');
      default:
        return t('Provider Configuration');
    }
  };

  return (
    <Box
      borderStyle="single"
      borderColor={theme?.border?.default}
      flexDirection="column"
      padding={1}
      width="100%"
    >
      <Text bold>{getViewTitle()}</Text>
      {viewLevel === 'main' && renderMainView()}
      {viewLevel === 'custom-info' && renderCustomInfoView()}
      {(authError || errorMessage) && (
        <Box marginTop={1}>
          <Text color={theme.status.error}>{authError || errorMessage}</Text>
        </Box>
      )}
      {viewLevel === 'main' && (
        <Box marginTop={1}>
          <Text color={theme.text.secondary}>
            {t('Enter to select, \u2191\u2193 to navigate')}
          </Text>
        </Box>
      )}
    </Box>
  );
}
