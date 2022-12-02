/* eslint-disable react/display-name */
import React, { useRef, useEffect, useState, useImperativeHandle } from "react";
import {
  Layer,
  Line,
  Rect as LiveRectangle,
  Circle as LiveCircle,
  Stage,
  Image,
} from "react-konva";
import useImage from "use-image";
import Rectangle from "./Rectangle";
import { v4 as uuidv4 } from "uuid";
import Circle from "./Circle";
import BackgroundImage from "./BackgroundImage";

const scaleBy = 1.5;
// const screen = {
//   height: 400,
//   width: 640,
// };

function per(val: number, total: number) {
  return (100 * val) / total;
}
function perToVal(per: number, num: number) {
  return (num / 100) * per;
}
const LayerHighlighter = React.forwardRef<any, Properties>((props, ref) => {
  const stageRef = useRef<any>(null);
  const [rectangles, setRectangles] = React.useState<RectangleProperties[]>([]);
  const [circles, setCircles] = React.useState<CircleProperties[]>([]);
  const [selectedId, selectShape] = React.useState<any>(null);
  const [mapState, setMapSate] = React.useState<State>();
  const [draggable, setDraggable] = React.useState<boolean>(true);
  const [currentScale, setCurrentScale] = React.useState(1);
  const [screen, setScreen] = useState<Screen>({ height: 50, width: 50 });
  const [live, setLive] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState<string>();
  const [deletedLayersId, setDeletedLayersId] = useState<string[]>();
  useImperativeHandle(ref, () => ({
    showMarker() {
      showMarker();
    },
    zoomIn() {
      zoomIn();
    },
    zoomOut() {
      zoomOut();
    },
    addCircle() {
      addCircle();
    },
    addRectangle() {
      addRectangle();
    },
    save() {
      exportVal();
      setSelectedLayer(undefined);
      setLive(true);
      props.deletedLayers(deletedLayersId || []);
    },
    liveMode(val: boolean) {
      setLive(val);
    },
    clearSelectedLayer() {
      setSelectedLayer(undefined);
    },
    deleteSelectedId() {
      if (live) return;
      deleteSelectedId();
    },
    cancel() {
      assignMarker(mapState!);
      setSelectedLayer(undefined);
      setLive(true);
    },
  }));
  useEffect(() => {
    setScreen(props.screen);
  }, [props.screen]);
  useEffect(() => {
    const xxx = JSON.parse(localStorage.getItem("xxx")!) || null;
    setMapSate(xxx);
    assignMarker(xxx);
    setDeletedLayersId([]);
  }, [screen]);

  function showMarker() {
    assignMarker(mapState!);
  }
  const assignMarker = (data: State) => {
    const recs: RectangleProperties[] = [];
    const cirs: CircleProperties[] = [];
    const markers = data?.markers || [];
    if (markers) {
      for (let marker of markers) {
        if (marker.type === "rectangle") {
          const { h, w, r, x, y } = calValueOfAll({
            height: marker.height,
            width: marker.width,
            x: marker.x,
            y: marker.y,
          });

          recs.push({
            fill: marker.fill!,
            height: h!,
            id: marker.id!,
            width: w!,
            x: x!,
            y: y,
            type: marker.type!,
          });
        }
        if (marker.type === "circle" && marker.radius) {
          const { r, x, y } = calValueOfAll({
            x: marker.x,
            y: marker.y,
            radius: marker.radius,
          });
          cirs.push({
            fill: marker.fill!,
            id: marker.id!,
            x: x!,
            y: y,
            radius: r!,
            type: marker.type!,
            scaleX: marker.scaleX || 1,
            scaleY: marker.scaleY || 1,
          });
        }
      }
      setRectangles(recs);
      setCircles(cirs);
    }
  };

  const checkDeselect = (e: any) => {
    if (e.target.attrs.alt === "image") {
      selectShape(null);
      setDraggable(true);
      if (live) {
        setSelectedLayer(undefined);
      }
    } else {
      setDraggable(false);
    }
  };

  const calPercentageOfAll = (data: CommonProperties) => {
    let h,
      w,
      r,
      x,
      y = 0;
    if (data.height) {
      h = per(data.height, screen.height);
    }
    if (data.width) {
      w = per(data.width, screen.width);
    }
    if (data.radius) {
      r = per(data.radius, screen.width);
    }
    if (data.x) {
      x = per(data.x, screen.width);
    }
    if (data.y) {
      y = per(data.y, screen.height);
    }
    return { h, w, r, x, y };
  };
  const calValueOfAll = (data: CommonProperties) => {
    let h,
      w,
      r,
      x,
      y = 0;
    if (data.height) {
      h = perToVal(data.height, screen!.height);
    }
    if (data.width) {
      w = perToVal(data.width, screen!.width);
    }
    if (data.radius) {
      r = perToVal(data.radius, screen!.width);
    }
    if (data.x) {
      x = perToVal(data.x, screen!.width);
    }
    if (data.y) {
      y = perToVal(data.y, screen!.height);
    }
    return { h, w, r, x, y };
  };
  const addRectangle = () => {
    const rec = [...rectangles];
    const id = uuidv4();
    const data = screen;

    const newRec: RectangleProperties = {
      fill: "red",
      height: 40,
      id,
      width: 80,
      x: data.width / 2,
      y: data.height / 2,
      type: "rectangle",
    };
    rec.push(newRec);
    setRectangles(rec);
    if (mapState?.markers) {
      const prevState = [...mapState.markers];
      prevState.push(newRec);
      setMapSate({ markers: prevState });
    } else {
      setMapSate({
        markers: [newRec],
      });
    }
  };
  const addCircle = () => {
    const cir = [...circles];
    const id = uuidv4();

    const newCir: any = {
      fill: "red",
      id,
      radius: 30,
      x: screen.width / 2,
      y: screen.height / 2,
      type: "circle",
      scaleX: 1,
      scaleY: 1,
    };
    cir.push(newCir);
    setCircles(cir);
    if (mapState?.markers) {
      const prevState = [...mapState.markers];
      const newState = prevState.concat(newCir);
      setMapSate({ markers: newState });
    } else {
      setMapSate({
        markers: [newCir],
      });
    }
  };

  const updateStateAfterChange = (data: CommonProperties) => {
    if (data && data.type === "rectangle") {
      const recs = [...rectangles];
      const ind = recs.findIndex((d) => d.id === data.id);
      recs[ind] = {
        fill: data.fill!,
        height: data.height!,
        width: data.width!,
        id: data.id!,
        type: data.type,
        x: data.x!,
        y: data.y!,
      };
      setRectangles(recs);
    }
    if (data && data.type === "circle") {
      const cirs = [...circles];
      const ind = cirs.findIndex((d) => d.id === data.id);
      cirs[ind] = {
        fill: data.fill!,
        id: data.id!,
        type: data.type,
        x: data.x!,
        y: data.y!,
        radius: data.radius!,
        scaleX: data.scaleX || 1,
        scaleY: data.scaleY || 1,
      };
      setCircles(cirs);
    }
  };
  const exportVal = () => {
    let allState: any = [];
    for (let rectangle of rectangles) {
      const { h, w, x, y } = calPercentageOfAll({
        height: rectangle.height,
        width: rectangle.width,
        x: rectangle.x,
        y: rectangle.y,
      });
      allState.push({
        fill: rectangle.fill,
        height: h!,
        id: rectangle.id,
        type: rectangle.type,
        width: w!,
        x: x!,
        y: y,
      });
    }
    for (let circle of circles) {
      const { x, y, r } = calPercentageOfAll({
        x: circle.x,
        y: circle.y,
        radius: circle.radius,
      });
      allState.push({
        fill: circle.fill,
        id: circle.id,
        type: circle.type,
        x: x!,
        y: y,
        radius: r!,
        scaleX: circle.scaleX || 1,
        scaleY: circle.scaleY || 1,
      });
    }

    const val: State = {
      markers: allState,
      height: screen.height,
      width: screen.width,
    };
    props.onSave(val);
    localStorage.setItem("xxx", JSON.stringify(val));
  };
  function limitY(y: number) {
    if (y >= 0) return 0;
    return y;
  }
  function limitX(x: number, nx?: number) {
    if (x >= 0) return 0;
    if (nx)
      if (x <= nx) {
        return nx;
      }
    return x;
  }
  const limitDragging = (e: any) => {
    e.evt.preventDefault();
    if (!draggable && !live) return;

    const xx = e.target.x();
    const yy = e.target.y();
    if (currentScale === 1) {
      stageRef.current.position({ x: 0, y: 0 });
      return;
    }
    if (yy >= 0) {
      stageRef.current.position({ x: limitX(xx), y: 0 });
    }
    if (xx >= 0) {
      stageRef.current.position({ x: 0, y: limitY(yy) });
    }
    const currentWidth = e.target.width() * currentScale;
    const currentHeight = e.target.height() * currentScale;

    if (xx <= -(currentWidth - e.target.width())) {
      stageRef.current.position({
        x: -(currentWidth - e.target.width()),
        y: limitY(yy),
      });
    }
    if (yy <= -(currentHeight - e.target.height())) {
      stageRef.current.position({
        x: limitX(xx, -(currentWidth - e.target.width())),
        y: -(currentHeight - e.target.height()),
      });
    }
  };
  function zoomOut() {
    if (stageRef.current !== null) {
      const stage = stageRef.current;
      const oldScale = stage.scaleX();
      if (oldScale <= 1) return;

      const newScale = oldScale / scaleBy;
      setCurrentScale(newScale);
      stage.scale({ x: newScale, y: newScale });
      const xLimit = screen.width - newScale * screen.width;
      const yLimit = screen.height - newScale * screen.height;
      let cx = stage.x();
      let cy = stage.y();
      if (cx <= xLimit) {
        cx = xLimit;
      }
      if (cy <= yLimit) {
        cy = yLimit;
      }
      stage.position({
        x: limitX(cx),
        y: limitY(cy),
      });
      stage.batchDraw();
    }
  }
  function zoomIn() {
    if (stageRef.current !== null) {
      const stage = stageRef.current;
      const oldScale = stage.scaleX();
      const newScale = oldScale * scaleBy;
      setCurrentScale(newScale);
      stage.scale({ x: newScale, y: newScale });

      stage.batchDraw();
    }
  }
  function selectedOnLiveMode(id: string) {
    setSelectedLayer(id);
    props.selected(id);
  }
  function deleteSelectedId() {
    if (selectedId) {
      const recs = [...rectangles];
      if (recs.length) {
        const ind = recs.findIndex((data) => data?.id === selectedId);
        if (ind !== -1) {
          const allRecs = recs.filter((data) => data?.id != selectedId);
          setRectangles(allRecs);
        }
      }
      const cirs = [...circles];
      if (cirs.length) {
        const ind = cirs.findIndex((data) => data?.id === selectedId);
        if (ind !== -1) {
          const allCirs = cirs.filter((data) => data?.id != selectedId);
          setCircles(allCirs);
        }
      }
      const allDeletedIds = deletedLayersId || [];
      allDeletedIds.push(selectedId);
      setDeletedLayersId(allDeletedIds);
    }
  }
  return (
    <>
      {screen && screen.height && screen.width && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            height: screen.height,
            width: screen.width,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              background: "white",
            }}
          >
            <Stage
              width={screen.width}
              height={screen.height}
              draggable={true}
              ref={stageRef}
              onMouseDown={checkDeselect}
              onTouchStart={checkDeselect}
              onDragMove={(e) => {
                limitDragging(e);
              }}
              onDragEnd={(e) => {
                limitDragging(e);
              }}
            >
              {live ? (
                <Layer>
                  <BackgroundImage
                    image={props.image}
                    height={screen.height}
                    width={screen.width}
                  />
                  {}
                  {rectangles.map((rect, i) => {
                    return (
                      <LiveRectangle
                        key={i}
                        {...rect}
                        dash={selectedLayer === rect?.id ? [5] : []}
                        strokeWidth={selectedLayer === rect?.id ? 3 : 0} // border width
                        stroke={selectedLayer === rect?.id ? "green" : ""}
                        opacity={0.5}
                        onClick={() => selectedOnLiveMode(rect?.id)}
                      />
                    );
                  })}
                  {circles.map((cir, i) => {
                    return (
                      <LiveCircle
                        key={i}
                        {...cir}
                        opacity={0.5}
                        dash={selectedLayer === cir?.id ? [5] : []}
                        strokeWidth={selectedLayer === cir?.id ? 3 : 0} // border width
                        stroke={selectedLayer === cir?.id ? "green" : ""}
                        onClick={() => selectedOnLiveMode(cir?.id)}
                      />
                    );
                  })}
                </Layer>
              ) : (
                <Layer>
                  <BackgroundImage
                    image={props.image}
                    height={screen.height}
                    width={screen.width}
                  />
                  {rectangles.map((rect, i) => {
                    return (
                      <Rectangle
                        key={i}
                        shapeProps={rect}
                        isSelected={rect?.id === selectedId}
                        onSelect={() => {
                          selectShape(rect?.id);
                        }}
                        screen={screen}
                        onChange={(newAttrs: any) => {
                          const rects = rectangles.slice();
                          rects[i] = newAttrs;
                          updateStateAfterChange(newAttrs);
                          setRectangles(rects);
                        }}
                      />
                    );
                  })}
                  {circles.map((cir, i) => {
                    return (
                      <Circle
                        key={i}
                        shapeProps={cir}
                        screen={screen}
                        isSelected={cir?.id === selectedId}
                        onSelect={() => {
                          selectShape(cir?.id);
                        }}
                        onChange={(newAttrs: any) => {
                          const cirs = circles.slice();
                          cirs[i] = newAttrs;
                          updateStateAfterChange(newAttrs);
                          setCircles(cirs);
                        }}
                      />
                    );
                  })}
                </Layer>
              )}

              {/* <Layer name="top-layer" /> */}
            </Stage>
          </div>
        </div>
      )}
    </>
  );
});
export default LayerHighlighter;

interface RectangleProperties {
  x: number;
  y: number;
  height: number;
  width: number;
  fill: string;
  id: string;
  type: string;
}
interface CircleProperties {
  x: number;
  y: number;
  radius?: number;
  fill: string;
  id: string;
  scaleX?: number;
  scaleY?: number;
  type: string;
}
interface State {
  height?: number;
  width?: number;
  markers: CommonProperties[];
}
interface CommonProperties {
  radius?: number;
  height?: number;
  width?: number;
  x?: number;
  y?: number;
  id?: string;
  fill?: string;
  type?: string;
  scaleX?: number;
  scaleY?: number;
}
interface Properties {
  image: string;
  screen: Screen;
  onSave: (val: any) => void;
  selected: (id: string) => void;
  deletedLayers: (id: string[]) => void;
}
interface Screen {
  height: number;
  width: number;
}
