import axios from "axios";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./Chat.module.css";

// let prevScrollTop = 0;
// let prevScrollHeight = 0;

const BottomScroll = () => {
  const [allMessages, setAllMessages] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const ref = useRef<any>();

  // todo: function to fetch and refetch messages
  const fetchMessages = async () => {
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/posts?_limit=20&_page=${currentPage}`
    );
    setAllMessages(data);
    console.log(data);
  };
  const fetchNext = async () => {
    setIsFetching(true);

    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/posts?_limit=20&_page=${
        currentPage + 1
      }`
    );
    setAllMessages((prev: any) => {
      return [...prev, ...data];
    });
    setCurrentPage((prev) => prev + 1);
    setIsFetching(false);
  };

  useEffect(() => {
    console.log("this ran");
    fetchMessages();
  }, []);

  // todo: on scroll
  useEffect(() => {
    const myFunc = () => {
      const { scrollTop, scrollHeight } = ref.current;
      const { height } = ref.current?.getBoundingClientRect();

      if (scrollHeight - (scrollTop + height) <= 300) {
        !isFetching && fetchNext();
      }
    };

    ref.current?.addEventListener("scroll", myFunc);
    return () => ref.current?.removeEventListener("scroll", myFunc);
  });

  return (
    <div className={styles.parent}>
      <h1>Infinite Bottom</h1>

      <div className={styles.container} ref={ref}>
        {isFetching && <a>loading</a>}
        {allMessages.map((message: any) => {
          return (
            <>
              <h3
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

export default BottomScroll;
