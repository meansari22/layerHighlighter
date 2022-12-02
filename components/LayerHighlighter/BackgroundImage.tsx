import React,{useRef,useEffect} from 'react'
import { Layer, Line, Rect, Stage, Image } from "react-konva";
import useImage from 'use-image';


function BackgroundImage(props:Properties) {
    const [image] = useImage(props.image);
    const imgRef = useRef<any>()
    const {height,width}= props;
    const h= imgRef.current?.height();
    return (
      <Image ref={imgRef}
        image={image}
        width={width}
        alt="image"
        height={height}
      />
    );
}

export default BackgroundImage

interface Properties{
  height:number,
  width:number,
  image:string
}