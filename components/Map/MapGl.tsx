import { useState } from "react";
import Link from "next/link";

import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, NavigationControl } from "react-map-gl";

import styles from "./MapGl.module.scss";
import { slugify } from "../../utils/slugify";
import Blog from "../../types/card.type";
import { getColor } from "../../utils/getColor";
//import { debounce } from "lodash";

import pagedata from "../../texts/home.json";

interface MapGiProps {
  posts: Blog[];
}

export default function MapGl({ posts }: MapGiProps) {
  const [name, setName] = useState("");
  const [viewState, setViewState] = useState({
    latitude: 69.65065246406847,
    longitude: 18.956804295081962,
    zoom: 10,
  });

  return (
    <div className={`${styles.mapwhole} desktop`}>
      <Map
        style={{ width: "100vw", height: "500px", position: "relative" }}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        maxZoom={17}
        minZoom={12}
        scrollZoom={false}
        mapStyle="mapbox://styles/anetahaha/clbeb4ftc002e14p79cgh7e6t"
        mapboxAccessToken="pk.eyJ1IjoiYW5ldGFoYWhhIiwiYSI6ImNsYmU3MXVpbDAyZ2ozcXBnbmhmZDc4aXUifQ.27PW9H2rbmyeI44A7pgcEQ"
      >
        <NavigationControl />
        {posts.map(
          (post: Blog, index: number) =>
            !isNaN(post.longitude || 0) &&
            !isNaN(post.latitude || 0) && (
              <Marker
                key={index}
                latitude={post.latitude}
                longitude={post.longitude}
                style={name === post.title ? { zIndex: 5 } : { zIndex: 1 }}
              >
                <Link
                  href={`cards/${slugify(post?.title)}`}
                  key={index}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div
                    className={`${styles.point} bg-${getColor(post.type)} ${
                      name === post.title ? styles.pointed : ""
                    }`}
                    onMouseEnter={() => setName(post.title)}
                    onMouseLeave={() => setName("")}
                    // onMouseEnter={() => debouncedHandleMouseEnter(post?.title)}
                    // onMouseLeave={handlOnMouseLeave}
                  >
                    <img
                      src={`/categories/${getColor(post.type)}2.png`}
                      alt={`icon`}
                      className={styles.icon}
                    />
                    <div
                      className={`${styles.title} ${getColor(post.type)} ${
                        name === post.title ? styles.opened : ""
                      }`}
                    >
                      {name === post.title ? name : ""}
                      <span style={{ color: "black" }}>
                        {" "}
                        {name === post.title ? post.address : ""}
                      </span>
                    </div>
                  </div>
                </Link>
              </Marker>
            )
        )}
      </Map>
    </div>
  );
}
