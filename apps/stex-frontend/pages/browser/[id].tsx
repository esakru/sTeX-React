import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { IndexNode, StexReactRenderer } from '@stex-react/stex-react-renderer';
import {
  convertHtmlStringToPlain,
  DEFAULT_BASE_URL,
  getSectionInfo,
  simpleHash,
} from '@stex-react/utils';
import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
interface DashFromServer {
  archive: string;
  filepath: string;
  titleAsHtml: string;
  children: DashFromServer[];
}

function createHash({ archive = '', filepath = '' }) {
  return simpleHash(`${archive}||${filepath}`);
}

function getDashInfo(
  dashFromServer: DashFromServer,
  parentNode = undefined as IndexNode
): IndexNode | undefined {
  const title = convertHtmlStringToPlain(dashFromServer.titleAsHtml).trim();
  if (!title?.length && parentNode) return;
  const hash = createHash(dashFromServer);
  const childNodes = new Map<string, IndexNode>();
  const node = {
    hash,
    title,
    parentNode,
    childNodes,
  };

  for (const c of dashFromServer.children) {
    const childIndexNode = getDashInfo(c, node);
    if (childIndexNode) childNodes.set(childIndexNode.hash, childIndexNode);
  }
  return node;
}

const BrowserPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const [contentUrl, setContentUrl] = useState(undefined as string);
  const [dashInfo, setDashInfo] = useState(undefined as IndexNode);
  const [continuous, setContinuous] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    const decoded = decodeURI(id);
    const url = decoded.startsWith(':sTeX')
      ? DEFAULT_BASE_URL + '/' + decoded
      : decoded;
    setContentUrl(url);
    const { archive, filepath } = getSectionInfo(url);
    const contentDashUrl = `/api/get-content-dash/${encodeURIComponent(
      archive
    )}/${encodeURIComponent(filepath)}`;
    axios.get(contentDashUrl).then((r) => {
      console.log(r.data);
      const d = r.data ? getDashInfo(r.data) : undefined;
      setDashInfo(d);
    });
  }, [id, router.isReady]);
  if (!contentUrl?.length) return;

  return (
    <MainLayout title="sTeX Browser" showBrowserAutocomplete={true}>
      <FormGroup sx={{ alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={continuous}
              onChange={(e) => setContinuous(e.target.checked)}
            />
          }
          label="Continuous Mode"
        />
      </FormGroup>
      <StexReactRenderer
        contentUrl={contentUrl}
        topOffset={64}
        dashInfo={dashInfo}
        expandOnVisible={continuous}
      />
    </MainLayout>
  );
};

export default BrowserPage;
