import React ,{useRef,useEffect}from 'react'
import { Stage, Layer, Rect, Transformer,Circle as Cir } from 'react-konva';

function Circle(props:any) {
    const shapeRef = useRef<any>();
    const trRef = useRef<any>();
    const { shapeProps, isSelected, onSelect, onChange,screen }= props;

    useEffect(() => {
      if (isSelected) {
        // we need to attach transformer manually
        trRef.current.nodes([shapeRef.current]);
        trRef.current.getLayer().batchDraw();
      }
    }, [isSelected]);
    const limitX = (num: number, r: number) => {
      if (num <= r) return r;
      if (num >= screen.width -r) return screen.width-r ;
      return num;
    };
    const limitY = (num: number, r: number) => {
      if (num <= r) return r;
      if (num >= screen.height-r) return screen.height-r;
      return num;
    };
    const limitDrag = (e: any) => {
      e.evt.preventDefault();
      const r = shapeRef.current.radius();
      const currentX = e.currentTarget.x();
      const currentY = e.currentTarget.y();
      shapeRef.current.position({
        x: limitX(currentX, r),
        y: limitY(currentY, r),
      });
    };
  return (
    <React.Fragment>
    <Cir
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
        onChange({
          ...shapeProps,
          x: node.x(),
          y: node.y(),
          radius:node.radius(),
          scaleX,
          scaleY
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
  )
}

export default Circle
