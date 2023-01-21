import axios from "axios";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./Chat.module.css";

let lastScrollTop = 0;
let prevScrollTop = 0;
let prevScrollHeight = 0;

const dummyBackendResponse = {
  match: 2,
  prev: 1,
  next: 3,
};

const ScrollBoth = () => {
  const [allMessages, setAllMessages] = useState<any>({});
  const [msgToDisplay, setMsgToDisplay] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSEarchInput] = useState("");
  const [displayingSearch, setDisplayingSearch] = useState(false);
  const ref = useRef<any>();
  const searchedRef = useRef<any>();
  // todo: function to fetch and refetch messages

  const handleSearch = () => {
    setDisplayingSearch(true);
    setMsgToDisplay(allMessages[dummyBackendResponse.match]);
  };
  // todo: fetch next set of messages
  const fetchNext = async (nextPage: number, direction: string) => {
    setIsLoading(true);
    prevScrollHeight = ref.current?.scrollHeight;
    setTimeout(() => {
      direction === "up"
        ? setMsgToDisplay((prev: any) => {
            return [...allMessages[nextPage], ...prev];
          })
        : setMsgToDisplay((prev: any) => {
            return [...prev, ...allMessages[nextPage]];
          });
      setCurrentPage(nextPage);
      setIsLoading(false);
    }, 2000);
  };
  // todo: fetch initial messages
  const fetchMessages = async () => {
    setIsLoading(true);
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );

    let paginated: any = {};
    let startIndex = 0;
    let endIndex = 20;
    for (let i = 0; i < 5; i++) {
      paginated[i] = data.slice(startIndex, endIndex);
      startIndex += 20;
      endIndex += 20;
    }
    setAllMessages(paginated);
    setMsgToDisplay((prev: any) => {
      return [...paginated[currentPage]];
    });
    setIsLoading(false);
  };

  //   todo: when we have a searched ref
  useEffect(() => {
    searchedRef.current &&
      displayingSearch &&
      searchedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
  }, [searchedRef.current]);

  useEffect(() => {
    if (!displayingSearch) {
      const { scrollTop, scrollHeight, pageYOffset } = ref.current;
      const { height } = ref.current?.getBoundingClientRect();
      ref.current?.scrollTo({
        top: ref.current?.scrollHeight - prevScrollHeight + prevScrollTop,
      });
    }
  }, [msgToDisplay]);

  useEffect(() => {
    fetchMessages();
  }, []);

  // todo: on scroll
  useEffect(() => {
    const myFunc = () => {
      const { scrollTop, scrollHeight } = ref.current;
      const { height } = ref.current?.getBoundingClientRect();
      displayingSearch && setDisplayingSearch(false);

      //? on scroll down
      if (scrollHeight - (scrollTop + height) <= 300 && currentPage > 0) {
        !isLoading && fetchNext(currentPage - 1, "down");
      }
      // ?on scroll up
      if (
        scrollTop < lastScrollTop &&
        scrollTop <= 300 &&
        currentPage < Object.keys(allMessages).length - 1
      ) {
        prevScrollTop = scrollTop;
        !isLoading && fetchNext(currentPage + 1, "up");
      }
      lastScrollTop = scrollTop;
    };

    ref.current?.addEventListener("scroll", myFunc);
    return () => ref.current?.removeEventListener("scroll", myFunc);
  });

  return (
    <div className={styles.parent}>
      <h1>All Data fetched at once</h1>
      <section className={styles.searchContainer}>
        <input
          value={searchInput}
          onChange={(e) => setSEarchInput(e.target.value)}
          type="text"
        />
        <button onClick={handleSearch}>Get</button>
      </section>

      <div className={styles.container} ref={ref}>
        {isLoading && <a>loading</a>}
        {msgToDisplay?.map((message: any) => {
          return (
            <>
              <h3
                key={message.id}
                ref={message.id == searchInput ? searchedRef : undefined}
                className={styles.singleMessage}
              >{`${message.id} - ${message.title} `}</h3>
              ;
            </>
          );
        })}
      </div>
    </div>
  );
};

export default ScrollBoth;
