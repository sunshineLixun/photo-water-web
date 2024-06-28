'use client';

import type { EXIFTagData } from '@/types/exif';
import dayjs from 'dayjs';

export const TimeFormatter = 'YYYY-MM-DD HH:mm:ss';

export const defaultEXIFModel: Partial<EXIFTagData> = {
  Model: 'iPhone',
  FocalLengthIn35mmFilm: 120,
  FNumber: {
    numerator: 89,
    denominator: 50,
  },
  ExposureTime: {
    numerator: 1,
    denominator: 50,
  },
  ISOSpeedRatings: 100,
  DateTime: dayjs().format(TimeFormatter),
  GPSLongitude: [
    {
      numerator: 114,
      denominator: 1,
    },
    {
      numerator: 29,
      denominator: 1,
    },
    {
      numerator: 38.98,
      denominator: 1,
    },
  ],
  GPSLongitudeRef: 'E',
  GPSLatitude: [
    {
      numerator: 30,
      denominator: 1,
    },
    {
      numerator: 29,
      denominator: 1,
    },
    {
      numerator: 26.65,
      denominator: 1,
    },
  ],
  GPSLatitudeRef: 'N',
};
