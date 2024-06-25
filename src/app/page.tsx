"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import { filetoBase64 } from "@/lib/file2base64";
import Canvas2Image from "@/lib/cavans2image";


export default function Home() {

  const [currentDpx, setCurrentDpx] = useState(1);
  const [currentImg, setCuttentImg] = useState<string | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const updatePixelRatio = () => {
    let pr = window.devicePixelRatio;
    setCurrentDpx(pr);
  };

  useEffect(() => {
    let mqString = `(resolution: ${window.devicePixelRatio}dppx)`;
    window.matchMedia(mqString).addEventListener("change", updatePixelRatio);

    setCurrentDpx(window.devicePixelRatio)

  }, [])


  const takeScreenshotHandler = async () => {
    const element = targetRef.current;
    if (!element) return;

    const width = element.offsetWidth;
    const height = element.offsetHeight;
    const canvas = document.createElement("canvas");


    canvas.width = width * currentDpx;
    canvas.height = height * currentDpx;
    canvas.getContext('2d')?.scale(currentDpx, currentDpx);

    await html2canvas(element, {
      canvas,
      scale: currentDpx,
      width: width,
      logging: true,
      height: height,
      useCORS: true
    });

    const context = canvas.getContext('2d');
    if (!context) {
      return
    }
    context.imageSmoothingEnabled = false;
    Canvas2Image.saveAsImage(canvas, canvas.width.toString(), canvas.height, 'png', 'image.png');


    // const data = canvas.toDataURL('image/png', 1.0);
    // const link = document.createElement("a");
    // link.href = data;
    // link.download = "image.png";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };

  const onInputFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      const base64 = await filetoBase64(file);
      setCuttentImg(base64)
    }
  };

  const onFileClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };


  return (
    <main className="flex flex-col gap-8">

      <canvas className="hidden" width={400} height={600} style={{ width: 200, height: 300 }}></canvas>

      <div ref={targetRef}>
        <div className="relative h-[400px] max-h-[600px] cursor-pointer" onClick={onFileClick}>
          <input
            ref={inputFileRef}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={onInputFileChange}
          />
          {
            currentImg &&
            <img className="absolute top-[0] left-[0] w-[100%] h-[100%] object-cover" src={currentImg} />
          }
        </div>
        <h1 className="text-3xl">hello</h1>
        <p className="text-[#5eead4]">world</p>
        <p className="text-amber-100">hello</p>
      </div>

      <Button onClick={takeScreenshotHandler}>下载</Button>
    </main>
  );
}
