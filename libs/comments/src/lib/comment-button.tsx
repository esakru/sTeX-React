import AddCommentIcon from '@mui/icons-material/AddComment';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Comment } from '@stex-react/api';
import { MdViewer } from '@stex-react/markdown';
import { getSectionInfo } from '@stex-react/utils';
import { useEffect, useState } from 'react';
import { getTotalComments } from './comment-helpers';
import { CommentNoteToggleView } from './comment-note-toggle-view';
import {
  getPrivateNotes,
  getPublicCommentTrees,
} from './comment-store-manager';
import { getLocaleObject } from './lang/utils';
import { useRouter } from 'next/router';

function buttonProps(backgroundColor: string) {
  return {
    zIndex: '1',
    color: 'grey',
    backgroundColor,
    mb: '3px',
    '&:hover': {
      backgroundColor,
      boxShadow: '#0005 0px 3px 7px',
    },
  };
}

export function NotesIcon({ numNotes }: { numNotes: number }) {
  return (
    <span>
      <FormatListBulletedIcon sx={{ color: 'white' }} fontSize="small" />
      <span
        style={{
          color: '#4d97dd',
          fontSize: '10px',
          position: 'absolute',
          background: 'white',
          borderRadius: '20px',
          padding: '1px',
          top: '-2px',
          right: '-4px',
        }}
      >
        {numNotes < 10 ? <>&nbsp;{numNotes}&nbsp;</> : numNotes}
      </span>
    </span>
  );
}

export function CommentsIcon({ numComments }: { numComments: number }) {
  return (
    <span>
      <ChatBubbleIcon sx={{ color: 'white' }} fontSize="small" />
      <span
        style={{
          color: '#4d97dd',
          fontSize: '10px',
          position: 'absolute',
          top: '3px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'max-content',
        }}
      >
        {numComments}
      </span>
    </span>
  );
}

export function CommentButton({ url = '' }: { url?: string }) {
  const { archive, filepath } = getSectionInfo(url);
  const [numPublicComments, setNumPublicComments] = useState(0);
  const [numPrivateNotes, setNumPrivateNotes] = useState(0);
  const [open, setOpen] = useState(false);
  const [defaultPrivate, setDefaultPrivate] = useState(true);
  const [topComment, setTopComment] = useState<Comment | undefined>(undefined);
  const [topNote, setTopNote] = useState<Comment | undefined>(undefined);
  const t = getLocaleObject(useRouter());

  useEffect(() => {
    if (!archive || !filepath) {
      setNumPublicComments(0);
      return;
    }
    getPublicCommentTrees({ archive, filepath }).then((comments) => {
      setNumPublicComments(getTotalComments(comments));
      setTopComment(comments?.[0]);
    });
    getPrivateNotes({ archive, filepath }).then((comments) => {
      setNumPrivateNotes(getTotalComments(comments));
      setTopNote(comments?.[0]);
    });
  }, [archive, filepath, open]);

  if (!archive || !filepath) return null;

  return (
    <Box>
      {numPrivateNotes > 0 && (
        <Tooltip
          title={
            <Box>
              <MdViewer content={topNote?.statement || ''} />
              {numPrivateNotes > 1 ? '..and more' : ''}
            </Box>
          }
          placement="left-start"
        >
          <IconButton
            onClick={() => {
              setDefaultPrivate(true);
              setOpen(true);
            }}
            sx={buttonProps('#4d97dd')}
          >
            <NotesIcon numNotes={numPrivateNotes} />
          </IconButton>
        </Tooltip>
      )}
      {(!numPrivateNotes || numPublicComments > 0) && (
        <Tooltip
          title={
            numPublicComments > 0 ? (
              <Box>
                <b>{topComment?.userName}</b>&nbsp;<i>says:</i>
                <MdViewer content={topComment?.statement || ''} />
                {numPublicComments > 1 ? t.andMore : ''}
              </Box>
            ) : (
              <span>
                {t.addToSlide}
                <br />
                {t.selectionSuggestion}
              </span>
            )
          }
          placement="left-start"
        >
          <IconButton
            onClick={() => {
              setDefaultPrivate(false);
              setOpen(true);
            }}
            sx={buttonProps(numPublicComments > 0 ? '#4d97dd' : 'white')}
          >
            {numPublicComments > 0 ? (
              <CommentsIcon numComments={numPublicComments} />
            ) : (
              <AddCommentIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      )}
      {open && (
        <Dialog onClose={() => setOpen(false)} open={open} maxWidth="lg">
          <CommentNoteToggleView
            defaultPrivate={defaultPrivate}
            file={{ archive, filepath }}
          />
          <DialogActions sx={{ p: '0' }}>
            <Button onClick={() => setOpen(false)}>{t.close}</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
