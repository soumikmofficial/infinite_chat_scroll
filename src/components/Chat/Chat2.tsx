import axios from "axios";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
// import styles from "./Chat.module.css";
import styles from "./Chat.module.css";

let lastScrollTop = 0;
let prevScrollTop = 0;
let prevScrollHeight: any;

const Chat2 = () => {
  const [allMessages, setAllMessages] = useState<any>({});
  //   const [currentPage, setcurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [freeze, setFreeze] = useState(false);
  const containerRef = useRef<any>();
  const [msgToDisplay, setMsgToDisplay] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMessages = async () => {
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.m/posts?_limit=20&_page=${currentPage}`
    );
    setAllMessages(data);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  //   console.log(currentPage);

  const handleNextFetch = async () => {
    console.log("being triggered.............");
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/posts?_limit=20&_page=${
        currentPage + 1
      }`
    );
    setAllMessages((prev: any) => {
      return [...prev, ...data];
    });
    setCurrentPage((prev) => prev + 1);
  };

  console.log(allMessages);
  if (!!!allMessages.length) return <h1>nothing to display</h1>;

  return (
    // <div
    //   id="scrollableDiv"
    //   style={{
    //     // height: 300,
    //     overflow: "auto",
    //     display: "flex",
    //     flexDirection: "column-reverse",
    //   }}
    // >
    //   <InfiniteScroll
    //     inverse={true}
    //     style={{ display: "flex", flexDirection: "column-reverse" }}
    //     dataLength={allMessages.length} //This is important field to render the next data
    //     next={handleNextFetch}
    //     hasMore={true}
    //     loader={<h4>Loading...</h4>}
    //     scrollableTarget="scrollableDiv"
    //     endMessage={
    //       <p style={{ textAlign: "center" }}>
    //         <b>Yay! You have seen it all</b>
    //       </p>
    //     }
    //   >
    //     {allMessages?.map((message: any, index: number) => {
    //       return (
    //         <h2
    //           key={index}
    //           className={styles.singleMessage}
    //         >{`${message.id} - ${message.title}`}</h2>
    //       );
    //     })}
    //   </InfiniteScroll>
    // </div>

    <div
      id="scrollableDiv"
      style={{
        height: "100vh",
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
      }}
    >
      {/*Put the scroll bar always on the bottom*/}
      <InfiniteScroll
        dataLength={allMessages.length}
        next={handleNextFetch}
        style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
        inverse={true} //
        hasMore={true}
        loader={<h4>Loading...</h4>}
        scrollableTarget="scrollableDiv"
      >
        {allMessages.map((_: any, index: any) => (
          <div className={styles.singleMessage} key={index}>
            div - #{_.title}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default Chat2;
