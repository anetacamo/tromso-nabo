import React from "react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

import { DefaultLayout } from "../../layouts/DefaultLayout/DefaultLayout";
import CrookedImage from "../../components/CrookedImage/CrookedImage";
import CardsSheets from "../../components/CardsSheets/CardsSheets";
import IconHolder from "../../components/IconHolder/IconHolder";
import Tags from "../../components/Tags/Tags";

import Papa, { ParseResult } from "papaparse";
import styles from "./card.module.scss";

import { faLocation } from "@fortawesome/free-solid-svg-icons";
import { slugify } from "../../utils/slugify";

import Blog from "../../types/card.type";
import { getColor } from "../../utils/getColor";
import pagedata from "../../texts/single-page.json";

export default function SinglePage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [blog, setBlog] = useState<Blog>();

  const relatedBlogs = blogs.filter(
    (b: Blog) => b.type.split(",")[0] === blog?.type.split(",")[0]
  );

  useEffect(() => {
    Papa.parse(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQyiugn-4cW_5aphBmblauMbDq0FG-fpmUkpQ0cB9XLYKEH-U81Ev6ZyVKr0QfwFV51FhwM9FmDtt-I/pub?gid=0&single=true&output=csv",

      {
        download: true,
        header: true,
        complete: (results: ParseResult<Blog>) => {
          setBlogs(results.data.filter((d: Blog) => d?.title));
        },
      }
    );
  }, []);

  const getBlogs = useMemo(() => {
    setBlog(
      blogs.filter(
        (card: Blog) => slugify(card?.title) === router.query.slug
      )[0]
    );
  }, [blogs, router]);

  return (
    <DefaultLayout>
      <CrookedImage image={`/images/${slugify(blog?.title)}.jpg`}>
        <div className={styles.text}>
          <p className={`${getColor(blog?.type)}`}>
            {blog?.supertag} {blog?.type}
          </p>
          <h1>{blog?.title}</h1>
          {blog?.address && (
            <IconHolder name={blog?.address} nolink icon={faLocation} />
          )}
          {blog?.link && (
            <IconHolder name="hjemmeside" link={blog?.link} small />
          )}
          {blog?.invisible && (
            <Tags tags={blog?.invisible} color={getColor(blog?.type)} />
          )}
        </div>
      </CrookedImage>

      {blog?.credit && (
        <p
          style={{
            textAlign: "right",
            marginRight: 12,
            zIndex: 12,
            position: "relative",
            fontSize: 12,
            color: "gray",
            marginTop: -24,
            fontStyle: "italic",
          }}
        >
          Foto: {blog?.credit}
        </p>
      )}

      <section style={{ maxWidth: 600, margin: "auto" }}>
        <h4>{pagedata.description}</h4>
        <p>{blog?.description}</p>
        <h4>{pagedata.howtouse}</h4>
        <p>{blog?.howtouse}</p>
      </section>

      <section className={`bg-black`}>
        <h2>other {blog?.type.split(",")[0]}</h2>
        {relatedBlogs && <CardsSheets members={relatedBlogs.slice(0, 5)} />}
      </section>
    </DefaultLayout>
  );
}
