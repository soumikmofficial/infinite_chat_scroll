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
  // todo: function to fetch and refetch messages

  const handleSearch = () => {
    setDisplayingSearch(true);
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
      //   setCurrentPage(nextPage);
      setLoadedPages((prev) => [...prev, nextPage]);
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
      return [...paginated[Math.min(...loadedPages)]];
    });
    setIsLoading(false);
  };

  //   todo: scroll to the searched message
  useEffect(() => {
    searchedRef.current &&
      displayingSearch &&
      searchedRef.current.scrollIntoView({
        // behavior: "smooth",
        block: "center",
        inline: "center",
      });
  }, [searchedRef.current]);

  useEffect(() => {
    if (!displayingSearch) {
      const { scrollTop, scrollHeight, pageYOffset } = ref.current;
      //   const { height } = ref.current?.getBoundingClientRect();

      manualScrollSet &&
        ref.current?.scrollTo({
          top: ref.current?.scrollHeight - prevScrollHeight + prevScrollTop,
        });
    }
  }, [msgToDisplay]);

  useEffect(() => {
    fetchMessages();
  }, []);

  // todo: on scroll
  useLayoutEffect(() => {
    const myFunc = () => {
      const { scrollTop, scrollHeight } = ref.current;
      const { height } = ref.current?.getBoundingClientRect();
      displayingSearch && setDisplayingSearch(false);
      //? on scroll down
      console.log(Math.min(...loadedPages));
      if (
        scrollHeight - (scrollTop + height) <= 50 &&
        Math.min(...loadedPages) > 0
      ) {
        console.log("this is running", scrollHeight - (scrollTop + height));
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

    ref.current?.addEventListener("scroll", myFunc);
    return () => ref.current?.removeEventListener("scroll", myFunc);
  });

  // initially scrolls to the bottom
  //   useLayoutEffect(() => {
  //     ref?.current?.scrollHeight &&
  //       ref?.current?.scrollTo({
  //         top: ref.current.scrollHeight,
  //       });
  //   }, [ref.current]);

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

export default FrontEnd;
