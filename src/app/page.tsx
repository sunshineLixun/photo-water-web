'use client'

import { Button } from '@/components/ui/button'
import { filetoBase64 } from '@/lib/file2base64'
import html2canvas from 'html2canvas'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [currentDpx, setCurrentDpx] = useState(1)
  const [currentImg, setCuttentImg] = useState<string | null>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const inputFileRef = useRef<HTMLInputElement>(null)

  const updatePixelRatio = () => {
    const pr = window.devicePixelRatio
    setCurrentDpx(pr)
  }

  useEffect(() => {
    const mqString = `(resolution: ${window.devicePixelRatio}dppx)`
    window.matchMedia(mqString).addEventListener('change', updatePixelRatio)

    setCurrentDpx(window.devicePixelRatio)
  }, [])

  const takeScreenshotHandler = async () => {
    const element = targetRef.current
    if (!element)
      return

    window.scrollY = 0
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    const width = element.offsetWidth // 获取dom 宽度
    const height = element.offsetHeight // 获取dom 高度
    const canvas = document.createElement('canvas') // 创建一个canvas节点
    const scale = currentDpx // 定义任意放大倍数 支持小数
    canvas.width = width * scale // 定义canvas 宽度 * 缩放
    canvas.height = height * scale // 定义canvas高度 *缩放
    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    context.imageSmoothingEnabled = false
    context.imageSmoothingQuality = 'high'

    await html2canvas(element, {
      canvas,
      scale: currentDpx,
      width,
      logging: true,
      height,
      useCORS: true,
    })

    const Canvas2Image = (await import('@/lib/cavans2image')).default

    Canvas2Image.saveAsImage(canvas, canvas.width, canvas.height, 'jpeg', 'image')

    // const data = canvas.toDataURL('image/png', 1.0);
    // const link = document.createElement("a");
    // link.href = data;
    // link.download = "image.png";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  }

  const onInputFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const file = files[0]
      const base64 = await filetoBase64(file)
      setCuttentImg(base64)
    }
  }

  const onFileClick = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click()
    }
  }

  return (
    <main className="flex flex-col">

      <div className="bg-white dark:bg-black" ref={targetRef}>
        <div className="w-full h-60 md:h-80 cursor-pointer relative" onClick={onFileClick}>
          <input
            ref={inputFileRef}
            className="hidden"
            type="file"
            accept="image/*"
            onChange={onInputFileChange}
          />
          <div>
            {
              currentImg
              && <img className="block align-top w-full" src={currentImg} />
            }
          </div>

        </div>

        <div className="flex justify-between p-4 md:p-8 leading-none dark:text-white">
          <div>
            <h3 className="font-medium text-xs md:text-[22px] mb-1 md:mb-3"> XIAOMI 12S ULTRA </h3>
            <p className="opacity-40 dark:opacity-80 text-[8px] md:text-base"> 2024.06.25 10:42:20 </p>
          </div>
          <div className="flex items-center gap-[6px] md:gap-3">
            <img src="" alt="" className="w-6 h-6 md:w-12 md:h-12 object-cover" />
            <div className="w-[1px] h-6 md:h-12 bg-[#D8D8D8]"></div>
            <div>
              <h3 className="font-medium text-xs md:text-[22px] mb-1 md:mb-3 flex gap-[6px] md:gap-3">
                <span>120mm</span>
                <span>f/4.1</span>
                <span>1/100</span>
                <span>ISO90</span>
              </h3>
              <p className="opacity-40 dark:opacity-80 text-[8px] md:text-base flex gap-[6px] md:gap-3">
                <span>40°3'13"N</span>
                <span>116°19'25"E</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      <Button onClick={takeScreenshotHandler}>下载</Button>
    </main>
  )
}
