import styled from '@emotion/styled';
import { Input } from 'Elements/Input';
import { MenuButton } from 'Elements/Menu';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import events from 'Scenes/Game/Singing/GameState/GameStateEvents';
import createPersistedState from 'use-persisted-state';
import WebRTCClient from 'RemoteMic/Network/WebRTCClient';
import { Wifi } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

interface Props {
    roomId: string;
    isVisible: boolean;
    connectionStatus: Parameters<typeof events.karaokeConnectionStatusChange.dispatch>[0] | 'uninitialised';
    onConnect: () => void;
}

const usePersistedName = createPersistedState<string>('remote_mic_name');

function Connect({ isVisible, roomId, connectionStatus, onConnect }: Props) {
    const [name, setName] = usePersistedName('');
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const disabled = connectionStatus !== 'uninitialised';

    const handleConnect: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        WebRTCClient.connect(roomId, name);
        try {
            process.env.NODE_ENV !== 'development' && document.body.requestFullscreen().catch(console.info);
        } catch (e) {}
        onConnect();
    };

    const [showConnectionTip, setShowConnectionTip] = useState(false);

    useEffect(() => {
        setShowConnectionTip(false);
        if (connectionStatus === 'connecting' || connectionStatus === 'reconnecting') {
            const timeout = setTimeout(() => setShowConnectionTip(true), 2000);

            return () => clearTimeout(timeout);
        }
    }, [connectionStatus]);

    return isVisible ? (
        <>
            <Form onSubmit={handleConnect}>
                <Input
                    focused={false}
                    label="Name"
                    value={name}
                    onChange={setName}
                    ref={inputRef}
                    disabled={disabled}
                    autoFocus
                    data-test="player-name-input"
                />
                <MenuButton type="submit" disabled={disabled || name === ''} data-test="connect-button">
                    {connectionStatus === 'connecting' && <CircularProgress size={'1em'} />}
                    {connectionStatus === 'uninitialised' ? 'Connect' : connectionStatus.toUpperCase()}
                </MenuButton>
                {showConnectionTip && (
                    <>
                        <h3>If it doesn't connect</h3>
                        <h5>
                            Make sure you are in the same <Wifi /> Wi-Fi
                        </h5>
                        <h5>Refresh (F5) the Karaoke on the PC</h5>
                    </>
                )}
            </Form>
        </>
    ) : null;
}
export default Connect;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;