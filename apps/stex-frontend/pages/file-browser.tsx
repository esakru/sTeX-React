import { FileBrowser } from '@stex-react/stex-react-renderer';
import { PathToArticle } from '@stex-react/utils';
import type { NextPage } from 'next';
import ROOT_NODES from '../file-structure.preval';
import MainLayout from '../layouts/MainLayout';

const Browser: NextPage = () => {
  return (
    <MainLayout title="sTeX File Browser | VoLL-KI">
      <FileBrowser
        defaultRootNodes={ROOT_NODES}
        topOffset={64}
        standaloneLink={PathToArticle}
      />
    </MainLayout>
  );
};

export default Browser;
