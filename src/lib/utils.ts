import { defaultEXIFModel } from '@/constants/constants';
import { FNumber } from '@/types/exif';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function GPSToStr(longitude: string[], ref: string) {
  const d = longitude[0];
  const min = longitude[1];
  const sec = longitude[2];
  return `${d}°${min}'${sec}"${ref}`;
}

export function getNumber(item: FNumber) {
  const num = (item.numerator / item.denominator).toFixed(2);
  const [first, last] = num.split('.');
  return last === '00' ? first : num;
}

function getNums(num: FNumber[]) {
  return num.map((item) => getNumber(item));
}

export function GPSLongitudeToStr(longitude: FNumber[] | undefined, ref: string | undefined) {
  if (!longitude || longitude.length === 0) {
    longitude = defaultEXIFModel.GPSLongitude!;
  }

  return GPSToStr(getNums(longitude), ref || defaultEXIFModel.GPSLongitudeRef!);
}

export function GPSLatitudeToStr(latitude: FNumber[] | undefined, ref: string | undefined) {
  if (!latitude || latitude.length === 0) {
    latitude = defaultEXIFModel.GPSLatitude!;
  }
  return GPSToStr(getNums(latitude), ref || defaultEXIFModel.GPSLatitudeRef!);
}

export function getComputedFNumber(
  fNumber: FNumber | undefined,
  defaultValue: FNumber | undefined,
) {
  const f = fNumber || defaultValue!;
  return getNumber(f!);
}

export function getExposure(exposureTime: FNumber | undefined, defaultValue: FNumber | undefined) {
  const result = exposureTime || defaultValue!;
  return `${result.numerator}` + '/' + `${result.denominator}`;
}

export function downloadFile(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
