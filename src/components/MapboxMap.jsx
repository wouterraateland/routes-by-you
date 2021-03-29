import ReactMapboxGl from "react-mapbox-gl";

export default ReactMapboxGl({
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN,
});

export * from "react-mapbox-gl";
