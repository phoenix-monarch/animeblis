import { useEffect, useState } from "react";

import ElasticCarousel from "./ElasticCarousel";

export default function TrendingSection() {
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    fetch("https://consumet-api.herokuapp.com/meta/anilist/trending")
      .then((response) => response.json())
      .then((data) => {
        setTrending(data.results);
      });
  }, []);
  return (
    <section className="section section-topairing">
      {trending.length > 0 && (
        <>
          <h1
            style={{ color: "#fdba74", fontSize: "3rem", marginLeft: "35px" }}
          >
            Trending
          </h1>
          <ElasticCarousel
            finalQuery={trending}
            api="anilist"
            rowtitle="Trending"
            isTrending={true}
          ></ElasticCarousel>
        </>
      )}
    </section>
  );
}
