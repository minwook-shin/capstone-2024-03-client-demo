import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AdbIcon from "@mui/icons-material/Adb";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloseIcon from "@mui/icons-material/Close";
import ExtensionIcon from "@mui/icons-material/Extension";
import InstallDesktopIcon from "@mui/icons-material/InstallDesktop";
import RemoveFromQueueIcon from "@mui/icons-material/RemoveFromQueue";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Autocomplete from "@mui/material/Autocomplete";
import { DownloadScreenShot } from "./ControlButtons.js";
import { handleClickShowManager } from "./ManagerViewer.js";
import Tooltip from "@mui/material/Tooltip";
import HelpIcon from "@mui/icons-material/Help";
import TextField from "@mui/material/TextField";

import { useCallback, useState } from "react";

export default function PrimaryAppBar({ className, setRun }) {
  const [keyboardStatus, setKeyboardStatus] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [pluginMenu, setPluginMenu] = React.useState(null);
  const isPluginMenuOpen = Boolean(pluginMenu);
  const [packageName, setPackageName] = useState("");
  const [requirement, setRequirement] = useState([]);

  /**
   * ADB 키보드 설치 확인 함수
   */
  const checkKeyboard = useCallback(async () => {
    setKeyboardStatus(true);
  }, []);

  /**
   * ADB 매뉴를 여는 함수
   * @param {*} event
   */
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * 플러그인 매뉴를 여는 함수
   * @param {*} event
   */
  const handlePluginMenuOpen = (event) => {
    setPluginMenu(event.currentTarget);
    checkPythonPackage();
  };

  /**
   * 매뉴를 닫는 함수
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * 플러그인 매뉴를 닫는 함수
   */
  const handlePluginMenuClose = () => {
    setPluginMenu(null);
  };

  /**
   * 매뉴를 렌더링하는 html 코드
   */
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id="primary-search-account-menu"
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem disabled={true}>ADB 키보드 설치</MenuItem>
      <MenuItem disabled={true}>ADB 키보드 제거</MenuItem>
      <MenuItem onClick={checkKeyboard}>ADB 키보드 설치 확인</MenuItem>
      <label>Keyboard Status: {keyboardStatus ? "True" : "False"}</label>
    </Menu>
  );

  /**
   * Python 패키지 설치
   */
  const installPythonPackage = async () => {
    if (packageName) {
      setPackageName("");
      checkPythonPackage();
    }
  };

  /**
   * Python 패키지 제거
   */
  const uninstallPythonPackage = async () => {
    if (packageName) {
      setPackageName("");
      checkPythonPackage();
    }
  };

  /**
   * Python 패키지 확인
   */
  const checkPythonPackage = async () => {
    setRequirement(["numpy==1.21.0", "pandas==1.3.0", "matplotlib==3.4.2"]);
  };

  /**
   * 플러그인 매뉴를 렌더링하는 html 코드
   */
  const renderPluginMenu = (
    <Menu
      anchorEl={pluginMenu}
      id="primary-search-account-menu"
      keepMounted
      open={isPluginMenuOpen}
      onClose={handlePluginMenuClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Autocomplete
        fullWidth
        label="설치 & 제거할 패키지 이름"
        disablePortal
        id="combo-box-demo"
        freeSolo={true}
        value={packageName}
        onInputChange={(event, newInputValue) => {
          setPackageName(newInputValue);
        }}
        options={requirement}
        sx={{ flexGrow: 1, width: "100%" }}
        renderInput={(params) => <TextField {...params} label="package" />}
      />
      <Box
        sx={{ flexGrow: 1, width: "100%" }}
        style={{ display: "flex", alignItems: "center" }}
      >
        <ButtonGroup
          variant="text"
          aria-label="Basic button group"
          sx={{ display: "flex" }}
          fullWidth
          color="primary"
        >
          <Button disabled={true} onClick={installPythonPackage}>
            <InstallDesktopIcon />
          </Button>
          <Button disabled={true} onClick={uninstallPythonPackage}>
            <RemoveFromQueueIcon />
          </Button>
        </ButtonGroup>
      </Box>
      <div style={{ flexGrow: 1, margin: 20 }}>
        <table>
          <tbody>
            {Object.entries(requirement).map(([key, value]) => (
              <tr key={key}>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Studio DEMO (Buzzni & Minwook)
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex" }} className={className}>
            <Tooltip title="시나리오에서 스크린샷 내려받기">
              <IconButton
                size="large"
                color="inherit"
                disabled={true}
                onClick={DownloadScreenShot}
              >
                <CloudDownloadIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="시나리오에서 추출한 텍스트 결과보기">
              <IconButton
                size="large"
                color="inherit"
                disabled={true}
                onClick={handleClickShowManager}
              >
                <AssignmentIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="도움말 확인">
              <IconButton
                size="large"
                color="inherit"
                onClick={() => setRun(true)}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>

            <IconButton
              size="large"
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AdbIcon />
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              onClick={handlePluginMenuOpen}
              color="inherit"
            >
              <ExtensionIcon />
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={() => window.close()}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
      {renderMenu} {renderPluginMenu}
    </Box>
  );
}
