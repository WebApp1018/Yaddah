import React, { useEffect, useState } from "react";
import styles from "./Chats.module.css";
import SidebarSkeleton from "../../components/SidebarSkeleton";
import moment from "moment/moment";
import { AiOutlineSearch, AiOutlineSend } from "react-icons/ai";
import { IoArrowBackOutline } from "react-icons/io5";
import InputWithButton from "../../components/InputWithButton";
//Images
import { apiUrl, BaseURL, imageUrl, recordsLimit } from "../../config/apiUrl";
import { Get } from "../../Axios/AxiosFunctions";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { io } from "socket.io-client";
import NoData from "../../components/NoData/NoData";
import { Loader } from "../../components/Loader";
import { isMobileViewHook } from "../../CustomHooks/isMobileViewHook";
import { PaginationComponent } from "../../components/Pagination/Pagination";
import useDebounce from "../../CustomHooks/useDebounce";
import { Button } from "../../components/Button/Button";

let isAllowDebounce = false;

const ChatList = ({ item, activeChat, onClick }) => {
  // U1 service Provider
  // U2 Customer
  const user = useSelector((state) => state?.authReducer?.user);
  const roomUser = user?._id == item?.user1?._id ? item?.user2 : item?.user1;
  return (
    <li
      className={[styles.chat__list__item]}
      data-active={activeChat?._id == item?._id}
      onClick={() => onClick(item)}
    >
      <img src={imageUrl(roomUser?.photo)} alt="" />
      <div className={styles.__list__name}>
        <p>
          <span className={styles.name}>{roomUser?.fullName}</span>
          <span>{moment(item?.updateAt).format("LT")}</span>
        </p>
        <p className={styles.lastMsg}>{item?.lastMessage?.text}</p>
      </div>
    </li>
  );
};
const MessageEle = ({ item }) => {
  const user = useSelector((state) => state?.authReducer?.user);
  const isMyMsg = user?._id == item?.user?._id;
  return (
    <div
      className={[
        styles.message__wrapper,
        isMyMsg ? styles.__right : null,
      ].join(" ")}
    >
      <div className={styles.__avatar}>
        <img src={imageUrl(item?.user?.avatar)} alt="" />
      </div>
      <div className={styles.__chat}>
        <p>{item?.text}</p>
        {/* <p>
          {moment(new Date(item?.createdAt), "YYYY MMM DD hh mm a").fromNow()}
        </p> */}
        <p className={styles.time}>
          {moment(item?.createdAt).format("DD MMM YYYY hh:mm a")}
        </p>
      </div>
    </div>
  );
};

const RoomListing = ({
  roomsLoading,
  rooms,
  activeChatHandler,
  activeChat,
  setRoomsPage,
  roomsPage,
  totalRooms,
  search,
  setSeacrh,
}) => {
  return (
    <>
      <div className={styles.chat__list__wrapper}>
        <div className={styles.__header}>
          <h1>Chat</h1>
          <div className={styles.__input}>
            <input
              type="text"
              name=""
              id=""
              placeholder="Search People"
              value={search}
              onChange={(e) => setSeacrh(e?.target?.value)}
            />
            <AiOutlineSearch />
          </div>
        </div>
        <div className={styles.__list}>
          {roomsLoading ? (
            <Loader customStyle={{ minHeight: "100%" }} />
          ) : rooms?.length == 0 ? (
            <NoData text="No Rooms Found" />
          ) : (
            <ul>
              {rooms?.map((item, key) => (
                <ChatList
                  key={key}
                  item={item}
                  activeChat={activeChat}
                  onClick={() => activeChatHandler(item)}
                />
              ))}
            </ul>
          )}
        </div>
        {rooms?.length > 0 && (
          <PaginationComponent
            setCurrentPage={setRoomsPage}
            currentPage={roomsPage}
            totalPages={totalRooms}
          />
        )}
      </div>
    </>
  );
};

const ChatListing = ({
  activeChat,
  isMobile,
  roomUser,
  chats,
  msgEndRef,
  setActiveChat,
  totalChats,
  chatsPage,
  sendMsg,
  chatsLoading,
  onLoadMore,
}) => {
  return (
    <>
      <div className={styles.chat__main__wrapper}>
        {activeChat && (
          <div className={styles.__header}>
            <div className="d-flex align-items-center gap-2">
              {activeChat === null ? (
                // <p>No User Selected</p>
                <></>
              ) : (
                <>
                  {isMobile && (
                    <IoArrowBackOutline
                      size={20}
                      onClick={() => setActiveChat(null)}
                    />
                  )}
                  <img
                    src={imageUrl(roomUser?.photo)}
                    alt=""
                    className={styles.__img}
                  />
                  <p>{roomUser?.fullName}</p>
                </>
              )}
            </div>
          </div>
        )}
        <div className={styles.__content}>
          {chatsLoading ? (
            <Loader customStyle={{ minHeight: "100%" }} />
          ) : !activeChat ? (
            <NoData text="No Room Seleted" />
          ) : chats?.length == 0 ? (
            <NoData text="No Chats Found" />
          ) : (
            <>
              {totalChats > chatsPage && (
                <div className={styles.loadMoreBtnDiv}>
                  <Button
                    label={"Load More"}
                    className={styles.loadMoreBtn}
                    onClick={onLoadMore}
                  />
                </div>
              )}
              {chats?.map((e, key) => (
                <MessageEle item={e} key={key} />
              ))}
              <div className={styles.ref_div} ref={msgEndRef} />
            </>
          )}
        </div>
        {activeChat && (
          <div className={styles.__footer}>
            <InputWithButton
              mainContainerClass={styles.SendInputMainContainer}
              // inputClass={styles.sendInput}
              btnClass={styles.SendInputBtnContainer}
              placeholder={"Enter your message here..."}
              onClick={sendMsg}
              btnChildern={<AiOutlineSend className={styles.chatIcon} />}
            />
          </div>
        )}
      </div>
    </>
  );
};
const Chats = () => {
  const socket = useRef(null);
  const msgEndRef = useRef(null);
  const token = useSelector((state) => state?.authReducer?.accessToken);
  const userData = useSelector((state) => state?.authReducer?.user);
  const [activeChat, setActiveChat] = useState(null);
  const [search, setSeacrh] = useState("");
  const debounceValue = useDebounce(search, 500);

  const [rooms, setRooms] = useState([]);
  const [chats, setChats] = useState([]);
  const [totalChats, setTotalChats] = useState(0);
  const [totalRooms, setTotalRooms] = useState(0);
  const [chatsPage, setChatsPage] = useState(1);
  const [roomsPage, setRoomsPage] = useState(1);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [chatsLoading, setChatsLoading] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  // States

  function scrollToBottom() {
    msgEndRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "start",

    });
  }

  const activeChatHandler = (item) => {
    setChatsPage(1);
    setChats([]);
    setActiveChat(item);
  };

  const getAllRoom = async (page = roomsPage) => {
    const apiUrl = BaseURL(
      `chat/rooms?page=${page}&limit=${recordsLimit}&search=${search}`
    );
    setRoomsLoading(true);
    const response = await Get(apiUrl, token);
    if (response !== undefined) {
      setRooms(response?.data?.data);
      setTotalRooms(Math.ceil(response?.data?.totalRecords / recordsLimit));
    }
    setRoomsLoading(false);
  };

  useEffect(() => {
    socket.current = io(apiUrl, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 180000,
      reconnectionDelayMax: 300000,
    });
    socket.current?.emit("join", userData?._id);

    isMobileViewHook(setIsMobile, 992);
    return () => {
      socket.current?.emit("disconnected", userData?._id);
    };
  }, []);

  useEffect(() => {
    getAllRoom(roomsPage);
  }, [roomsPage]);
  useEffect(() => {
    if (isAllowDebounce) {
      getAllRoom();
    }
    isAllowDebounce = true;
  }, [debounceValue]);

  const getAllchats = async (page = chatsPage) => {
    const apiUrl = BaseURL(
      `chat/single-chat?room=${activeChat?._id}&page=${page}&limit=${recordsLimit}`
    );
    page == 1 && setChatsLoading(true);
    const response = await Get(apiUrl, token);
    if (response !== undefined) {
      setChats([...response?.data?.data?.reverse(), ...chats]);
      setTotalChats(Math.ceil(response?.data?.totalRecords / recordsLimit));
    }
    page == 1 && setChatsLoading(false);
    page == 1 && scrollToBottom();
  };

  useEffect(() => {
    if (activeChat !== null) {
      getAllchats();
      socket.current?.emit("chatJoin", activeChat?._id, userData?._id);
      socket.current?.emit("mark-as-read", activeChat?.id, userData?._id);
      socket.current?.on("msg", (msg, room) => {
        if (activeChat?._id == room && msg.user !== userData?._id) {
          setChats((prev) => [...prev, msg]);
          socket.current?.emit("mark-as-read", activeChat?.id, userData?._id);
          scrollToBottom();
        }
      });
    }
  }, [activeChat]);

  async function sendMsg(text) {
    const to =
      userData?._id == activeChat?.user1?._id
        ? activeChat?.user2?._id
        : activeChat?.user1?._id;

    const message = {
      user: {
        _id: userData?._id,
        avatar: userData?.photo,
        name: userData?.fullName,
      },
      text: text,
    };
    setChats((prev) => [
      ...prev,
      {
        ...message,
        createdAt: moment(),
        _id: Math.floor(Math.random() * 100000),
      },
    ]);
    scrollToBottom();
    socket.current.emit("msg", message, to, activeChat?._id, userData?.role);
    return;
  }
  const roomUser =
    userData?._id == activeChat?.user1?._id
      ? activeChat?.user2
      : activeChat?.user1;

  return (
    <SidebarSkeleton>
      <div className={styles.content__wrapper}>
        {isMobile ? (
          !activeChat ? (
            <RoomListing
              setRoomsPage={setRoomsPage}
              roomsPage={roomsPage}
              totalRooms={totalRooms}
              rooms={rooms}
              roomsLoading={roomsLoading}
              activeChat={activeChat}
              activeChatHandler={activeChatHandler}
              search={search}
              setSeacrh={setSeacrh}
            />
          ) : (
            <>
              <ChatListing
                sendMsg={sendMsg}
                setActiveChat={setActiveChat}
                activeChat={activeChat}
                chats={chats}
                chatsPage={chatsPage}
                totalChats={totalChats}
                chatsLoading={chatsLoading}
                msgEndRef={msgEndRef}
                roomUser={roomUser}
                onLoadMore={() => {
                  const pg = chatsPage + 1;
                  setChatsPage(pg);
                  getAllchats(pg);
                }}
                isMobile={isMobile}
              />
            </>
          )
        ) : (
          <>
            <RoomListing
              setRoomsPage={setRoomsPage}
              roomsPage={roomsPage}
              totalRooms={totalRooms}
              rooms={rooms}
              roomsLoading={roomsLoading}
              activeChat={activeChat}
              activeChatHandler={activeChatHandler}
            />
            <ChatListing
              sendMsg={sendMsg}
              setActiveChat={setActiveChat}
              activeChat={activeChat}
              chats={chats}
              chatsPage={chatsPage}
              totalChats={totalChats}
              chatsLoading={chatsLoading}
              msgEndRef={msgEndRef}
              roomUser={roomUser}
              onLoadMore={() => {
                const pg = chatsPage + 1;
                setChatsPage(pg);
                getAllchats(pg);
              }}
              isMobile={isMobile}
            />
          </>
        )}
      </div>
    </SidebarSkeleton>
  );
};

export default Chats;
