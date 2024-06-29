export interface ViewSize {
  width: number;
  height: number;
}

export const defaultViewSize: ViewSize = {
  width: 700,
  height: 800,
};

export function getImageSize(img: HTMLImageElement, viewSize: ViewSize = defaultViewSize) {
  const { width: viewW, height: viewH } = viewSize;
  const { naturalHeight, naturalWidth } = img;
  const imageHWRatio = naturalHeight / naturalWidth;

  const viewHWRatio = viewH / viewW;

  let size: ViewSize = {
    width: viewW,
    height: viewH,
  };

  if (imageHWRatio > viewHWRatio) {
    // 长图
    size.width = Math.min(naturalWidth, viewW);
    const height = Math.floor(viewW * imageHWRatio);

    // 不能超过最大高度
    size.height = height >= viewH ? viewH : height;
  } else {
    // 宽图
    let height = Math.floor(viewW * imageHWRatio);

    // 正方形
    if (height < 1 || isNaN(height)) {
      height = viewH;
    }

    // 不能超过最大高度
    height = height >= viewH ? viewH : height;
    size.height = height;
  }
  return size;
}
