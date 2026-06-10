import { useState } from "react";
import { login, UserRole } from "@/utils/auth";

interface LoginModalProps {
  onSuccess: (role: UserRole) => void;
  onClose: () => void;
}

const accounts = [
  { id: "admin", label: "admin", desc: "관리자", color: "#f59e0b" },
  { id: "sekurity", label: "seKUrity", desc: "세쿠리티 소속", color: "#64ffda" },
  { id: "whs", label: "WHS", desc: "화이트햇스쿨 소속", color: "#a78bfa" },
];

export default function LoginModal({ onSuccess, onClose }: LoginModalProps) {
  const [selectedRole, setSelectedRole] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = accounts.find((a) => a.id === selectedRole);

  const handleSubmit = async () => {
    if (!selectedRole || !password) return;
    setLoading(true);
    setError("");
    const result = await login(selectedRole, password);
    setLoading(false);
    if (!result) {
      setError("// 아이디 또는 비밀번호가 올바르지 않습니다");
      setPassword("");
    } else {
      onSuccess(result.role);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(5,11,24,0.92)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm mx-4 rounded-xl p-6"
        style={{
          background: "rgba(15,23,42,0.98)",
          border: "1px solid rgba(100,255,218,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="mb-6">
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "rgba(100,255,218,0.5)", marginBottom: "0.5rem" }}>
            $ authenticate --restricted
          </p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#ccd6f6" }}>
            접근 제한 파일
          </h2>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.82rem", color: "#4a5568", marginTop: "0.25rem" }}>
            이 파일은 권한이 있는 계정만 다운로드할 수 있습니다.
          </p>
        </div>

        {/* 계정 선택 드롭다운 */}
        <div className="mb-3 relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg"
            style={{
              background: "rgba(100,255,218,0.04)",
              border: `1px solid ${selected ? selected.color + "55" : "rgba(100,255,218,0.15)"}`,
              cursor: "pointer",
            }}
          >
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: selected ? selected.color : "#4a5568" }}>
              {selected ? `${selected.label} — ${selected.desc}` : "계정 선택"}
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "rgba(100,255,218,0.4)", display: "inline-block", transition: "transform 0.2s", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
          </button>

          {dropdownOpen && (
            <div
              className="absolute w-full mt-1 rounded-lg overflow-hidden z-10"
              style={{ background: "rgba(15,23,42,0.99)", border: "1px solid rgba(100,255,218,0.15)" }}
            >
              {accounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => { setSelectedRole(acc.id); setDropdownOpen(false); setError(""); }}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-150"
                  style={{
                    background: selectedRole === acc.id ? `${acc.color}12` : "transparent",
                    border: "none",
                    cursor: "pointer",
                    borderBottom: "1px solid rgba(100,255,218,0.06)",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${acc.color}10`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = selectedRole === acc.id ? `${acc.color}12` : "transparent"; }}
                >
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: acc.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", fontWeight: 600, color: acc.color }}>{acc.label}</div>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.7rem", color: "#4a5568" }}>{acc.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="mb-4">
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="password"
            className="w-full px-4 py-2.5 rounded-lg outline-none"
            style={{
              background: "rgba(100,255,218,0.04)",
              border: `1px solid ${error ? "rgba(255,100,100,0.4)" : "rgba(100,255,218,0.15)"}`,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.88rem",
              color: "#ccd6f6",
              letterSpacing: "0.1em",
            }}
          />
          {error && (
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "rgba(255,100,100,0.8)", marginTop: "0.4rem" }}>
              {error}
            </p>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedRole}
            className="flex-1 py-2.5 rounded-lg transition-all duration-200"
            style={{
              background: "rgba(100,255,218,0.1)",
              border: "1px solid rgba(100,255,218,0.2)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.8rem",
              color: loading || !selectedRole ? "#4a5568" : "#64ffda",
              cursor: loading || !selectedRole ? "default" : "pointer",
            }}
          >
            {loading ? "확인 중..." : "로그인"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg"
            style={{
              background: "rgba(100,255,218,0.03)",
              border: "1px solid rgba(100,255,218,0.08)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.8rem",
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