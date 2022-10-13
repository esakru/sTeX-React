import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import { Box, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { localStore } from '@stex-react/utils';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { DeckAndVideoInfo } from '../shared/slides';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';

function ToggleResolution({
  audioOnly,
  setAudioOnly,
  resolution,
  setResolution,
  availableResolutions,
}: {
  audioOnly: boolean;
  setAudioOnly: Dispatch<SetStateAction<boolean>>;
  resolution: number;
  setResolution: Dispatch<SetStateAction<number>>;
  availableResolutions: number[];
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  return (
    <Box
      display="inline-block"
      border={audioOnly ? undefined : '1px solid #CCC'}
    >
      <IconButton onClick={() => setAudioOnly((v) => !v)}>
        <Tooltip title={audioOnly ? 'Show Video' : 'Audio Only'}>
          {audioOnly ? <VideocamIcon /> : <VideocamOffIcon />}
        </Tooltip>
      </IconButton>
      {!audioOnly && (
        <>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <SettingsIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {availableResolutions.map((res) => (
              <MenuItem key={res} onClick={() => setResolution(res)}>
                <CheckIcon
                  fontSize="small"
                  sx={{ color: res === resolution ? undefined : '#00000000' }}
                />
                &nbsp;{res}p
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Box>
  );
}

function getAvailableRes(info?: DeckAndVideoInfo) {
  if (!info) return [];
  return Object.keys(info)
    .map((k) => {
      if (k.startsWith('r') && info[k]) return +k.slice(1);
    })
    .filter((v) => !!v)
    .sort((a, b) => a - b);
}

function getVideoId(
  info: DeckAndVideoInfo,
  needRes: number,
  availableRes: number[]
) {
  if (!availableRes?.length) return;
  const res = availableRes.includes(needRes) ? needRes : availableRes[0];
  return info[`r${res}`];
}

export function MediaItem({
  audioOnly,
  videoId,
  timestampSec,
}: {
  audioOnly: boolean;
  videoId: string;
  timestampSec: number;
}) {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  useEffect(() => {
    if (timestampSec) mediaRef.current.currentTime = timestampSec;
  }, [timestampSec]);
  if (audioOnly) {
    return (
      <audio
        autoPlay={true}
        src={videoId}
        preload="auto"
        controls
        onLoadedMetadata={() => {
          if (timestampSec) mediaRef.current.currentTime = timestampSec;
        }}
        style={{ width: '100%', background: '#f1f3f4' }}
        ref={mediaRef}
      ></audio>
    );
  }
  return (
    <video
      autoPlay={true}
      src={videoId}
      preload="auto"
      controls
      onLoadedMetadata={() => {
        if (timestampSec) mediaRef.current.currentTime = timestampSec;
      }}
      style={{
        width: '100%',
        height: '100%',
        border: '1px solid black',
        borderRadius: '5px',
      }}
      ref={mediaRef as any}
    ></video>
  );
}

export function VideoDisplay({ deckInfo }: { deckInfo: DeckAndVideoInfo }) {
  const [resolution, setResolution] = useState(720);
  const [audioOnly, setAudioOnly] = useState(false);
  const availableRes = getAvailableRes(deckInfo);
  const videoId = getVideoId(deckInfo, resolution, availableRes);

  useEffect(() => {
    setResolution(+(localStore?.getItem('defaultResolution') || '720'));
    setAudioOnly(localStore?.getItem('audioOnly') === true.toString());
  }, []);
  if (!videoId) return <i>Video not available for this section</i>;
  return (
    <>
      <MediaItem
        videoId={videoId}
        timestampSec={deckInfo?.timestampSec}
        audioOnly={audioOnly}
      />
      <Box sx={{ m: '-4px 0 5px' }}>
        <ToggleResolution
          audioOnly={audioOnly}
          setAudioOnly={(audioOnly: boolean) => {
            setAudioOnly(audioOnly);
            localStore?.setItem('audioOnly', audioOnly.toString());
          }}
          resolution={resolution}
          setResolution={(res: number) => {
            setResolution(res);
            localStore?.setItem('defaultResolution', res.toString());
          }}
          availableResolutions={availableRes}
        />
      </Box>
    </>
  );
}
