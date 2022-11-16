import { Box, Button, ButtonGroup, TextField, Typography } from '@mui/material';
import { PlayerRef } from '../../Game/Singing/Player';
import { msec } from '../Helpers/formatMs';

interface Props {
    onChange: (shift: number) => void;
    current: number;
    player: PlayerRef;
    finalGap: number;
}

export default function ShiftGap({ current, onChange, player, finalGap }: Props) {
    return (
        <Box sx={{ flex: 1 }}>
            <Typography variant={'h6'}>Gap shift (final: {msec(finalGap, player)})</Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <ButtonGroup sx={{ flex: 1 }}>
                    <Button sx={{ flex: 1, px: 1 }} onClick={() => onChange(current - 1000)}>
                        -1000
                    </Button>
                    <Button sx={{ flex: 1, px: 1 }} onClick={() => onChange(current - 500)}>
                        -500
                    </Button>
                    <Button sx={{ flex: 1, px: 1 }} onClick={() => onChange(current - 50)}>
                        -50
                    </Button>
                </ButtonGroup>
                <TextField
                    sx={{ py: 0, flex: 1 }}
                    size={'small'}
                    type="text"
                    value={current}
                    onChange={(e) => onChange(+e.target.value)}
                    label="Miliseconds"
                />
                <ButtonGroup sx={{ flex: 1 }}>
                    <Button sx={{ flex: 1, px: 1 }} onClick={() => onChange(current + 50)}>
                        +50
                    </Button>
                    <Button sx={{ flex: 1, px: 1 }} onClick={() => onChange(current + 500)}>
                        +500
                    </Button>
                    <Button sx={{ flex: 1, px: 1 }} onClick={() => onChange(current + 1000)}>
                        +1000
                    </Button>
                </ButtonGroup>
            </Box>
        </Box>
    );
}
