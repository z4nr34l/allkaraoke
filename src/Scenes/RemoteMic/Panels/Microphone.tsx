import styled from '@emotion/styled';
import { typography } from 'Elements/cssMixins';
import styles from 'Scenes/Game/Singing/GameOverlay/Drawing/styles';
import SimplifiedMic from 'Scenes/Game/Singing/Input/SimplifiedMic';
import Connect from 'Scenes/RemoteMic/Panels/Microphone/Connect';
import RemoteMicKeyboard from 'Scenes/RemoteMic/Panels/Microphone/Keyboard';
import MicPreview from 'Scenes/RemoteMic/Panels/Microphone/MicPreview';
import Ping from 'Scenes/RemoteMic/Panels/Microphone/Ping';
import { ConnectionStatuses } from 'Scenes/RemoteMic/RemoteMic';
import UserMediaEnabled from 'UserMedia/UserMediaEnabled';
import { PeerErrorType } from 'interfaces';
import { useEffect, useRef } from 'react';
import isDev from 'utils/isDev';

interface Props {
    roomId: string;
    connectionStatus: ConnectionStatuses;
    connectionError?: PeerErrorType;
    isKeepAwakeOn: boolean;
    setIsKeepAwakeOn: (keepAwake: boolean) => void;
    monitoringStarted: boolean;
    setMonitoringStarted: (micMonitoring: boolean) => void;
}

function Microphone({
    roomId,
    monitoringStarted,
    setMonitoringStarted,
    isKeepAwakeOn,
    setIsKeepAwakeOn,
    connectionError,
    connectionStatus,
}: Props) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const onConnect = async () => {
        setIsKeepAwakeOn(true);

        try {
            if (!isDev()) {
                await document.body.requestFullscreen();
                window.screen.orientation.unlock();
                await window.screen.orientation.lock('portrait');
            }
        } catch (e) {
            console.warn(e);
        }
    };

    const isConnected = connectionStatus === 'connected';

    const micPreview = <MicPreview isVisible isMicOn={monitoringStarted} isConnected={isConnected} />;

    return (
        <>
            <UserMediaEnabled
                showImages={false}
                fallback={
                    <>
                        {micPreview}
                        <h2>Please allow access to the microphone.</h2>
                    </>
                }>
                <Panel>
                    <MicPreview isVisible isMicOn={monitoringStarted} isConnected={isConnected} />
                    <Connect
                        roomId={roomId}
                        isVisible={true}
                        connectionStatus={connectionStatus}
                        onConnect={onConnect}
                        connectionError={connectionError}
                    />
                </Panel>
                <Panel>
                    <RemoteMicKeyboard />
                    <KeepAwake onClick={() => setIsKeepAwakeOn(!isKeepAwakeOn)}>
                        WakeLock: <strong>{isKeepAwakeOn ? 'ON' : 'OFF'}</strong>
                    </KeepAwake>
                    <MicInputState
                        onClick={() =>
                            monitoringStarted
                                ? SimplifiedMic.stopMonitoring()
                                : SimplifiedMic.startMonitoring(undefined)
                        }>
                        Microphone: <strong data-test="monitoring-state">{monitoringStarted ? 'ON' : 'OFF'}</strong>
                    </MicInputState>
                    {isConnected && (
                        <KeepAwake>
                            Ping: <Ping />
                        </KeepAwake>
                    )}
                </Panel>
            </UserMediaEnabled>
        </>
    );
}
export default Microphone;

const Panel = styled.div`
    flex: 1;

    @media (max-height: 500px) and (min-aspect-ratio: 16/10) {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
`;

const MicInputState = styled.div`
    ${typography}
    strong {
        color: ${styles.colors.text.active};
    }
    align-self: flex-end;
`;
const KeepAwake = styled(MicInputState)``;
