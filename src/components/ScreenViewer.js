import React, { useEffect, useState, useRef } from "react";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";


function ScreenViewer({
  setDragCoords,
  setClickCoords,
  className,
  DragCoords,
}) {
  const [crop, setCrop] = useState({
    unit: "%",
    width: 0,
    height: 0,
    aspect: 1 / 1,
    x: 0,
    y: 0,
  });

  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const imgRef = useRef(null);

  /**
   * 사진의 실제 좌표를 얻기 위한 함수
   * @param {*} value
   * @param {*} imgDimension
   * @param {*} cropDimension
   * @returns
   */
  const getRealXY = (value, imgDimension, cropDimension) => {
    return Math.round((value / cropDimension) * imgDimension);
  };

  /**
   * 화면 캡쳐 후 이미지 좌표를 업데이트하는 함수
   * @param {*} newCrop
   */
  const handleCropChange = (newCrop) => {
    if (imgRef.current) {
      const scaleX = imgRef.current.naturalWidth;
      const scaleY = imgRef.current.naturalHeight;

      const realTopLeftX = getRealXY(
        newCrop.x,
        scaleX,
        imgRef.current.offsetWidth
      );
      const realTopLeftY = getRealXY(
        newCrop.y,
        scaleY,
        imgRef.current.offsetHeight
      );
      const realBottomRightX = getRealXY(
        newCrop.x + newCrop.width,
        scaleX,
        imgRef.current.offsetWidth
      );
      const realBottomRightY = getRealXY(
        newCrop.y + newCrop.height,
        scaleY,
        imgRef.current.offsetHeight
      );

      const selection = {
        top_left_x: realTopLeftX,
        top_left_y: realTopLeftY,
        bottom_right_x: realBottomRightX,
        bottom_right_y: realBottomRightY,
      };
      setDragCoords(selection);
      setClickCoords({ x: selection.top_left_x, y: selection.top_left_y });

      setAlertOpen(true);
    }
  };
  /**
   * 알림창을 닫는 함수
   * @param {*} event
   * @param {*} reason
   * @returns
   */
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  // 화면 캡쳐 요청 및 화면 이미지 업데이트
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setImageSrc('./tmp.png');
      setIsLoading(false);
    }, 5000);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div>
        {isLoading ? (
          <LinearProgress color="inherit" />
        ) : (
          <label className={className}>
            {imageSrc && (
              <ReactCrop
                id="uploaded-image"
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                onComplete={(newCrop) => handleCropChange(newCrop)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              >
                <img
                  ref={imgRef}
                  id="uploaded-image"
                  src={imageSrc}
                  alt="스마트폰이 인식되지 않습니다."
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </ReactCrop>
            )}
          </label>
        )}
      </div>
      {alertOpen && (
        <Alert onClose={handleClose} severity="success">
          저장된 좌표 : {DragCoords.top_left_x}, {DragCoords.top_left_y} to{" "}
          {DragCoords.bottom_right_x}, {DragCoords.bottom_right_y}
        </Alert>
      )}
    </div>
  );
}

export default ScreenViewer;
