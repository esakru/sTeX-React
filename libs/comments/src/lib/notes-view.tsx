import { Refresh } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { Comment, getUserInfo } from '@stex-react/api';
import { FileLocation } from '@stex-react/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getPrivateNotes, refreshAllComments } from './comment-store-manager';
import { CommentReply } from './CommentReply';
import styles from './comments.module.scss';
import { CommentView } from './CommentView';
import { getLocaleObject } from './lang/utils';

export function NotesView({
  file,
  selectedText = undefined,
  selectedElement = undefined,
  allNotesMode = false,
}: {
  file: FileLocation;
  selectedText?: string;
  selectedElement?: any;
  allNotesMode?: boolean;
}) {
  const t = getLocaleObject(useRouter());
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState([] as Comment[]);

  const refreshNotes = () => {
    refreshAllComments().then((_) => {
      getPrivateNotes(file).then((c) => setNotes(c));
    });
  };
  useEffect(() => {
    getUserInfo().then((info) => setUserId(info?.userId));
  }, []);
  useEffect(() => {
    if (!userId) return;
    getPrivateNotes(file).then((c) => setNotes(c));
  }, [file?.archive, file?.filepath, userId]);

  if (!userId)
    return (
      <Box m="10px">
        <i>
          <a
            href={'/login?target=' + encodeURIComponent(window.location.href)}
            style={{ textDecoration: 'underline' }}
          >
            <b>{t.loginForNotes}</b>
          </a>
        </i>
      </Box>
    );

  return (
    <div>
      <div className={styles['header']}>
        <span style={{ marginBottom: '2px' }}>{notes.length} notes</span>
        <Box>
          <IconButton onClick={() => refreshNotes()}>
            <Refresh />
          </IconButton>
        </Box>
      </div>

      <hr style={{ margin: '0 0 15px' }} />
      {!allNotesMode && (
        <CommentReply
          placeholder={t.createPrivate}
          parentId={0}
          file={file}
          isPrivateNote={true}
          selectedText={selectedText}
          selectedElement={selectedElement}
          onUpdate={() => refreshNotes()}
          onCancel={undefined}
        />
      )}

      {notes.map((note) => (
        <CommentView
          key={note.commentId}
          comment={note}
          onUpdate={() => refreshNotes()}
        />
      ))}
    </div>
  );
}
