import axios from "axios";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./Chat.module.css";

let lastScrollTop = 0;
let prevScrollTop = 0;
let prevScrollHeight = 0;

const Chat3 = () => {
  const [allMessages, setAllMessages] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<any>();

  // todo: function to fetch and refetch messages
  const fetchMessages = async () => {
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/posts?_limit=20&_page=${currentPage}`
    );
    setAllMessages(data);
  };
  const fetchNext = async () => {
    setIsLoading(true);
    prevScrollHeight = ref.current?.scrollHeight;
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/posts?_limit=20&_page=${
        currentPage + 1
      }`
    );
    setAllMessages((prev: any) => {
      return [...data, ...prev];
    });
    setCurrentPage((prev) => prev + 1);
    setIsLoading(false);
  };

  useEffect(() => {
    ref.current?.scrollTo({
      top: ref.current?.scrollHeight - prevScrollHeight + prevScrollTop,
    });
  }, [allMessages]);

  useEffect(() => {
    fetchMessages();
  }, []);

  // todo: on scroll
  useEffect(() => {
    const myFunc = () => {
      const { scrollTop } = ref.current;

      if (scrollTop < lastScrollTop && scrollTop <= 200) {
        prevScrollTop = scrollTop;
        !isLoading && fetchNext();
      }
      lastScrollTop = scrollTop;
    };

    ref.current?.addEventListener("scroll", myFunc);
    return () => ref.current?.removeEventListener("scroll", myFunc);
  });

  // initially scrolls to the bottom
  useLayoutEffect(() => {
    ref?.current?.scrollHeight &&
      ref?.current?.scrollTo({
        top: ref.current.scrollHeight,
      });
  }, [ref.current]);

  return (
    <div className={styles.parent}>
      <h1>Chat Header</h1>

      <div className={styles.container} ref={ref}>
        {isLoading && <a>loading</a>}
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

export default Chat3;
