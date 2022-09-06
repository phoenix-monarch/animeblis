import { useEffect, useState } from "react";
import GridRenderer from "./GridRenderer.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MoonLoader from "react-spinners/MoonLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { v4 as uuidv4 } from "uuid";

import {
  faArrowLeftLong,
  faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons";

const override = {
  position: "fixed",
  zIndex: 1,
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,

  margin: "auto",

  borderColor: "red",
};
export default function PopularSection() {
  const nopreviouspageerror = () => toast.warning("You are on the first page!");
  const nonextpageerror = () => toast.warning("You are on the last page!");
  const [popular, setPopular] = useState([]);
  const [currpage, setCurrpage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [pageNumbers, setPageNumbers] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);
  const updatePageNumberButtons = (e) => {
    if (e.target.classList.contains("nextPageButton")) {
      if (currpage % 10 === 0) {
        let temp = [];
        for (let i = 1; i <= 10; i++) {
          temp.push(currpage + i);
        }

        setPageNumbers(temp);
      }
    }

    if (e.target.classList.contains("previousPageButton")) {
      if (currpage % 10 === 1) {
        let temp = [];
        for (let i = 10; i >= 1; i--) {
          temp.push(currpage - i);
        }
        setPageNumbers(temp);
      }
    }
  };
  useEffect(() => {
    setLoading((prev) => !prev);

    fetch(
      "https://consumet-api.herokuapp.com/meta/anilist/popular?page=" +
        currpage +
        "&perPage=18"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.hasNextPage) {
          setHasNextPage(true);
        } else {
          setHasNextPage(false);
        }

        setPopular(data.results);
        setLoading((prev) => !prev);
        document.querySelector(".section-popular").scrollIntoView()
      });
  }, [currpage]);

  return (
    <section
      className="section section-popular "
      style={{
        paddingBottom: 40,
      }}
    >
      <ToastContainer />

      {popular.length > 0 && (
        <>
          <h1
            style={{ color: "#fdba74", fontSize: "3rem", marginLeft: "35px" }}
          >
            Most Popular
          </h1>

          {loading && (
            <MoonLoader
              color={"dodgerblue"}
              loading={loading}
              cssOverride={override}
              size={80}
            />
          )}

          <GridRenderer finalQuery={popular}></GridRenderer>

          <div
            className="pagination-wrapper"
            style={{
              marginTop: 20,
              display: "flex",
              alignItems: "center",
              width: "100vw",
              justifyContent: "center",
            }}
          >
            <div
              className="pagination"
              style={{
                height: 60,
                width: "96%",

                display: "flex",
                alignItems: "center",
                paddingLeft: "2%",
                paddingRight: "2%",
                marginTop:20,
                borderTop: "1px solid dodgerblue",
                justifyContent: "space-between",
              }}
            >
              <button
                className="previousPageButton"
                onClick={(e) => {
                  if (currpage <= 1) {
                    nopreviouspageerror();
                  } else {
                    updatePageNumberButtons(e);
                    setCurrpage((prev) => prev - 1);
                  }
                }}
                style={{
                  fontSize: "15px",
                  outline: "none",
                  border: "none",
                  color: "white",
                  width: 150,
                  backgroundColor: "transparent",
                }}
              >
                <FontAwesomeIcon icon={faArrowLeftLong}></FontAwesomeIcon>{" "}
                &nbsp;Previous
              </button>

              <div style={{ display: "flex", gap: 35,flexWrap:"wrap" ,justifyContent:"center"}} className="pageindex">
                {pageNumbers.map((pageNumber) => (
                  <button
                  className="btn-pageindex"
                    key={uuidv4()}
                    onClick={() => {
                      setCurrpage(pageNumber);
                    }}
                    style={{ border:"none",padding:"4px 8px",borderRadius:5,color: "white", background:"none",fontSize:14,backgroundColor:currpage === pageNumber?"rgb(244, 67, 54)":"none" }}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>

              <button
                className="nextPageButton"
                onClick={(e) => {
                  if (hasNextPage) {
                    updatePageNumberButtons(e);
                    setCurrpage((curr) => curr + 1);
                  } else {
                    nonextpageerror.error();
                  }
                }}
                style={{
                  color: "white",
                  width: 150,
                  background: "red",
                  fontSize: "15px",
                  outline: "none",
                  border: "none",
                  backgroundColor: "transparent",
                }}
              >
             Next&nbsp;
                <FontAwesomeIcon icon={faArrowRightLong}></FontAwesomeIcon>
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}