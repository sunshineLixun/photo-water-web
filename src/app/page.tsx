/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { Button } from '@/components/ui/button';
import { filetoBase64 } from '@/lib/file2base64';
import html2canvas from 'html2canvas';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ReloadIcon } from '@radix-ui/react-icons';
import EXIF from 'exif-js';
import type { EXIFTagData } from '@/types/exif';
import { defaultEXIFModel } from '@/constants/constants';
import { GPSLatitudeToStr, GPSLongitudeToStr, getComputedFNumber, getExposure } from '@/lib/utils';

export default function Home() {
  const [currentDpx, setCurrentDpx] = useState(1);
  const [currentBase64, setCurrentBase64] = useState<string | null>(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [exifModel, setExifModel] = useState<Partial<EXIFTagData>>({});

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

    setBtnLoading(true);
    const canvas = await html2canvas(element, {
      scale: currentDpx,
      logging: true,
      useCORS: true,
    });

    const Canvas2Image = (await import('@/lib/cavans2image')).default;

    Canvas2Image.saveAsImage(canvas, canvas.width, canvas.height, 'jpeg', 'image');
    setBtnLoading(false);
  };

  const onInputFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const file = files[0];
      const base64 = await filetoBase64(file);
      setCurrentBase64(base64);
    }
  };

  const onFileClick = () => {
    setCurrentBase64(null);
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const showImgLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (e) {
      // @ts-ignore
      EXIF.getData(e.target, function () {
        const data = EXIF.getAllTags(e.target) as EXIFTagData;
        if (Object.keys(data).length) {
          console.log(data);
          setExifModel(data);
        }
      });
    }
  };

  const renderImg = useMemo(() => {
    if (!currentBase64) {
      return (
        <div className="relative h-60 w-full cursor-pointer md:h-80" onClick={onFileClick}>
          上传图片
        </div>
      );
    }

    return (
      <div className="cursor-pointer" onClick={onFileClick}>
        <img
          className="block w-full align-top"
          onLoad={showImgLoad}
          src={currentBase64}
          alt="image"
        />
      </div>
    );
  }, [currentBase64]);

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
        <div className="flex justify-between p-4 leading-none dark:text-white md:p-8">
          <div>
            <h3 className="mb-1 font-medium max-md:text-xs md:mb-3 md:text-[22px]">
              {exifModel.Model || defaultEXIFModel.Model}
            </h3>
            <p className="text-[8px] opacity-40 dark:opacity-80 md:text-base">
              {exifModel.DateTime || defaultEXIFModel.DateTime}
            </p>
          </div>
          <div className="flex items-center gap-[6px] md:gap-3">
            <img
              src={'/static/leica.png'}
              alt="leica"
              className="h-6 w-6 object-cover md:h-12 md:w-12"
            />
            <div className="h-6 w-[1px] bg-[#D8D8D8] md:h-12"></div>
            <div>
              <h3 className="flex gap-[6px] font-medium max-md:text-xs md:mb-3 md:gap-3 md:text-[22px]">
                <span>
                  {exifModel.FocalLengthIn35mmFilm || defaultEXIFModel.FocalLengthIn35mmFilm}mm
                </span>
                <span>f/{getComputedFNumber(exifModel.FNumber, defaultEXIFModel.FNumber)}</span>
                <span>{getExposure(exifModel.ExposureTime, defaultEXIFModel.ExposureTime)}</span>
                <span>ISO{exifModel.ISOSpeedRatings || defaultEXIFModel.ISOSpeedRatings}</span>
              </h3>
              <p className="flex gap-[6px] text-[8px] opacity-40 dark:opacity-80 md:gap-3 md:text-base">
                <span>{GPSLatitudeToStr(exifModel.GPSLatitude, exifModel.GPSLatitudeRef)}</span>
                <span>{GPSLongitudeToStr(exifModel.GPSLongitude, exifModel.GPSLongitudeRef)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button disabled={btnLoading} className="mx-2 my-2" onClick={takeScreenshotHandler}>
        {btnLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        下载
      </Button>
    </main>
  );
}
