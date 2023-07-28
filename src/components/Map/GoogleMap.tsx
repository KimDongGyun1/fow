import { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScriptNext, Polygon } from "@react-google-maps/api";

import seoulData from "../../data/seoul2.json";
import retroMapStyle from "../../data/retroMapStyle.json";

const containerStyle = {
  width: "650px",
  height: "600px",
};

const defaultCenter = {
  lat: 37.566826,
  lng: 126.9786567,
};

// 한반도를 덮는 좌표
const OUTER_BOUNDS = [
  { lat: 38.634, lng: 125.776 },
  { lat: 33.004, lng: 125.776 },
  { lat: 33.004, lng: 131.87 },
  { lat: 38.634, lng: 131.87 },
];

const bounds = {
  north: 37.72,
  south: 37.4,
  west: 126.764414,
  east: 127.183463,
};

const options: { [key: string]: { point: number } } = {
  Gangdong: { point: 0 },
  Songpa: { point: 1100 },
  Gangnam: { point: 2200 },
  Seocho: { point: 0 },
  Gwanak: { point: 5000 },
  Dongjak: { point: 0 },
  Yeongdeungpo: { point: 0 },
  Geumcheon: { point: 2300 },
  Guro: { point: 0 },
  Gangseo: { point: 0 },
  Yangcheon: { point: 3300 },
  Mapo: { point: 0 },
  Seodaemun: { point: 0 },
  Eunpyeong: { point: 0 },
  Nowon: { point: 0 },
  Dobong: { point: 500 },
  Gangbuk: { point: 1300 },
  Seongbuk: { point: 0 },
  Jungnang: { point: 0 },
  Dongdaemun: { point: 0 },
  Gwangjin: { point: 0 },
  Seongdong: { point: 0 },
  Yongsan: { point: 0 },
  Jung: { point: 0 },
  Jongno: { point: 4500 },
};

const parseCoordinates = (coordinateString: string) => {
  const coordinatePairs = coordinateString.trim().split(" ");
  return coordinatePairs.map((pair) => {
    const [lng, lat] = pair.split(",");
    return { lat: parseFloat(lat), lng: parseFloat(lng) };
  });
};

// 서울 지역 좌표
const COORDINATES_STRING =
  "126.9112,37.4372 126.91,37.4343 126.9066,37.4336 126.903,37.4341 126.899,37.4387 126.8996,37.4404 126.8958,37.4456 126.894,37.4527 126.8896,37.4523 126.8863,37.4563 126.8854,37.4601 126.8889,37.4609 126.8829,37.4643 126.8846,37.4656 126.8727,37.4824 126.8718,37.4853 126.8746,37.4854 126.8768,37.4886 126.8727,37.4884 126.8728,37.49 126.8747,37.4899 126.8741,37.4913 126.8702,37.4896 126.8695,37.4943 126.8676,37.4948 126.8527,37.4818 126.8466,37.4816 126.845,37.4736 126.8428,37.475 126.8346,37.4749 126.8317,37.4777 126.8279,37.476 126.8194,37.4763 126.8177,37.4732 126.8147,37.4748 126.819,37.4792 126.8213,37.4862 126.8233,37.4879 126.8209,37.4907 126.8146,37.4932 126.813,37.4964 126.8196,37.4992 126.8222,37.5077 126.827,37.5085 126.827,37.5104 126.8242,37.5105 126.8243,37.5145 126.8282,37.529 126.8253,37.53 126.8219,37.535 126.8221,37.5407 126.8123,37.5407 126.8072,37.5437 126.8018,37.5427 126.7993,37.5406 126.7995,37.5377 126.7944,37.5358 126.7938,37.54 126.7906,37.5439 126.7869,37.546 126.7779,37.5467 126.7753,37.549 126.7716,37.5483 126.7645,37.5554 126.7707,37.5572 126.7758,37.5619 126.7778,37.5599 126.7759,37.5652 126.7814,37.5689 126.7824,37.5736 126.7876,37.5756 126.7913,37.5812 126.7922,37.5802 126.7937,37.5816 126.7934,37.5845 126.8007,37.5878 126.8003,37.592 126.7971,37.5977 126.8026,37.605 126.8201,37.5924 126.8536,37.5718 126.8536,37.5738 126.8634,37.5769 126.8763,37.5782 126.8776,37.5797 126.8775,37.5862 126.8853,37.5939 126.8873,37.5939 126.8855,37.5911 126.8876,37.5887 126.8996,37.5898 126.9012,37.5963 126.9002,37.6031 126.9021,37.6037 126.9003,37.6112 126.9034,37.6188 126.9052,37.6191 126.9071,37.6219 126.9088,37.6291 126.9062,37.6332 126.9112,37.6359 126.9123,37.6443 126.9048,37.6491 126.9137,37.6448 126.9241,37.6461 126.9361,37.6515 126.9403,37.6568 126.9475,37.6592 126.9479,37.6571 126.9571,37.6528 126.9593,37.6421 126.9633,37.6332 126.9584,37.6295 126.9754,37.6317 126.9842,37.6363 126.9859,37.6406 126.9832,37.6437 126.9851,37.6459 126.9797,37.656 126.9829,37.6564 126.9865,37.6595 126.9883,37.6644 126.994,37.6668 126.994,37.6749 126.9922,37.6796 127.0046,37.6851 127.0087,37.6844 127.0097,37.6967 127.0139,37.6988 127.0154,37.7015 127.0253,37.6996 127.0277,37.7009 127.0324,37.6918 127.0411,37.6953 127.0431,37.6952 127.0451,37.6924 127.0486,37.6941 127.0498,37.688 127.0518,37.6858 127.0522,37.6874 127.0597,37.6903 127.0634,37.6949 127.0727,37.6938 127.0811,37.6961 127.0838,37.6943 127.0852,37.6904 127.096,37.6891 127.0964,37.6856 127.0919,37.6792 127.0964,37.6697 127.0946,37.6662 127.0954,37.6639 127.0912,37.6593 127.094,37.6525 127.0927,37.6486 127.0946,37.6446 127.1066,37.6454 127.1113,37.6424 127.1122,37.6326 127.106,37.6273 127.1041,37.6217 127.1162,37.6189 127.1181,37.6055 127.1141,37.6001 127.1167,37.594 127.1133,37.5933 127.109,37.5834 127.1034,37.5806 127.1011,37.5761 127.1017,37.5724 127.1042,37.5714 127.1018,37.5596 127.1049,37.5564 127.113,37.5588 127.1152,37.5568 127.123,37.5635 127.1286,37.5662 127.1377,37.5684 127.1489,37.5684 127.1667,37.579 127.1772,37.5812 127.1754,37.5783 127.1757,37.5749 127.182,37.561 127.1813,37.553 127.1835,37.5452 127.1799,37.5466 127.1632,37.545 127.154,37.5345 127.1532,37.5291 127.1478,37.5221 127.1458,37.5219 127.1454,37.5161 127.1421,37.5147 127.14,37.5086 127.1411,37.5055 127.1455,37.5033 127.1508,37.5041 127.1564,37.5019 127.1577,37.5032 127.1612,37.5004 127.1574,37.4891 127.1487,37.484 127.1471,37.4772 127.1444,37.4773 127.1435,37.4739 127.1329,37.4746 127.1328,37.4684 127.1308,37.4677 127.1249,37.4696 127.1245,37.4666 127.1175,37.4622 127.1169,37.4586 127.1118,37.4616 127.1043,37.4622 127.1039,37.4601 127.0993,37.4567 127.0935,37.4559 127.0888,37.4497 127.0879,37.4449 127.0814,37.4412 127.0722,37.4422 127.0738,37.4374 127.0696,37.4306 127.0657,37.4292 127.0535,37.4288 127.0474,37.4307 127.0411,37.4378 127.0356,37.439 127.0352,37.4409 127.0382,37.4459 127.0358,37.4522 127.0371,37.4552 127.0346,37.4642 127.0299,37.4654 127.0260,37.4578 127.0145,37.4549 127.0092,37.4572 127.0045,37.4641 127.0037,37.4677 126.9968,37.4671 126.9968,37.4619 126.9824,37.4559 126.9746,37.4544 126.9706,37.4495 126.9643,37.4463 126.9646,37.4420 126.9629,37.4403 126.9482,37.4386 126.9402,37.4357 126.9377,37.4374 126.9366,37.4417 126.9306,37.4455 126.9284,37.4502 126.9207,37.4415 126.9112,37.4372";

// 서울 지역의 좌표를 파싱하고 순서를 반전
const seoulCoordinates = parseCoordinates(COORDINATES_STRING);

const Map = () => {
  const [polygons, setPolygons] = useState<
    {
      name: string;
      name_eng: string;
      path: { lat: number; lng: number }[];
      options: {};
    }[]
  >([]);

  const [view, setView] = useState({ center: defaultCenter, zoom: 11 });

  // 지도의 인스턴스를 참조하기 위한 ref 생성
  const mapRef = useRef<google.maps.Map | null>(null);

  const [mapCenter, setMapCenter] = useState(defaultCenter);

  function getCentroid(coords: any[]) {
    let center = coords.reduce(
      (x, y) => {
        return [x[0] + y.lng / coords.length, x[1] + y.lat / coords.length];
      },
      [0, 0]
    );
    return { lat: center[1], lng: center[0] };
  }

  useEffect(() => {
    if (view.center && mapRef.current) {
      setMapCenter(view.center);
      mapRef.current.setZoom(view.zoom);
    }
  }, [view]);

  useEffect(() => {
    const data = seoulData.features.map((feature) => {
      const name = feature.properties.name;
      const name_eng = feature.properties.NAME_1;
      const path = feature.geometry.coordinates[0][0].map(([lng, lat]) => ({
        lat,
        lng,
      }));

      return { name, name_eng, path, options: {} };
    });

    setPolygons(data);

    return () => setPolygons([]);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LoadScriptNext
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={view.zoom}
          options={{
            minZoom: 11,
            restriction: {
              latLngBounds: bounds,
              strictBounds: false,
            },
            styles: retroMapStyle, // retro맵 스타일 적용
          }}
          onLoad={(map) => {
            mapRef.current = map;
          }}
        >
          {/* 한반도를 덮는 검은색 폴리곤 */}
          <Polygon
            paths={[OUTER_BOUNDS, seoulCoordinates]}
            options={{
              fillColor: "#000",
              fillOpacity: 1,
              strokeOpacity: 0,
            }}
          />
          {/* 서울 지역을 표시하는 다른 색상의 폴리곤 */}
          {polygons.map((polygon, index) => {
            const name_eng = polygon.name_eng;
            const point = options[name_eng].point;
            let opacity =
              point < 1000
                ? 0.9
                : point < 2000
                ? 0.7
                : point < 3000
                ? 0.5
                : 0.3;
            return (
              <Polygon
                key={index}
                paths={polygon.path}
                options={{
                  fillColor: "#222",
                  fillOpacity: opacity,
                  strokeColor: "#555",
                  strokeOpacity: 1,
                  strokeWeight: 4,
                }}
                onClick={() => {
                  const center = getCentroid(polygon.path);
                  setView({ center, zoom: 16 }); // 먼저 줌 레벨을 변경하고 그 다음에 중심을 변경
                }}
              />
            );
          })}
        </GoogleMap>
      </LoadScriptNext>
    </div>
  );
};

export default Map;
