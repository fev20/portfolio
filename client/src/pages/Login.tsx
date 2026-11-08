import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { login, UserRole } from "@/utils/auth";

export default function Login() {
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPassword("");
    setSelectedRole("");
    setError("");
  }, []);

  const accounts = [
    { id: "admin", label: "admin", desc: "관리자", color: "var(--ink-secondary)" },
    { id: "sekurity", label: "seKUrity", desc: "세쿠리티 소속", color: "var(--sage)" },
    { id: "whs", label: "WHS", desc: "화이트햇스쿨 소속", color: "var(--rose)" },
  ];

  const selected = accounts.find((a) => a.id === selectedRole);

  const handleSubmit = async () => {
    if (!selectedRole || !password) return;
    setLoading(true);
    setError("");
    const result = await login(selectedRole, password);
    setLoading(false);
    if (!result) {
      setError("// 비밀번호가 올바르지 않습니다");
      setPassword("");
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--paper)" }}
    >
      <div
        className="w-full max-w-sm mx-4 rounded-[var(--radius)] p-8"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
        }}
      >
        {/* 헤더 */}
        <div className="mb-8">
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              color: "var(--sage)",
              marginBottom: "0.75rem",
            }}
          >
            $ authenticate --user
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
            로그인
          </h1>
          <p
            style={{
              fontFamily: "'Nunito Sans', sans-serif",
              fontSize: "0.82rem",
              color: "var(--ink-muted)",
            }}
          >
            권한이 필요한 파일을 열람하려면 로그인해주세요.
          </p>
        </div>

        {/* 계정 선택 드롭다운 */}
        <div className="mb-4 relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-[var(--radius-sm)] transition-all duration-200"
            style={{
              background: "var(--sage-soft)",
              border: `1px solid ${selected ? `color-mix(in srgb, ${selected.color} 34%, var(--line))` : "var(--line)"}`,
              cursor: "pointer",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.85rem",
                color: selected ? selected.color : "var(--ink-muted)",
              }}
            >
              {selected ? `${selected.label} — ${selected.desc}` : "계정 선택"}
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.7rem",
                color: "var(--sage)",
                transition: "transform 0.2s",
                display: "inline-block",
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ▾
            </span>
          </button>

          {/* 드롭다운 목록 */}
          {dropdownOpen && (
            <div
              className="absolute w-full mt-1 rounded-[var(--radius-sm)] overflow-hidden z-10"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
              }}
            >
              {accounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => {
                    setSelectedRole(acc.id);
                    setDropdownOpen(false);
                    setError("");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-150"
                  style={{
                    background: selectedRole === acc.id ? `color-mix(in srgb, ${acc.color} 7%, transparent)` : "transparent",
                    border: "none",
                    cursor: "pointer",
                    borderBottom: "1px solid var(--line)",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = `color-mix(in srgb, ${acc.color} 6%, transparent)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      selectedRole === acc.id ? `color-mix(in srgb, ${acc.color} 7%, transparent)` : "transparent";
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: acc.color,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: acc.color,
                      }}
                    >
                      {acc.label}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Nunito Sans', sans-serif",
                        fontSize: "0.7rem",
                        color: "var(--ink-muted)",
                      }}
                    >
                      {acc.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="mb-6">
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="password"
            className="w-full px-4 py-2.5 rounded-[var(--radius-sm)] outline-none"
            style={{
              background: "var(--sage-soft)",
              border: `1px solid ${error ? "var(--rose)" : "var(--line)"}`,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.88rem",
              color: "var(--ink)",
              letterSpacing: "0.1em",
            }}
          />
          {error && (
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.72rem",
                color: "var(--rose)",
                marginTop: "0.4rem",
              }}
            >
              {error}
            </p>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedRole}
            className="flex-1 py-2.5 rounded-[var(--radius-sm)] transition-all duration-200"
            style={{
              background: "var(--sage-soft)",
              border: "1px solid var(--line)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.85rem",
              color: loading || !selectedRole ? "var(--ink-muted)" : "var(--sage)",
              cursor: loading || !selectedRole ? "default" : "pointer",
            }}
          >
            {loading ? "확인 중..." : "로그인"}
          </button>
          <button
            onClick={() => setLocation("/")}
            className="px-5 py-2.5 rounded-[var(--radius-sm)]"
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

        {/* 비밀번호 요청 */}
        <button
          onClick={() => setLocation("/request-access")}
          className="w-full mt-3 py-2.5 rounded-[var(--radius-sm)] transition-all duration-200"
          style={{
            background: "transparent",
            border: "1px solid var(--line)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.78rem",
            color: "var(--ink-muted)",
            cursor: "pointer",
          }}
        >
          비밀번호 요청하기
        </button>
      </div>
    </div>
  );
}
