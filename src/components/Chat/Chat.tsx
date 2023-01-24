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

const FrontEnd = () => {
  const [allMessages, setAllMessages] = useState<any>({});
  const [msgToDisplay, setMsgToDisplay] = useState<any>([]);
  const [loadedPages, setLoadedPages] = useState([0]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSEarchInput] = useState("");
  const [displayingSearch, setDisplayingSearch] = useState(false);
  const [manualScrollSet, setManualScrollSet] = useState(true);
  const ref = useRef<any>();
  const searchedRef = useRef<any>();

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
      return [...paginated[Math.min(...loadedPages)]];
    });
    setIsLoading(false);
  };

  // todo: handle search
  const handleSearch = () => {
    // setDisplayingSearch(true);
    setManualScrollSet(false);
    setLoadedPages([
      dummyBackendResponse.next,
      dummyBackendResponse.match,
      dummyBackendResponse.prev,
    ]);
    setMsgToDisplay([
      ...allMessages[dummyBackendResponse.next],
      ...allMessages[dummyBackendResponse.match],
      ...allMessages[dummyBackendResponse.prev],
    ]);
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
      setLoadedPages((prev) => [...prev, nextPage]);
      setIsLoading(false);
    }, 2000);
  };

  //   todo: scroll to the searched message
  useEffect(() => {
    searchedRef.current &&
      !manualScrollSet &&
      searchedRef.current.scrollIntoView({
        // behavior: "smooth",
        block: "start",
        inline: "center",
      });
  }, [searchedRef.current]);

  // todo: set scroll manually
  useEffect(() => {
    if (manualScrollSet) {
      manualScrollSet &&
        ref.current?.scrollTo({
          top:
            ref.current?.scrollHeight - prevScrollHeight + prevScrollTop - 34,
        });
    }
  }, [msgToDisplay]);

  useEffect(() => {
    fetchMessages();
  }, []);

  // todo: on scroll
  useEffect(() => {
    const handleScroll = (e: any) => {
      const { scrollTop, scrollHeight } = ref.current;
      const { height } = ref.current?.getBoundingClientRect();
      !manualScrollSet && setManualScrollSet(true);
      //? on scroll down
      if (
        scrollHeight - (scrollTop + height) <= 50 &&
        Math.min(...loadedPages) > 0
      ) {
        setManualScrollSet(false);
        !isLoading && fetchNext(Math.min(...loadedPages) - 1, "down");
      }
      // ?on scroll up
      if (
        scrollTop < lastScrollTop &&
        scrollTop <= 50 &&
        Math.max(...loadedPages) < Object.keys(allMessages).length - 1
      ) {
        prevScrollTop = scrollTop;
        !isLoading && fetchNext(Math.max(...loadedPages) + 1, "up");
      }
      lastScrollTop = scrollTop;
    };

    ref.current?.addEventListener("scroll", handleScroll);
    return () => ref.current?.removeEventListener("scroll", handleScroll);
  });

  return (
    <div className={styles.parent}>
      <h1>Infinite Scroll</h1>
      <section className={styles.searchContainer}>
        <input
          value={searchInput}
          onChange={(e) => setSEarchInput(e.target.value)}
          type="text"
        />
        <button onClick={handleSearch}>Get</button>
      </section>

      <div className={`${styles.container}`} ref={ref}>
        {isLoading && <div className={styles.loading}>loading</div>}

        {msgToDisplay?.map((message: any) => {
          return (
            <>
              <h3
                key={message.id}
                ref={message.id == searchInput ? searchedRef : undefined}
                className={styles.singleMessage}
              >{`${message.id} - ${message.title} `}</h3>
            </>
          );
        })}
        {isLoading && <div className={styles.loading}>loading</div>}
      </div>
    </div>
  );
};

export default FrontEnd;
