import { useMemo, useState } from "react";

type ChatRoom = {
  id: number;
  name: string;
  lastMessage: string;
  updatedAt: string;
};

type Message = {
  id: number;
  fromMe: boolean;
  text: string;
  time: string;
};

const mockRooms: ChatRoom[] = [
  { id: 1, name: "철수", lastMessage: "내일 거래 가능할까요?", updatedAt: "10:20" },
  { id: 2, name: "영희", lastMessage: "가격 조금만 더 깎아주세요", updatedAt: "어제" },
  { id: 3, name: "민수", lastMessage: "사진 추가 가능해요?", updatedAt: "2일 전" },
];

const mockMessagesByRoom: Record<number, Message[]> = {
  1: [
    { id: 1, fromMe: false, text: "내일 거래 가능할까요?", time: "10:20" },
    { id: 2, fromMe: true, text: "네 가능해요! 시간은 언제가 좋으세요?", time: "10:21" },
  ],
  2: [
    { id: 1, fromMe: false, text: "가격 조금만 더 깎아주세요", time: "어제" },
    { id: 2, fromMe: true, text: "죄송해요 ㅠㅠ 이 가격이 최저예요!", time: "어제" },
  ],
  3: [{ id: 1, fromMe: false, text: "사진 추가 가능해요?", time: "2일 전" }],
};

export default function ChatPage() {
  const [selectedId, setSelectedId] = useState<number>(mockRooms[0]?.id ?? 0);
  const [draft, setDraft] = useState("");

  const rooms = useMemo(() => mockRooms, []);
  const messages = useMemo(() => mockMessagesByRoom[selectedId] ?? [], [selectedId]);

  const onSend = () => {
    if (!draft.trim()) return;
    alert(`(더미) 전송: ${draft}`);
    setDraft("");
  };

  return (
    <section>
      <div className="pageHeader">
        <h1 className="pageTitle">채팅</h1>
        <p className="pageDesc">대화 목록과 메시지를 확인할 수 있어요</p>
      </div>

      <div className="chatLayout">
        {/* 좌측: 채팅 목록 */}
        <aside className="chatList">
          {rooms.map((r) => (
            <button
              key={r.id}
              className={`chatItem ${r.id === selectedId ? "active" : ""}`}
              onClick={() => setSelectedId(r.id)}
              type="button"
            >
              <div className="chatAvatar">{r.name.slice(0, 1)}</div>
              <div className="chatInfo">
                <div className="chatTop">
                  <span className="chatName">{r.name}</span>
                  <span className="chatTime">{r.updatedAt}</span>
                </div>
                <div className="chatPreview">{r.lastMessage}</div>
              </div>
            </button>
          ))}
        </aside>

        {/* 우측: 대화창 */}
        <div className="chatRoom">
          <div className="chatRoomHeader">
            <div className="chatRoomTitle">
              {rooms.find((r) => r.id === selectedId)?.name ?? "대화"}
            </div>
            <div className="chatRoomSub">거래 관련 대화를 나눠보세요</div>
          </div>

          <div className="chatMessages">
            {messages.map((m) => (
              <div key={m.id} className={`msgRow ${m.fromMe ? "me" : "you"}`}>
                <div className="msgBubble">
                  <div className="msgText">{m.text}</div>
                  <div className="msgTime">{m.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="chatInputBar">
            <input
              className="chatInput"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="메시지를 입력하세요"
              onKeyDown={(e) => {
                if (e.key === "Enter") onSend();
              }}
            />
            <button className="chatSendBtn" type="button" onClick={onSend}>
              전송
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
