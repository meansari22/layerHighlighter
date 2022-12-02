import React, { LegacyRef, useEffect, useRef, useState } from "react";
import LayerHighlighter from "../LayerHighlighter/LayerHighlighter";

function TableLayer() {
  const containerRef = useRef<any>();
  const [live, setLive] = useState<boolean>(true);
  const [scr, setScr]= useState<{height:number, width:number}>({height:100, width:100})
 function getWidth(val:number){
    return (val*0.60)
  }
  function getHeight(){
    const w= getWidth(window.innerWidth)/4;
    return w*3
  }
  useEffect(() => {
 console.log(window.innerWidth)
    if(window.innerWidth){
        setScr({
            height:getHeight(),
            width:getWidth(window.innerWidth)
        })
    }
  },[])
  return (
    <div>
      {live ? (
        <>
          <button
            onClick={() => {
              setLive(false);
              containerRef.current.liveMode(false);
            }}
          >
            Edit
          </button>
          <button onClick={() => containerRef.current.zoomIn()}>ZoomIn</button>
          <button onClick={() => containerRef.current.zoomOut()}>
            ZoomOut
          </button>
          <button onClick={() => containerRef.current.clearSelectedLayer()}>
            Clear Selected
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              setLive(true);
              containerRef.current.liveMode(true);
            }}
          >
            Display Mode
          </button>

          <button onClick={() => containerRef.current.zoomIn()}>ZoomIn</button>
          <button onClick={() => containerRef.current.zoomOut()}>
            ZoomOut
          </button>
          <button onClick={() => containerRef.current.addRectangle()}>
            Rectangle
          </button>
          <button onClick={() => containerRef.current.addCircle()}>
            Circle
          </button>
          <button onClick={() => containerRef.current.save()}>Save</button>
          <button
            onClick={() => {
              setLive(true);
              containerRef.current.cancel();
            }}
          >
            Cancel
          </button>

          <button onClick={() => containerRef.current.deleteSelectedId()}>
            Delete Selected
          </button>
        </>
      )}

      <LayerHighlighter
        ref={containerRef}
        screen={scr}
        image="./tableLayer.jpg"
        onSave={(e) => {
          console.log(e);
        }}
        selected={(e) => {
          console.log(e);
        }}
        deletedLayers={(e) => {
          console.log(e);
        }}
      />
    </div>
  );
}

export default TableLayer;
