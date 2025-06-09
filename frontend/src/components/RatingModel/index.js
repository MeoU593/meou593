import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useDispatch, useSelector } from 'react-redux';
import { dialogClose, dialogRatingClose } from '../../redux/action';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
    color: "#393C49",
  },
}));

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
    label: 'Very Dissatisfied',
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: 'Neutral',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: 'Satisfied',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: 'Very Satisfied',
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function RadioGroupRating({onRating}) {
    const state = useSelector(state => state.dialogRatingAction);
    const [value, setValue] = React.useState();
    const open = state.status;
    const dispatch = useDispatch();
  return (
   

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => dispatch(dialogRatingClose())}
        aria-describedby="alert-dialog-slide-description"
        sx={{
            "& .MuiPaper-root": {
              backgroundColor: "#1f1d2b", // Màu nền tùy chỉnh
              color: '#fff'
            },
          }}
      >
        <DialogTitle>{" Đánh giá đơn hàng này"}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{display: 'flex', justifyContent: 'center'}} color='#fff' id="alert-dialog-slide-description">
         
          <StyledRating
      name="highlight-selected-only"
      defaultValue={5}
      IconContainerComponent={IconContainer}
      onChange={(e) => setValue(e.target.value)}
      getLabelText={(value) => customIcons[value].label}
      highlightSelectedOnly
    />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(dialogRatingClose())}>Hủy</Button>
          <Button onClick={() => onRating(state, value)}>Đánh giá</Button>
        </DialogActions>
      </Dialog>
  );
}