import axios from "axios";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
// import styles from "./Chat.module.css";
import styles from "./Chat.module.css";

let lastScrollTop = 0;
let prevScrollTop = 0;
let prevScrollHeight: any;

const Chat = () => {
  const [allMessages, setAllMessages] = useState<any>({});
  const [currentPage, setcurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [freeze, setFreeze] = useState(false);
  const containerRef = useRef<any>();
  const [msgToDisplay, setMsgToDisplay] = useState<any>([]);

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
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useLayoutEffect(() => {
    if (
      !isLoading &&
      Object.keys(allMessages).length > 1 &&
      !!allMessages[currentPage].length
    ) {
      setMsgToDisplay([...allMessages[currentPage], ...msgToDisplay]);
    }
  }, [isLoading, currentPage]);

  useLayoutEffect(() => {
    const toScrollTo =
      containerRef.current?.scrollHeight - prevScrollHeight + 200;
    console.log(containerRef.current?.scrollHeight);
    containerRef.current?.scrollTo({
      top: toScrollTo,
    });
  }, [containerRef.current?.scrollHeight]);

  useEffect(() => {
    containerRef?.current?.scrollHeight &&
      containerRef?.current?.scrollTo({
        top: containerRef.current.scrollHeight,
      });
    prevScrollHeight = containerRef.current?.scrollHeight;
  }, [containerRef.current]);

  useEffect(() => {
    const myFunction = (e: any) => {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop < lastScrollTop && scrollTop <= 200) {
        // setFreeze(true);
        setcurrentPage(currentPage + 1);
        setTimeout(() => {
          //   setFreeze(false);
        }, 2000);
      }
      lastScrollTop = scrollTop;
    };

    containerRef.current?.addEventListener("scroll", myFunction);
    return () =>
      containerRef.current?.removeEventListener("scroll", myFunction);
  });

  if (isLoading || msgToDisplay.length < 1) return <h1>Loading</h1>;

  return (
    <div
      className={`${styles.container} ${freeze && styles.freeze}`}
      ref={containerRef}
    >
      {msgToDisplay?.map((message: any) => {
        return (
          <h2
            className={styles.singleMessage}
          >{`${message.id} - ${message.title}`}</h2>
        );
      })}
    </div>
  );
};

export default Chat;
