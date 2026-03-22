import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface MessageBannerProps {
  message: { type: 'success' | 'error'; text: string } | null;
}

export function MessageBanner({ message }: MessageBannerProps) {
  if (!message) return null;

  return (
    <div
      css={css`
        padding: 10px 14px; border-radius: 10px;
        background: ${message.type === 'success' ? colors.blue50 : colors.red50};
        display: flex; align-items: center; gap: 8px;
      `}
    >
      <Text
        typography="t7"
        fontWeight="medium"
        color={message.type === 'success' ? colors.blue600 : colors.red500}
      >
        {message.text}
      </Text>
    </div>
  );
}
