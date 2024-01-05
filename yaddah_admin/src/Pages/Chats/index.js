import React, { useEffect, useState } from "react";
import styles from "./Chats.module.css";
import SidebarSkeleton from "../../Components/SidebarSkeleton";
import moment from "moment/moment";
import { AiOutlineSearch } from "react-icons/ai";
//Images
import { Get } from "../../Axios/AxiosFunctions";
import { BaseURL, imageUrl, recordsLimit } from "../../config/apiUrl";
import {  useSelector } from "react-redux";
import { Loader } from "../../Components/Loader";
import NoData from "../../Components/NoData/NoData";
import PaginationComponent from "../../Components/PaginationComponent";
import { Button } from "../../Components/Button/Button";

const ChatList = ({ item, activeChat, onClick }) => {
  return (
    <li
      className={[
        styles.chat__list__item,
        activeChat?._id === item?._id && styles.roomActive,
      ].join(" ")}
      onClick={(e) => onClick()}>
      <img src={imageUrl(item?.user2?.photo)} alt="" />
      <div className={styles.__list__name}>
        <p>
          <span className={styles.name}>{item?.user2?.userName}</span>
          <span>{moment(item.lastMessage.createdAt).format("LT")}</span>
        </p>
        <p className={styles.lastMsg}>{item.lastMessage.text}</p>
      </div>
    </li>
  );
};
const MessageEle = ({ item, direction, next }) => {
  return (
    <div
      className={[
        styles.message__wrapper,
        direction === "right" ? styles.__right : null,
      ].join(" ")}>
      <div className={styles.__avatar}>
        {next?.user?._id !== item?.user?._id && (
          <img src={imageUrl(item.user.avatar)} alt="" />
        )}
      </div>
      <div className={styles.__chat}>
        <p className={styles.msg}>{item.text}</p>
        <p className={styles.time}>{moment(item.createdAt).format("LT")}</p>
      </div>
    </div>
  );
};

const Chats = () => {
  const { accessToken } = useSelector((state) => state.authReducer);
  const [chatRooms, setChatRooms] = useState([]);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatsPage, setChatsPage] = useState(1);
  const [totalChats, setTotalChats] = useState(0);
  const [roomLoading, setRoomLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [roomsPage, setRoomsPage] = useState(1);
  const [totalRooms, setTotalRooms] = useState(0);
  useEffect(() => {
  }, []);

  const getAllChats = async (pg = chatsPage, prevChats = []) => {
    pg == 1 && setChatLoading(true);
    const response = await Get(
      BaseURL(
        `chat/admin/single-chat?room=${activeChat._id}&page=${pg}&limit=${recordsLimit}`
      ),
      accessToken
    );
    if (response) {
      setChats([...prevChats, ...response?.data?.data]);
      setTotalChats(Math.ceil(response?.data?.totalRecords / recordsLimit));
    }
    pg == 1 && setChatLoading(false);
  };

  const activeChatHandler = async (room) => {
    setChatsPage(1);
    setChats([]);
    setActiveChat(room);
  };

  const getChatRooms = async (pg = roomsPage) => {
    setRoomLoading(true);
    const response = await Get(
      BaseURL(`chat/admin/rooms?page=${pg}&limit=${recordsLimit}`),
      accessToken
    );
    if (response !== undefined) {
      setChatRooms(response?.data?.data);
      setTotalRooms(response?.data?.totalRecords);
    }
    setRoomLoading(false);
  };
  useEffect(() => {
    getChatRooms();
  }, [roomsPage]);

  useEffect(() => {
    if (activeChat != null) {
      getAllChats();
    }
  }, [activeChat]);

  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        <div className={styles.chat__list__wrapper}>
          <div className={styles.__header}>
            <h1>Chat</h1>
            <div className={styles.__input}>
              <input type="text" name="" id="" placeholder="Search People" />
              <AiOutlineSearch />
            </div>
          </div>
          <div className={styles.__list}>
            <ul>
              {roomLoading ? (
                <Loader className={styles.loader} />
              ) : chatRooms.length > 0 ? (
                chatRooms?.map((item) => (
                  <ChatList
                    item={item}
                    activeChat={activeChat}
                    onClick={() => {
                      item?._id !== activeChat?._id && activeChatHandler(item);
                    }}
                  />
                ))
              ) : (
                <NoData text="No Rooms Found" />
              )}
            </ul>
          </div>
          {chatRooms?.length > 0 && (
            <PaginationComponent
              totalPages={Math.ceil(totalRooms / recordsLimit)}
              setCurrentPage={setRoomsPage}
              currentPage={roomsPage}
              defaultActiveColor="var(--clr-primary)"
            />
          )}
        </div>
        <div className={styles.chat__main__wrapper}>
          {activeChat !== null && (
            <div className={styles.__header}>
              <div className="d-flex align-items-center gap-2">
                {activeChat == null ? (
                  <p>No User Selected</p>
                ) : (
                  <>
                    <img
                      src={imageUrl(activeChat?.user2.photo)}
                      alt=""
                      className={styles.__img}
                    />
                    <p className={styles.nameBold}>
                      {activeChat?.user2?.userName}
                    </p>
                  </>
                )}
              </div>
              <div className="d-flex gap-2">
                <p className={styles.nameBold}>Service Provider:</p>
                <p className={styles.serviceProvider}>
                  {activeChat === null
                    ? "No User Selected"
                    : activeChat?.user1?.userName}
                </p>
              </div>
            </div>
          )}
          {chatLoading ? (
            <Loader className={styles.loader} />
          ) : (
            <div className={styles.__content}>
              {activeChat !== null ? (
                chats.map((e, index) => (
                  <MessageEle
                    item={e}
                    next={chats[index + 1]}
                    direction={
                      activeChat?.user1?._id == e?.user._id ? "right" : "left"
                    }
                  />
                ))
              ) : (
                <div className={styles.welcome}>
                  <NoData text="No Room Selected" />
                </div>
              )}

              {totalChats > chatsPage && (
                <div className={styles.loadMoreBtnDiv}>
                  <Button
                    variant={"secondary"}
                    label={"Load More"}
                    className={styles.loadMoreBtn}
                    onClick={() => {
                      const pg = chatsPage + 1;
                      setChatsPage(pg);
                      getAllChats(pg, chats);
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </SidebarSkeleton>
  );
};

export default Chats;
