
import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { forwardmessage } from '../store/message';

const ForwardMessage = ({ selectmsg, onDone }) => {
  const { chatdata } = useSelector((state) => state.chat);
  const [showList, setShowList] = useState(false);
  const [sending, setSending] = useState(false);
  // ✅ multiple target chats select garna, ek check garda list band nahos
  const [selectedChats, setSelectedChats] = useState([]);
  const dispatch = useDispatch();

  const handleForwardClick = (e) => {
    e.stopPropagation();
    setShowList(true);
  };

  // ✅ chat select/deselect toggle garne (checkbox jasto)
  const toggleChatSelect = (chatId) => {
    setSelectedChats((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [...prev, chatId]
    );
  };

  // ✅ list band garda ra "cancel" garda state reset garne
  const closeAndReset = () => {
    setShowList(false);
    setSelectedChats([]);
    onDone?.();
  };

  const handleSendAll = async () => {
    if (!selectmsg || selectmsg.length === 0) {
      console.error("No messages selected to forward");
      return;
    }
    if (selectedChats.length === 0) {
      console.error("No target chat selected");
      return;
    }

    const messageIds = selectmsg
      .map((m) => m.id)
      .filter((id) => id !== undefined && id !== null);

    if (messageIds.length === 0) {
      console.error("selectmsg items have no valid 'id' field", selectmsg);
      return;
    }

    setSending(true);
    try {
      const payload = {
        messageIds,
        targetChatids: selectedChats,   // ✅ ekै API call ma sabai select gareko chat haru
      };
      console.log("forward payload:", payload);

      const result = await dispatch(forwardmessage(payload));

      if (result?.error) {
        console.error("Forward failed:", result.error);
        return; // error bhaye list khulai rakhne, band nagarne
      }

      // ✅ sabai sahi vaye matra list band garne — automatically euta send garepachi hataudaina
      closeAndReset();
    } catch (err) {
      console.error("Forward failed:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative">
      <p onClick={handleForwardClick} className="cursor-pointer hover:text-gray-300 text-white text-sm">
        forward
      </p>

      {showList && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          onClick={(e) => { e.stopPropagation(); closeAndReset(); }}
        >
          <div
            className="bg-gray-800 rounded-xl w-80 max-h-[70vh] overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-3 border-b border-gray-700">
              <p className="text-white font-semibold">
                Forward to {selectedChats.length > 0 && `(${selectedChats.length} selected)`}
              </p>
              <button onClick={closeAndReset} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="p-3 space-y-2 overflow-y-auto flex-1">
              {chatdata?.map((chat) => {
                const isSelected = selectedChats.includes(chat.id);
                return (
                  <div
                    key={chat.id}
                    onClick={() => toggleChatSelect(chat.id)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition
                      ${isSelected ? 'bg-violet-700/50 border border-violet-500' : 'bg-zinc-800 hover:bg-zinc-700'}
                    `}
                  >
                    <div>
                      <span className="text-white font-medium">
                        {chat.type === "private" ? chat.otherusername : chat.name}
                      </span>
                      <span className="text-zinc-400 text-xs ml-2">{chat.type}</span>
                    </div>

                    {/* ✅ checkbox — click garda toggle huncha, list band hudaina */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleChatSelect(chat.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="accent-violet-500 w-4 h-4"
                    />
                  </div>
                );
              })}
            </div>

            {/* ✅ ekै "Send" button le sabai selected chat lai euta call ma pathaucha */}
            <div className="p-3 border-t border-gray-700">
              <button
                disabled={sending || selectedChats.length === 0}
                onClick={handleSendAll}
                className="w-full py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? "sending..." : `send${selectedChats.length > 0 ? ` (${selectedChats.length})` : ""}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForwardMessage;
