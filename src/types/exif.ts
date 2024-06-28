// 每个字段的意思
// http://code.ciaoca.com/javascript/exif-js/

export interface FNumber {
  numerator: number;
  denominator: number;
}

export interface EXIFTagData {
  ImageDescription: string;
  Make: string;
  Model: string;
  Orientation: number;
  XResolution: number;
  YResolution: number;
  ResolutionUnit: number;
  Software: string;
  DateTime: string;
  undefined: number;
  ExifIFDPointer: number;
  GPSInfoIFDPointer: number;
  ExposureTime: FNumber;
  FNumber: FNumber;
  ExposureProgram: string;
  ISOSpeedRatings: number;
  ExifVersion: string;
  DateTimeOriginal: string;
  DateTimeDigitized: string;
  ComponentsConfiguration: string;
  ShutterSpeedValue: number;
  ApertureValue: number;
  BrightnessValue: number;
  ExposureBias: number;
  MeteringMode: string;
  Flash: string;
  FocalLength: number;
  SubjectArea: number[];
  MakerNote: number[];
  SubsecTimeOriginal: string;
  SubsecTimeDigitized: string;
  FlashpixVersion: string;
  ColorSpace: number;
  PixelXDimension: number;
  PixelYDimension: number;
  SensingMethod: string;
  SceneType: string;
  ExposureMode: number;
  WhiteBalance: string;
  FocalLengthIn35mmFilm: number;
  SceneCaptureType: string;
  GPSLatitudeRef: string;
  GPSLatitude: FNumber[];
  GPSLongitudeRef: string;
  GPSLongitude: FNumber[];
  GPSTimeStamp: number[];
  GPSDateStamp: string;
  thumbnail: Thumbnail;
}

export interface Thumbnail {}
