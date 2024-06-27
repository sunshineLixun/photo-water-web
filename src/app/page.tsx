/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { Button } from '@/components/ui/button';
import { filetoBase64 } from '@/lib/file2base64';
import html2canvas from 'html2canvas';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function Home() {
  const [currentDpx, setCurrentDpx] = useState(1);
  const [currentImg, setCuttentImg] = useState<string | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const updatePixelRatio = () => {
    const pr = window.devicePixelRatio;
    setCurrentDpx(pr);
  };

  useEffect(() => {
    const mqString = `(resolution: ${window.devicePixelRatio}dppx)`;
    window.matchMedia(mqString).addEventListener('change', updatePixelRatio);

    setCurrentDpx(window.devicePixelRatio);
  }, []);

  const takeScreenshotHandler = async () => {
    const element = targetRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: currentDpx,
      logging: true,
      useCORS: true,
    });

    const Canvas2Image = (await import('@/lib/cavans2image')).default;

    Canvas2Image.saveAsImage(canvas, canvas.width, canvas.height, 'jpeg', 'image');
  };

  const onInputFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      const base64 = await filetoBase64(file);
      setCuttentImg(base64);
    }
  };

  const onFileClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const renderImg = useMemo(() => {
    if (!currentImg) {
      return (
        <div className="relative h-60 w-full cursor-pointer md:h-80" onClick={onFileClick}>
          上传图片
        </div>
      );
    }

    return (
      <div className="cursor-pointer" onClick={onFileClick}>
        <img className="block w-full align-top" src={currentImg} alt={''} />
      </div>
    );
  }, [currentImg]);

  return (
    <main className="flex flex-col">
      <input
        ref={inputFileRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={onInputFileChange}
      />
      <div className="bg-white shadow-lg dark:bg-black" ref={targetRef}>
        {renderImg}
        <div className="flex justify-between p-1 leading-none dark:text-white md:p-8">
          <div>
            <h3 className="mb-1 text-xs font-medium md:mb-3 md:text-[22px]"> XIAOMI 12S ULTRA </h3>
            <p className="text-[8px] opacity-40 dark:opacity-80 md:text-base">
              2024.06.25 10:42:20
            </p>
          </div>
          <div className="flex items-center gap-[6px] md:gap-3">
            <img src="" alt="" className="h-6 w-6 object-cover md:h-12 md:w-12" />
            <div className="h-6 w-[1px] bg-[#D8D8D8] md:h-12"></div>
            <div>
              <h3 className="mb-1 flex gap-[6px] text-xs font-medium md:mb-3 md:gap-3 md:text-[22px]">
                <span>120mm</span>
                <span>f/4.1</span>
                <span>1/100</span>
                <span>ISO90</span>
              </h3>
              <p className="flex gap-[6px] text-[8px] opacity-40 dark:opacity-80 md:gap-3 md:text-base">
                <span>40°3'13"N</span>
                <span>116°19'25"E</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button className="mx-2 my-2" onClick={takeScreenshotHandler}>
        下载
      </Button>
    </main>
  );
}
