import styled from '@emotion/styled';
import styles from 'Scenes/Game/Singing/GameOverlay/Drawing/styles';

interface Props {
  number: number | null;
}

export default function PlayerNumberCircle({ number, ...restProps }: Props) {
  return (
    <PlayerColorCircle
      style={{
        background: number !== null ? styles.colors.players[number].perfect.fill : styles.colors.text.inactive,
      }}
      {...restProps}
    />
  );
}

const PlayerColorCircle = styled.div`
  display: inline-block;
  width: 1em;
  height: 1em;
  aspect-ratio: 1;
  border-radius: 1em;
`;
