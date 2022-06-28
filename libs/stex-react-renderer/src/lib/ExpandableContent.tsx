import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined';
import { Box, IconButton } from '@mui/material';
import { useState } from 'react';
import { ContentFromUrl } from './ContentFromUrl';

export function ExpandableContent({
  contentUrl,
  title,
}: {
  contentUrl: string;
  title: any;
}) {
  const [openAtLeastOnce, setOpenAtLeastOnce] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const changeState = () => {
    setOpenAtLeastOnce(true);
    setIsOpen((v) => !v);
  };

  return (
    <Box m="4px 0">
      <Box
        display="flex"
        alignItems="center"
        sx={{ cursor: 'pointer' }}
        onClick={changeState}
      >
        <IconButton
          sx={{ color: 'gray', p: '0' }}
          onClick={(e) => {
            e.stopPropagation();
            changeState();
          }}
        >
          {isOpen ? (
            <IndeterminateCheckBoxOutlinedIcon sx={{ fontSize: '20px' }} />
          ) : (
            <AddBoxOutlinedIcon sx={{ fontSize: '20px' }} />
          )}
        </IconButton>
        <Box
          sx={{
            '&:hover': { background: '#DDD' },
            width: 'fit-content',
            px: '4px',
            ml: '-2px',
            borderRadius: '5px',
          }}
        >
          <b style={{ fontSize: 'large' }}>{title}</b>
        </Box>
      </Box>

      {openAtLeastOnce && (
        <Box hidden={!isOpen} ml="9px" pl="10px" borderLeft="1px solid #DDD">
          {/*The extra margin consumed by each layer is equal to (ml+pl) above */}
          <ContentFromUrl
            url={contentUrl}
            modifyRendered={(bodyNode) => bodyNode?.props?.children}
          />
        </Box>
      )}
    </Box>
  );
}
