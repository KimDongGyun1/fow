import exifr from "exifr";

interface PhotoData {
  latitude?: number;
  longitude?: number;
  date?: Date;
}

interface CertificationResults {
  location: "통과" | "미통과";
  date: "통과" | "미통과";
}

const PhotoCertificationLogic = async (
  file: File,
  x: number,
  y: number
): Promise<{
  photoData: PhotoData;
  certificationResults: CertificationResults;
}> => {
  const photoData: PhotoData = {};
  const certificationResults: CertificationResults = {
    location: "미통과",
    date: "미통과", // 기본값을 "미통과"로 설정
  };

  try {
    const exifData = await readExifData(file);

    if (!exifData) {
      console.log("사진에 EXIF data를 찾을 수 없음");
      return { photoData, certificationResults };
    }
    const longitude = exifData?.longitude;
    const latitude = exifData?.latitude;

    const dateStr = exifData?.DateTimeOriginal;

    if (dateStr) {
      const date = new Date(dateStr);
      photoData.longitude = longitude;
      photoData.latitude = latitude;
      photoData.date = date;

      const mockLongitude = x; //경도
      const mockLatitude = y; //위도
      const mockDate = new Date();

      const distance = calculateDistance(
        longitude,
        latitude,
        mockLongitude,
        mockLatitude
      );
      const timeDiff = Math.abs(date.getTime() - mockDate.getTime());

      const locationResult = distance > 100 ? "미통과" : "통과";
      const dateResult = timeDiff >= 24 * 60 * 60 * 1000 ? "미통과" : "통과";

      certificationResults.location = locationResult;
      certificationResults.date = dateResult;
    }
  } catch (error) {
    console.error("Error processing photo:", error);
  }

  return { photoData, certificationResults };
};

const readExifData = async (file: File): Promise<any> => {
  try {
    const exifData = await exifr.parse(file, { gps: true });
    return exifData;
  } catch (error) {
    console.error("Error reading EXIF data:", error);
    return undefined;
  }
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
};

export default PhotoCertificationLogic;
