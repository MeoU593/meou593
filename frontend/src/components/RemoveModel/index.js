import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dialogClose } from '../../redux/action';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({onRemove}) {
  const state = useSelector(state => state.dialogAction);
  const open = state.status;
  const dispatch = useDispatch();

  return (
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => dispatch(dialogClose())}
        aria-describedby="alert-dialog-slide-description"
        sx={{
            "& .MuiPaper-root": {
              backgroundColor: "#1f1d2b", // Màu nền tùy chỉnh
              color: '#fff'
            },
          }}
      >
        <DialogTitle>{"Warning"}</DialogTitle>
        <DialogContent>
          <DialogContentText color='#fff' id="alert-dialog-slide-description">
          Bạn có chắc chắn muốn xóa món ăn này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(dialogClose())}>Hủy</Button>
          <Button onClick={() => onRemove(state)}>Xóa</Button>
        </DialogActions>
      </Dialog>
  );
}