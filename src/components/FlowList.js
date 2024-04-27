import React, { useEffect, useState, useRef } from "react";
import IterationControl from "./IterationControl";
import OptionInput from "./OptionInput";
import { Box } from "@mui/material";
import SendTimeExtensionIcon from "@mui/icons-material/SendTimeExtension";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AddTaskIcon from "@mui/icons-material/AddTask";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SaveIcon from "@mui/icons-material/Save";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { arrayBufferToBase64 } from "../utils/converter.js";

function FlowList({
  taskItems,
  initialTaskItems,
  dragCoords,
  clickCoords,
  className,
  className2,
}) {
  const [currentCount, setCurrentCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatCount, setRepeatCount] = useState(1);
  const [inputVisible, setInputVisible] = useState(false);
  const [flowItems, setFlowItems] = useState([]);
  const [pendingItem, setPendingItem] = useState(null);
  const [inputValues, setInputValues] = useState({});

  const [open, setOpen] = useState(false);
  const [newParam, setNewParam] = useState([]);
  const [taskOrder, setTaskOrder] = useState(0);

  /**
   * update 오픈 이벤트
   * @param {*} taskOrder
   */
  const handleClickUpdateOpen = (taskOrder) => {
    setTaskOrder(taskOrder);
    const { id, display_text, text, time, ...rest } = flowItems[taskOrder];
    const result = Object.values(rest);
    setNewParam(result);
    setOpen(true);
  };

  /**
   * update 닫기 이벤트
   */
  const handleUpdateClose = () => {
    setOpen(false);
  };

  /**
   * update 확인 이벤트
   */
  const handleUpdateConfirm = () => {
    setOpen(false);
    updateTaskItems(newParam, taskOrder);
    setNewParam("");
  };

  /**
   * 드래그 이벤트 막아주는 함수
   * @param {*} event
   */
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  /**
   * 파일로 저장하는 함수
   */
  const saveToFile = () => {
    const data = JSON.stringify({ taskItems, flowItems });
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "backup.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  /**
   * 작업을 복원하는 함수
   * @param {*} event
   */
  async function restore_tasks(event) {
    setFlowItems([]);

    const flowItems = JSON.parse(event.target.result).flowItems;
    setFlowItems(flowItems);
  }

  /**
   * 파일에서 불러오는 함수
   * @param {*} event
   * @returns
   */
  const loadFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = async (event) => {
      await restore_tasks(event);
    };

    reader.readAsText(file);
    event.target.value = "";
  };

  /**
   * 입력값 변경 이벤트
   *
   * @param {*} event
   */
  const onInputChange = (event) => {
    if (event.target.files) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setInputValues({
          ...inputValues,
          template: fileReader.result,
        });
      };
      fileReader.readAsArrayBuffer(event.target.files[0]);
    } else {
      setInputValues({
        ...inputValues,
        [event.target.name]: event.target.value,
      });
    }
  };

  const onInputChangeForCode = (event) => {
    setInputValues({
      ...inputValues,
      code: event,
    });
  };

  useEffect(() => {
    setInputValues((inputValues) => {
      if (
        pendingItem &&
        (pendingItem.text === "single_click" ||
          pendingItem.text === "long_press")
      ) {
        return { ...inputValues, ...clickCoords };
      } else if (pendingItem && pendingItem.text === "extract_text") {
        return { ...inputValues, ...dragCoords };
      } else {
        return { ...inputValues };
      }
    });
  }, [dragCoords, clickCoords, pendingItem]);

  /**
   * 입력값 확인 이벤트
   * @returns
   */
  const onInputConfirm = async () => {
    const allFieldsFilled = Object.values(inputValues).every(
      (value) => value != null && value !== ""
    );

    if (!allFieldsFilled) {
      alert("모든 필드를 채워주세요.");
      return;
    } else {
      const newItem = { ...pendingItem, ...inputValues };
      const newItemBase64 = { ...newItem };

      if (newItem.template) {
        newItemBase64.template = arrayBufferToBase64(newItem.template);
      }

      setFlowItems([...flowItems, newItemBase64]);
      setInputVisible(false);
      setPendingItem(null);
    }
  };

  /**
   * 입력값 취소 이벤트
   */
  const onInputCancel = () => {
    setInputVisible(false);
    setPendingItem(null);
  };

  /**
   * 드롭 이벤트
   * @param {*} event
   */
  const onDrop = (event) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData("text"));
    const item = { id: data.id, text: data.text };
    setInputVisible(true);
    setPendingItem(item);

    const taskItem = taskItems.find((taskItem) => taskItem.text === data.text);
    setInputValues(taskItem || {});
  };

  /**
   * 초기화 버튼 클릭 이벤트
   */
  const handleButtonClear = async () => {
    setFlowItems([]);
  };

  const stopLoopRef = useRef(false);

  /**
   * 중지 버튼 클릭 이벤트
   */
  const handleStopIconClick = () => {
    stopLoopRef.current = true;
  };

  /**
   * 실행 버튼 클릭 이벤트
   */
  const handleButtonRun = async () => {
    setIsPlaying(true);
    stopLoopRef.current = false;
    for (let i = 0; i < repeatCount; i++) {
      if (stopLoopRef.current) {
        break;
      }
      setCurrentCount(i + 1);
    }
    setCurrentCount(0);
    setIsPlaying(false);
  };

  /**
   * 작업 속성 업데이트 이벤트
   */
  const updateTaskItems = async (newParam, taskOrder) => {
    // client side update
    if (Array.isArray(newParam) || !newParam || !flowItems[taskOrder]) {
      return;
    }
    const arr = newParam
      .split(",")
      .filter((item) => item !== undefined && item !== "");
    const result = JSON.stringify(
      arr.map((item) => (isNaN(item) ? item : Number(item)))
    );
    newParam = JSON.parse(result);
    const { id, display_text, text, time, ...rest } = flowItems[taskOrder];
    const keys = Object.keys(rest);
    if (newParam.length < keys.length) {
      return;
    }
    for (let i = 0; i < keys.length; i++) {
      flowItems[taskOrder][keys[i]] = newParam[i];
    }
  };
  return (
    <div>
      {inputVisible && (
        <OptionInput
          inputValues={
            pendingItem.text === "extract_text"
              ? { ...inputValues, ...dragCoords }
              : pendingItem.text === "single_click" ||
                pendingItem.text === "long_press"
              ? { ...inputValues, ...clickCoords }
              : inputValues
          }
          onInputChange={onInputChange}
          onInputConfirm={onInputConfirm}
          onInputCancel={onInputCancel}
          onInputChangeForCode={onInputChangeForCode}
        />
      )}
      <div onDrop={onDrop} onDragOver={handleDragOver} className={className}>
        <h2>
          {" "}
          <SendTimeExtensionIcon style={{ verticalAlign: "middle" }} /> 시나리오
          목록
        </h2>
        {flowItems.length === 0 && (
          <Box
            padding={0.5}
            sx={{ color: "grey.500", justifyContent: "center" }}
          >
            <Typography>
              <AddTaskIcon
                fontSize="small"
                style={{ verticalAlign: "middle" }}
              />{" "}
              작업을 추가해주세요.
            </Typography>
          </Box>
        )}
        <List>
          {flowItems.map((item, index) => (
            <ListItem
              key={item.id}
              style={{
                border: "0.5px solid #ddd",
                borderLeft: "none",
                borderRight: "none",
                borderTop: "none",
              }}
              onClick={() => handleClickUpdateOpen(index)}
            >
              {Object.entries(item).map(([key, value]) => {
                if (key === "id") return null;
                if (key === "text") return null;
                if (key === "display_text") {
                  return (
                    <Tooltip title={value} arro="true">
                      <ListItemText
                        primary={
                          <Typography variant="caption">
                            {value.length > 7
                              ? value.substring(0, 7) + "..."
                              : value}{" "}
                          </Typography>
                        }
                      />
                    </Tooltip>
                  );
                }
                if (key === "template" && value) {
                  return (
                    <ListItemText
                      secondary={
                        <img
                          src={`data:image/png;base64,${value}`}
                          alt="FILE"
                          style={{ width: "15%", height: "15%" }}
                        />
                      }
                    />
                  );
                }
                return (
                  <Tooltip title={`${key}: ${value}`} arrow>
                    <ListItemText
                      secondary={
                        <Typography variant="caption">{`${
                          key.length > 7 ? key.substring(0, 7) + "..." : key
                        }: ${
                          value.length > 5
                            ? value.substring(0, 5) + "..."
                            : value
                        }`}</Typography>
                      }
                    />
                  </Tooltip>
                );
              })}
            </ListItem>
          ))}
        </List>
      </div>
      <Dialog open={open} onClose={handleUpdateClose}>
        <DialogTitle>옵션 변경</DialogTitle>
        <DialogContent>
          <DialogContentText>
            선택한 {taskOrder} 번째 옵션의 현재 값입니다.
            <br />
            값을 변경하고 확인을 눌러주세요. <br />
            (옵션은 콤마(,)로 구분하여 입력해주세요.) <br />
            <br />
            제공되는 옵션 데이터는 아래와 같은 순서입니다 : <br />
            {flowItems[taskOrder]
              ? Object.keys(flowItems[taskOrder])
                  .filter(
                    (key) =>
                      !["id", "display_text", "text", "time"].includes(key)
                  )
                  .join(", ")
              : ""}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="옵션"
            type="text"
            fullWidth
            variant="standard"
            value={newParam}
            onChange={(e) => setNewParam(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateClose}>취소</Button>
          <Button onClick={handleUpdateConfirm}>확인</Button>
        </DialogActions>
      </Dialog>

      <IterationControl
        repeatCount={repeatCount}
        setRepeatCount={setRepeatCount}
        currentCount={currentCount}
        isPlaying={isPlaying}
        handleStopIconClick={handleStopIconClick}
      />
      <ButtonGroup
        fullWidth
        variant="text"
        aria-label="Basic button group"
        sx={{ display: "flex" }}
        className={className2}
      >
        <Tooltip
          title="시나리오의 작업을 시작하려면 '실행' 버튼을 클릭합니다."
          placement="bottom-start"
          arrow
        >
          <Button disabled={true} onClick={handleButtonRun}>
            <PlayCircleOutlineIcon />
          </Button>
        </Tooltip>
        <Tooltip
          title="시나리오의 모든 작업을 지우려면 '초기화' 버튼을 클릭합니다."
          placement="bottom-start"
          arrow
        >
          <Button onClick={handleButtonClear}>
            <HighlightOffIcon />
          </Button>
        </Tooltip>
        <Tooltip
          title="시나리오를 파일로 내보내려면 '저장' 버튼을 클릭합니다."
          placement="bottom-start"
          arrow
        >
          <Button onClick={saveToFile}>
            <SaveIcon />
          </Button>
        </Tooltip>
        <Tooltip
          title="파일에서 시나리오를 불러오려면 '복원' 버튼을 클릭합니다."
          placement="bottom-start"
          arrow
        >
          <Button component="label">
            <SettingsBackupRestoreIcon />
            <input
              type="file"
              onChange={loadFromFile}
              style={{ display: "none" }}
            />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </div>
  );
}

export default FlowList;
