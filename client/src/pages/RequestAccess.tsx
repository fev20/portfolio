import { useState } from "react";
import { useLocation } from "wouter";
import { profile } from "@/data/portfolio";

const EXAMPLE_TEXT = `이름: 홍길동
소속: WHS / seKUrity 등 (공란은 가능은하나 확인하는데 시간이 오래걸릴 수 있습니다.)
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
      style={{ background: "var(--paper)" }}
    >
      <div
        className="w-full max-w-lg mx-4 rounded-[4px] p-8"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
        }}
      >
        {/* 헤더 */}
        <div className="mb-6">
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              color: "var(--sage)",
              marginBottom: "0.75rem",
            }}
          >
            $ request --access
          </p>
          <h1
            style={{
              letterSpacing: "normal",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: 800,
              color: "var(--ink)",
              marginBottom: "0.4rem",
            }}
          >
            비밀번호 요청하기
          </h1>
          <p
            style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.82rem",
              color: "var(--ink-muted)",
            }}
          >
            비밀번호를 모르시나요? 아래 형식으로 작성 후 전송해주시면 이메일로 안내드립니다.
          </p>
        </div>

        {/* 예시 */}
        <div
          className="mb-4 p-4 rounded-[4px]"
          style={{
            background: "var(--sage-soft)",
            border: "1px solid var(--line)",
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              color: "var(--sage)",
              marginBottom: "0.5rem",
            }}
          >
            // 작성 예시
          </p>
          <pre
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.78rem",
              color: "var(--ink-secondary)",
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
            className="w-full px-4 py-3 rounded-[2px] outline-none resize-none"
            style={{
              background: "var(--sage-soft)",
              border: "1px solid var(--line)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.85rem",
              color: "var(--ink)",
              lineHeight: 1.7,
            }}
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={handleSend}
            className="flex-1 py-2.5 rounded-[2px] transition-all duration-200"
            style={{
              background: "var(--sage-soft)",
              border: "1px solid var(--line)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.85rem",
              color: "var(--sage)",
              cursor: "pointer",
            }}
          >
            전송
          </button>
          <button
            onClick={() => setLocation("/login")}
            className="px-5 py-2.5 rounded-[2px]"
            style={{
              background: "var(--sage-soft)",
              border: "1px solid var(--line)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.85rem",
              color: "var(--ink-muted)",
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
