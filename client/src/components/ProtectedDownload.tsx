import { useState, useEffect } from "react";
import { FileText, Lock } from "lucide-react";
import { buildApiUrl, verifyAuth, canAccess, setCachedRole, UserRole, FileProtection } from "@/utils/auth";
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
      if (res?.valid && res.role) {
        setCachedRole(res.role as UserRole);
        setUserRole(res.role as UserRole);
      } else {
        setCachedRole(null);
        setUserRole(null);
      }
    });
  }, []);

  const showAccessDenied = () => {
    setAccessDenied(true);
    setTimeout(() => setAccessDenied(false), 3000);
  };

  const triggerDownload = (href: string, downloadName: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = downloadName;
    a.rel = "noopener noreferrer";
    a.click();
  };

  const getFileNameFromUrl = () => {
    try {
      const parsed = new URL(url, window.location.origin);
      return parsed.pathname.split("/").filter(Boolean).pop() ?? filename;
    } catch {
      return filename;
    }
  };

  const downloadPublicFile = () => {
    triggerDownload(url, filename);
  };

  const downloadProtectedFile = async () => {
    const protectedFileName = getFileNameFromUrl();
    const response = await fetch(
      buildApiUrl(`/api/files/${encodeURIComponent(protectedFileName)}`),
      { credentials: "include" }
    );

    if (response.status === 401) {
      setShowModal(true);
      return;
    }
    if (!response.ok) {
      showAccessDenied();
      return;
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    triggerDownload(objectUrl, filename);
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  };

  const handleClick = async () => {
    if (!protection) {
      downloadPublicFile();
      return;
    }

    const res = await verifyAuth();
    if (res?.valid && res.role) {
      setCachedRole(res.role as UserRole);
      setUserRole(res.role as UserRole);

      if (canAccess(res.role as UserRole, protection)) {
        await downloadProtectedFile();
      } else {
        showAccessDenied();
      }
    } else {
      setCachedRole(null);
      setUserRole(null);
      setShowModal(true);
    }
  };

  const handleLoginSuccess = async (role: UserRole) => {
    setCachedRole(role);
    setUserRole(role);
    setShowModal(false);
    if (canAccess(role, protection)) {
      await downloadProtectedFile();
    } else {
      showAccessDenied();
    }
  };

  const accessible = canAccess(userRole, protection);

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-sm)] transition-all duration-200 w-full text-left"
        style={{
          background: "var(--sage-soft)",
          border: "1px solid var(--line)",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "var(--sage-soft)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--line)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "var(--sage-soft)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--line)";
        }}
      >
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: accessible ? "var(--sage)" : "var(--rose)" }}>
          {accessible ? <FileText size={15} /> : <Lock size={15} />}
        </span>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--ink)", flex: 1 }}>
          {label ?? filename}
        </span>
        {!accessible && (
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "var(--rose)" }}>
            restricted
          </span>
        )}
      </button>

      {accessDenied && (
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.72rem",
            color: "var(--rose)",
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
