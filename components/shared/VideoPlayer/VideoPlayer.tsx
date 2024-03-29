"use client"
import React, { memo, useEffect, useRef } from 'react'

const VideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestIdRef = useRef<number>();


  useEffect(() => {
    const draw = () => {
      // console.log("draw")
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          // ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Draw only the necessary part
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
      }
    };

    const drawLoop = () => {
      draw();
      requestIdRef.current = requestAnimationFrame(drawLoop);
    };

    const init = () => {
      const video = videoRef.current;
      if (video) {
        video.addEventListener("play", drawLoop, false);
        video.addEventListener("pause", cancelDrawLoop, false);
        video.addEventListener("ended", cancelDrawLoop, false);
      }
    };

    const cancelDrawLoop = () => {
      cancelAnimationFrame(requestIdRef.current || 0);
      requestIdRef.current = undefined;
    };

    init();

    const video = videoRef.current;
    return () => {
      if (video) {
        video.removeEventListener("play", drawLoop);
        video.removeEventListener("pause", cancelDrawLoop);
        video.removeEventListener("ended", cancelDrawLoop);
      }
      cancelDrawLoop();
    };
  }, []);

  // useEffect(() => {
  //   if (videoRef.current) {
  //     videoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  //   }
  // }, [])

  return (
    <div className='relative'>
      <video
        ref={videoRef}
        controls
        autoPlay={false}
        className='rounded-xl overflow-hidden w-full block m-0'
        controlsList="nodownload"
        src={src}
        preload="metadata"
        contextMenu='return null'
      >
      </video>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute top-0 left-0 -z-[1] w-full block m-0 opacity-20 scale-x-[1.6] scale-y-[1.6] sm:scale-x-[1.1] blur-[60px] rounded-xl"
      ></canvas>
    </div>
  )
}

export default memo(VideoPlayer)
