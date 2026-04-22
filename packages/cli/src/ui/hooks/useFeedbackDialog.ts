import { useState, useCallback, useEffect } from 'react';
import {
  type Config,
  logUserFeedback,
  UserFeedbackEvent,
  type UserFeedbackRating,
} from '@claudex/core';
import { StreamingState, type HistoryItem } from '../types.js';
import {
  SettingScope,
  type LoadedSettings,
} from '../../config/settings.js';
import type { SessionStatsState } from '../contexts/SessionContext.js';
import { FEEDBACK_OPTIONS } from '../FeedbackDialog.js';


export interface UseFeedbackDialogProps {
  config: Config;
  settings: LoadedSettings;
  streamingState: StreamingState;
  history: HistoryItem[];
  sessionStats: SessionStatsState;
}

export const useFeedbackDialog = ({
  config,
  settings,
  streamingState,
  history,
  sessionStats,
}: UseFeedbackDialogProps) => {
  // Feedback dialog state
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isFeedbackDismissedTemporarily, setIsFeedbackDismissedTemporarily] =
    useState(false);

  const openFeedbackDialog = useCallback(() => {
    setIsFeedbackDialogOpen(true);
  }, []);

  const closeFeedbackDialog = useCallback(
    () => setIsFeedbackDialogOpen(false),
    [],
  );

  const temporaryCloseFeedbackDialog = useCallback(() => {
    setIsFeedbackDialogOpen(false);
    setIsFeedbackDismissedTemporarily(true);
  }, []);

  const submitFeedback = useCallback(
    (rating: number) => {
      // Only create and log feedback event for ratings 1-3 (GOOD, BAD, FINE)
      // Rating 0 (DISMISS) should not trigger any telemetry
      if (rating >= FEEDBACK_OPTIONS.GOOD && rating <= FEEDBACK_OPTIONS.FINE) {
        const feedbackEvent = new UserFeedbackEvent(
          sessionStats.sessionId,
          rating as unknown as UserFeedbackRating,
          config.getModel(),
          config.getApprovalMode(),
        );

        logUserFeedback(config, feedbackEvent);
      }

      // Record the timestamp when feedback dialog is submitted
      settings.setValue(
        SettingScope.User,
        'ui.feedbackLastShownTimestamp',
        Date.now(),
      );

      closeFeedbackDialog();
    },
    [closeFeedbackDialog, sessionStats.sessionId, config, settings],
  );

  // Reset temporary dismissal when a new AI response starts streaming
  useEffect(() => {
    if (
      streamingState === StreamingState.Responding &&
      isFeedbackDismissedTemporarily
    ) {
      setIsFeedbackDismissedTemporarily(false);
    }
  }, [streamingState, isFeedbackDismissedTemporarily]);

  return {
    isFeedbackDialogOpen,
    openFeedbackDialog,
    closeFeedbackDialog,
    temporaryCloseFeedbackDialog,
    submitFeedback,
  };
};
