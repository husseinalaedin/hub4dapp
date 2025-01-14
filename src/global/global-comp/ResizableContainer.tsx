import React, { useState } from "react";

function ResizableContainer({children}) {
  const [dimensions, setDimensions] = useState({ width: 300, height: 200 });

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const handleMouseMove = (event) => {
      const newWidth = Math.max(100, startWidth + (event.clientX - startX)); // Min width: 100px
      const newHeight = Math.max(100, startHeight + (event.clientY - startY)); // Min height: 100px
      setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        position: "relative",
        border: "1px solid #ccc",
        padding: "16px",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {children}
      {/* Resizable Handle */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "16px",
          height: "16px",
          backgroundColor: "#ddd",
          cursor: "se-resize",
        }}
      />
    </div>
  );
}

export default ResizableContainer;
