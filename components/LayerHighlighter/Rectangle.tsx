import React, { useRef, useEffect } from "react";
import { Rect, Transformer } from "react-konva";

function Rectangle(props: any) {
  const shapeRef = useRef<any>();
  const trRef = useRef<any>();
  const { shapeProps, isSelected, onSelect, onChange, screen } = props;

  useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const limitX = (num: number, w: number) => {
    if (num <= 0) return 0;
    if (num >= screen.width - w) return screen.width - w;
    return num;
  };
  const limitY = (num: number, h: number) => {
    if (num <= 0) return 0;
    if (num >= screen.height - h) return screen.height - h;
    return num;
  };
  const limitDrag = (e: any) => {
    e.evt.preventDefault();
    const h = shapeRef.current.height();
    const w = shapeRef.current.width();
    const currentX = e.currentTarget.x();
    const currentY = e.currentTarget.y();
    shapeRef.current.position({
      x: limitX(currentX, w),
      y: limitY(currentY, h),
    });
  };
  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragMove={limitDrag}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
}

export default Rectangle;
