import { useState, useEffect } from "react";
import { verifyAuth, canAccess, UserRole, FileProtection } from "@/utils/auth";
import LoginModal from "@/components/LoginModal";

interface ProtectedDownloadProps {
  url: string;
  filename: string;
  label?: string;
  protection: FileProtection;
}

export default function ProtectedDownload({
  url,
  filename,
  label,
  protection,
}: ProtectedDownloadProps) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    verifyAuth().then((res) => {
      if (res?.valid && res.role) setUserRole(res.role);
    });
  }, []);

  const download = () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  const handleClick = () => {
    if (canAccess(userRole, protection)) {
      download();
    } else if (userRole) {
      setAccessDenied(true);
      setTimeout(() => setAccessDenied(false), 3000);
    } else {
      setShowModal(true);
    }
  };

  const handleLoginSuccess = (role: UserRole) => {
    setUserRole(role);
    setShowModal(false);
    if (canAccess(role, protection)) {
      download();
    }
  };

  const accessible = canAccess(userRole, protection);

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 w-full text-left"
        style={{
          background: "rgba(100,255,218,0.03)",
          border: "1px solid rgba(100,255,218,0.1)",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(100,255,218,0.07)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(100,255,218,0.25)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(100,255,218,0.03)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(100,255,218,0.1)";
        }}
      >
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: accessible ? "rgba(100,255,218,0.5)" : "rgba(255,150,50,0.6)" }}>
          {accessible ? "📄" : "🔒"}
        </span>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.85rem", color: "#a8b2d8", flex: 1 }}>
          {label ?? filename}
        </span>
        {!accessible && (
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "rgba(255,150,50,0.5)" }}>
            restricted
          </span>
        )}
      </button>

      {accessDenied && (
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.72rem",
            color: "rgba(255,100,100,0.8)",
            marginTop: "0.4rem",
            paddingLeft: "0.5rem",
          }}
        >
          // 현재 계정으로는 이 파일을 다운로드할 수 없습니다
        </p>
      )}

      {showModal && (
        <LoginModal
          onSuccess={handleLoginSuccess}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}