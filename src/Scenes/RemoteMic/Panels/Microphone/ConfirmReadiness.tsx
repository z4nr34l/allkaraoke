import styled from '@emotion/styled';
import { MenuButton, MenuContainer } from 'Elements/Menu';
import { focused } from 'Elements/cssMixins';
import events from 'GameEvents/GameEvents';
import { useEventEffect } from 'GameEvents/hooks';
import RemoteMicClient from 'RemoteMic/Network/Client';
import { useEffect, useState } from 'react';

interface Props {
  onConfirm: () => void;
}

function ConfirmReadiness({ onConfirm }: Props) {
  const [visible, setVisible] = useState(false);
  const [isAfterReload, setIsAfterReload] = useState(false);

  // Try to predict the readiness request from the game. If the refresh request happened and after reconnection
  // The player number is set for the phone, it's likely that a readiness confirmation is needed so the button
  // is displayed even before the event comes around
  useEffect(() => {
    if (window.sessionStorage.getItem('reload-mic-request') !== null) {
      setIsAfterReload(true);
    }
  }, []);
  useEventEffect(events.remoteMicPlayerSet, () => {
    if (isAfterReload) {
      setIsAfterReload(false);
      setVisible(true);
    }
  });

  useEventEffect(events.remoteReadinessRequested, () => {
    setVisible(true);
  });
  const confirm = () => {
    RemoteMicClient.confirmReadiness();
    setVisible(false);
    onConfirm();
  };

  return visible ? (
    <Form>
      <MenuContainer>
        <ReadyButton data-test="ready-button" onClick={confirm}>
          Ready
        </ReadyButton>
      </MenuContainer>
    </Form>
  ) : null;
}
export default ConfirmReadiness;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  z-index: 1000;
`;

const ReadyButton = styled(MenuButton)`
  aspect-ratio: 1;

  ${focused};
`;
