import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import {
  fakeLoginUsingRedirect,
  isLoggedIn,
  loginUsingRedirect,
  logout
} from '@stex-react/api';
import { BG_COLOR, IS_SERVER, localStore } from '@stex-react/utils';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useReducer, useState } from 'react';
import { getLocaleObject } from '../lang/utils';
import MainLayout from '../layouts/MainLayout';
import styles from '../styles/utils.module.scss';

const PresetPersonas = [
  { label: 'sabrina', info: 'FAU CS student' },
  { label: 'joy', info: 'Engineering background' },
  { label: 'anushka', info: 'Philosophy background' },
  { label: 'blank', info: 'Empty learner model' },
];

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function PersonaChooser({
  persona,
  label,
  onPersonaUpdate,
}: {
  persona: string;
  label: string;
  onPersonaUpdate: (label: string) => void;
}) {
  return (
    <FormControl>
      <InputLabel>{label}</InputLabel>
      <Select
        value={persona}
        onChange={(e) => {
          const label = e.target.value;
          onPersonaUpdate(label);
        }}
        variant="standard"
        sx={{ minWidth: '130px' }}
      >
        {PresetPersonas.map((persona) => (
          <MenuItem key={persona.label} value={persona.label}>
            {persona.label}&nbsp;<i>({persona.info})</i>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export function GuestLogin({ returnBackUrl }: { returnBackUrl: string }) {
  const router = useRouter();
  const {
    login: { guest: t },
  } = getLocaleObject(router);

  const [persona, setProfileLabel] = useState<string>('sabrina');
  const [guestId, setGuestId] = useState<string>('sabrina');
  const [guestUserName, setGuestUserName] = useState<string>('Sabrina');
  const [enableGuest, setEnableGuest] = useState(false);

  return (
    <>
      {!enableGuest && (
        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{ fontSize: '32x', my: '10px' }}
          onClick={() => setEnableGuest(true)}
        >
          {t.entryButton}
        </Button>
      )}
      <Box
        sx={{
          transition: 'height ease 500ms;',
          height: enableGuest ? '240px' : '0px',
          overflow: 'hidden',
          border: enableGuest ? '1px solid #AAA' : 'undefined',
          padding: enableGuest ? '5px' : 0,
          borderRadius: '10px',
          my: enableGuest ? '10px' : 0,
        }}
      >
        <Box display="flex" alignItems="baseline" gap="10px">
          <PersonaChooser
            label={t.personaSelect}
            persona={persona}
            onPersonaUpdate={(label: string) => {
              setProfileLabel(label);
              for (const p of PresetPersonas) {
                if (p.label === label) {
                  setGuestId(p.label);
                  setGuestUserName(capitalizeFirstLetter(p.label));
                }
              }
            }}
          />
          <TextField
            label={t.guestIdText}
            value={guestId}
            onChange={(e) => setGuestId(e.target.value)}
            variant="standard"
            margin="dense"
            sx={{ flexGrow: '1' }}
          />
        </Box>
        <TextField
          label={t.guestNameText}
          value={guestUserName}
          onChange={(e) => setGuestUserName(e.target.value)}
          variant="standard"
          margin="dense"
          fullWidth
        />

        <Typography color="#777" variant="body2" mt="10px">
          {t.chooseLearnerHelperText}
        </Typography>
        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{ fontSize: '32x', mt: '5px' }}
          onClick={() => {
            let browserInstance = localStore.getItem('browser-instance');
            if (!browserInstance) {
              browserInstance = `${Math.floor(Math.random() * 1e7)}`;
              localStore.setItem('browser-instance', browserInstance);
            }
            const fakeId = `guest_${browserInstance}_${guestId}`;
            const guestName = 'Guest: ' + guestUserName;
            fakeLoginUsingRedirect(fakeId, guestName, returnBackUrl, persona);
          }}
          disabled={!guestId?.length}
        >
          {t.loginButton}
        </Button>
      </Box>

      <Typography color="#777" variant="body2">
        {t.encourage}
      </Typography>
    </>
  );
}
const LoginPage: NextPage = () => {
  const loggedIn = isLoggedIn();
  const router = useRouter();
  const [fakeId, setFakeId] = useState('');
  const returnBackUrl = router.query.target as string;
  const [clickCount, updateClickCount] = useReducer((x) => x + 1, 0);
  const fakeLogin = clickCount >= 1;
  const { login: t } = getLocaleObject(router);

  if (loggedIn && !IS_SERVER) router.push('/');
  return (
    <MainLayout>
      <br />
      <Box sx={{ m: 'auto', maxWidth: '700px', px: '10px' }}>
        <Box
          sx={{
            p: '1.5rem',
            borderRadius: '0.3rem',
            border: '1px solid #dee2e6',
            backgroundColor: BG_COLOR,
          }}
        >
          <br />
          {!loggedIn && fakeLogin && (
            <Autocomplete
              id="free-solo-demo"
              freeSolo
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.label
              }
              inputValue={fakeId}
              onInputChange={(event, newInputValue) => {
                setFakeId(newInputValue);
              }}
              sx={{ my: '10px' }}
              options={PresetPersonas}
              renderInput={(params) => <TextField {...params} label="FakeId" />}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  {option.label}&nbsp;<i>({option.info})</i>
                </Box>
              )}
            />
          )}
          {loggedIn ? (
            <>
              {t.alreadyLoggedIn}
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ w: '100%' }}
                onClick={() => logout()}
              >
                {t.logout}
              </Button>
            </>
          ) : (
            <>
              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{ fontSize: '32x' }}
                onClick={() => {
                  if (fakeLogin) {
                    if (fakeId)
                      fakeLoginUsingRedirect(fakeId, undefined, returnBackUrl);
                  } else {
                    loginUsingRedirect(returnBackUrl);
                  }
                }}
              >
                {fakeLogin ? t.fakeLogin : t.fauLogin}
              </Button>
              <span
                style={{
                  fontFamily: 'Roboto',
                  color: '#777',
                  marginTop: '10px',
                }}
              >
                <hr style={{ width: '90%' }} />
                <span
                  style={{ display: 'inline' }}
                  onDoubleClick={updateClickCount}
                >
                  {t.rememberLogout}
                </span>

                <br />
                <br />
                <i style={{ color: 'red' }}>{t.logoutWarning}</i>
              </span>

              {!loggedIn && <GuestLogin returnBackUrl={returnBackUrl} />}
              <br />
              <Box className={styles['descriptive-box']}>
                {t.notesHeader}
                <ul>
                  <li>{t.notesPoint1}</li>
                  <li>{t.notesPoint2}</li>
                  <li>{t.notesPoint3}</li>
                  <li>
                    {t.notesPoint4}:&nbsp;
                    <a
                      href="https://gitos.rrze.fau.de/voll-ki/fau/SSFC/-/wikis/home"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Link
                    </a>
                  </li>
                </ul>
              </Box>
            </>
          )}
        </Box>
        <br />
      </Box>
    </MainLayout>
  );
};

export default LoginPage;
