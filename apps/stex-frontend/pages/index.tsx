import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Button, IconButton } from '@mui/material';
import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BrowserAutocomplete } from '../components/BrowserAutocomplete';
import { SearchBar } from '../components/SearchBar';
import { ToursAutocomplete } from '../components/ToursAutocomplete';
import MainLayout from '../layouts/MainLayout';

const Home: NextPage = () => {
  return (
    <MainLayout title="VoLL-KI Home">
      <IconButton sx={{ float: 'right' }}>
        <Link href="/settings">
          <SettingsIcon />
        </Link>
      </IconButton>
      <Box textAlign="center" m="20px">
        <Image src="/voll-ki.png" alt="VoLL-KI Logo" width={650} height={300} />
      </Box>
      <div>
        <main style={{ margin: '10px' }}>
          <Box m="10px auto" maxWidth="600px" textAlign="center">
            <SearchBar />
            <br />
            <br />
            <Link href="/file-browser">
              <Button variant="contained">View article browser</Button>
            </Link>
            <br />
            <br />
            <Link href="/quiz">
              <Button variant="contained">Quiz Demo</Button>
            </Link>
            <br />
            <br />
            <BrowserAutocomplete />
            <ToursAutocomplete />
          </Box>
        </main>
      </div>
    </MainLayout>
  );
};

export default Home;
