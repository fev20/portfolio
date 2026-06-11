import { useState } from "react";
import { useLocation } from "wouter";
import { profile } from "@/data/portfolio";

const EXAMPLE_TEXT = `이름: 홍길동
소속: WHS / seKUrity 등
요청 사유: seKUrity 자료 열람 권한을 요청드립니다.
연락받을 이메일: example@email.com`;

export default function RequestAccess() {
  const [, setLocation] = useLocation();
  const [content, setContent] = useState("");

  const handleSend = () => {
    const subject = "[Portfolio] 비밀번호 요청";
    const body = content.trim() || EXAMPLE_TEXT;
    const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "rgba(5,11,24,1)" }}
    >
      <div
        className="w-full max-w-lg mx-4 rounded-xl p-8"
        style={{
          background: "rgba(15,23,42,0.98)",
          border: "1px solid rgba(100,255,218,0.15)",
        }}
      >
        {/* 헤더 */}
        <div className="mb-6">
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              color: "rgba(100,255,218,0.5)",
              marginBottom: "0.75rem",
            }}
          >
            $ request --access
          </p>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.6rem",
              fontWeight: 800,
              color: "#ccd6f6",
              marginBottom: "0.4rem",
            }}
          >
            비밀번호 요청하기
          </h1>
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "0.82rem",
              color: "#4a5568",
            }}
          >
            계정이 없으신가요? 아래 형식으로 작성 후 전송해주시면 이메일로 안내드립니다.
          </p>
        </div>

        {/* 예시 */}
        <div
          className="mb-4 p-4 rounded-lg"
          style={{
            background: "rgba(100,255,218,0.04)",
            border: "1px solid rgba(100,255,218,0.1)",
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              color: "rgba(100,255,218,0.5)",
              marginBottom: "0.5rem",
            }}
          >
            // 작성 예시
          </p>
          <pre
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.78rem",
              color: "#8892b0",
              whiteSpace: "pre-wrap",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {EXAMPLE_TEXT}
          </pre>
        </div>

        {/* 입력 칸 */}
        <div className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="위 예시 형식대로 작성해주세요"
            rows={6}
            className="w-full px-4 py-3 rounded-lg outline-none resize-none"
            style={{
              background: "rgba(100,255,218,0.04)",
              border: "1px solid rgba(100,255,218,0.15)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.85rem",
              color: "#ccd6f6",
              lineHeight: 1.7,
            }}
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={handleSend}
            className="flex-1 py-2.5 rounded-lg transition-all duration-200"
            style={{
              background: "rgba(100,255,218,0.1)",
              border: "1px solid rgba(100,255,218,0.2)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.85rem",
              color: "#64ffda",
              cursor: "pointer",
            }}
          >
            전송
          </button>
          <button
            onClick={() => setLocation("/login")}
            className="px-5 py-2.5 rounded-lg"
            style={{
              background: "rgba(100,255,218,0.03)",
              border: "1px solid rgba(100,255,218,0.08)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.85rem",
              color: "#4a5568",
              cursor: "pointer",
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}