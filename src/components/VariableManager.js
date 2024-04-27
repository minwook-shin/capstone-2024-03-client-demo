import React, { useState, useEffect, useCallback } from "react";
import {
  TextField,
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Tooltip,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Clear as ClearIcon,
  DeleteForever as DeleteForeverIcon,
  Check as CheckIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";

function VariableManager() {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [variables, setVariables] = useState({});

  /**
   * key 값 변경 이벤트
   * @param {*} event
   */
  const handleKeyChange = (event) => {
    setKey(event.target.value);
  };

  /**
   * value 값 변경 이벤트
   * @param {*} event
   */
  const handleValueChange = (event) => {
    setValue(event.target.value);
  };

  /**
   * 제출 이벤트 처리
   * 변수를 생성할 때 사용
   * @param {*} event
   * @returns
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (key.trim() === "") {
      return;
    }
    setKey("");
    setValue("");
    fetchVariables();
  };

  /**
   * 변수 목록을 가져오는 함수
   * useCallback 사용 (최초 렌더링 시에만 호출)
   */
  const fetchVariables = useCallback(async () => {
    setVariables({"key1": "value1", "key2": "value2"});
  }, []);

  /**
   * 변수를 삭제하는 함수
   * 삭제 완료 후 변수 목록을 다시 갱신
   */
  const clearVariable = async () => {
    setKey("");
    setValue("");
  };

  /**
   * 특정 변수를 삭제하는 함수
   * 삭제 완료 후 변수 목록을 다시 갱신
   * @param {*} key
   */
  const deleteVariable = async (key) => {
    setVariables((prev) => {
      delete prev[key];
      return { ...prev };
    });
  };

  /**
   * 키 이름 클릭 시 클립보드에 복사하는 함수
   * 복사 완료 후 알림창 생성
   * @param {*} key
   */
  const handleKeyClick = (key) => {
    const str = `{{_local['${key}']}}`;
    navigator.clipboard.writeText(str);
    alert(`Copied ${str} to clipboard`);
  };

  useEffect(() => {
    fetchVariables();
  }, [fetchVariables]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="standard"
              value={key}
              onChange={handleKeyChange}
              placeholder="Key"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              variant="standard"
              value={value}
              onChange={handleValueChange}
              placeholder="Value"
            />
          </Grid>
        </Grid>
        <ButtonGroup
          variant="text"
          aria-label="Basic button group"
          sx={{ display: "flex" }}
          fullWidth
          color="primary"
        >
          <Button disabled={true} type="submit">
            <CheckIcon />
          </Button>
          <Button onClick={fetchVariables}>
            <RefreshIcon />
          </Button>
          <Button onClick={clearVariable}>
            <ClearIcon />
          </Button>
        </ButtonGroup>
        {Object.keys(variables).length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>변수명</TableCell>
                <TableCell>값</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(variables).map(([key, value]) => (
                <TableRow key={key}>
                  <Tooltip
                    title="클릭하시면 변수를 바로 사용할 수 있도록 복사해드려요."
                    placement="bottom-start"
                    arrow
                  >
                    <TableCell onClick={() => handleKeyClick(key)}>
                      <ContentCopyIcon
                        fontSize="small"
                        style={{ verticalAlign: "middle" }}
                      />{" "}
                      {key}
                    </TableCell>
                  </Tooltip>
                  <Tooltip title={value} placement="right-start" arrow>
                    <TableCell>
                      {value.length > 8 ? value.substring(0, 8) + "..." : value}
                    </TableCell>
                  </Tooltip>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => deleteVariable(key)}
                    >
                      <DeleteForeverIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </form>
    </div>
  );
}

export default VariableManager;
