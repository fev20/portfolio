import { useParams } from "wouter";
import { FileText } from "lucide-react";
import { useLocation } from "wouter";
import { nowActivities } from "@/data/portfolio";

export default function ActivityDetail() {
  const params = useParams<{ category: string; item: string }>();
  const [, navigate] = useLocation();

  const category = nowActivities.find((c) => c.id === params.category);
  const item = category?.items.find((i) => i.id === params.item);

  if (!category || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: "var(--sage)", fontFamily: "'JetBrains Mono', monospace" }}>
          페이지를 찾을 수 없어요.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative py-20">
      <div className="container max-w-3xl mx-auto px-6">
        {/* 뒤로가기 */}
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.8rem",
            color: "var(--sage)",
            marginBottom: "2rem",
            display: "block",
            padding: 0,
          }}
        >
          ← cd ../about
        </button>

        {/* breadcrumb */}
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.75rem",
            color: "var(--ink-muted)",
            marginBottom: "0.5rem",
          }}
        >
          나는 지금 / {category.label}
        </p>

        {/* 제목 */}
        <h1
          style={{
            letterSpacing: "normal",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4vw, 2.75rem)",
            fontWeight: 800,
            color: "var(--ink)",
            marginBottom: "2rem",
          }}
        >
          {item.label}
        </h1>

        <div
          style={{
            background: "var(--sage-soft)",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius)",
            padding: "2rem",
            minHeight: "300px",
          }}
        >
          {/* 텍스트 */}
          {item.content?.texts && item.content.texts.length > 0 ? (
            <div className="space-y-3">
              {item.content.texts.map((text, index) => (
                <p
                  key={index}
                  style={{
                    fontFamily: "'Nunito Sans', sans-serif",
                    fontSize: "0.95rem",
                    color: "var(--ink-secondary)",
                    lineHeight: 1.8,
                  }}
                >
                  {text}
                </p>
              ))}
            </div>
          ) : (
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8rem",
                color: "var(--ink-muted)",
              }}
            >
              // 내용을 채워주세요
            </p>
          )}

          {/* 이미지 */}
          {item.content?.images && item.content.images.length > 0 && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {item.content.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="rounded-[var(--radius)] w-full object-cover"
                  style={{ border: "1px solid var(--line)" }}
                />
              ))}
            </div>
          )}

          {/* 파일 */}
          {item.content?.files && item.content.files.length > 0 && (
            <div className="mt-6 space-y-2">
              {item.content.files.map((file, i) => (
                <button
                    key={i}
                    onClick={() => window.open(file.url, "_blank", "noopener,noreferrer")}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-sm)] transition-all duration-200 w-full text-left"
                    style={{
                    background: "var(--sage-soft)",
                    border: "1px solid var(--line)",
                    cursor: "pointer",
                    }}
                >
                    <span
                    style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.75rem",
                        color: "var(--sage)",
                    }}
                    >
                    <FileText size={15} />
                    </span>
                    <span
                    style={{
                        fontFamily: "'Nunito Sans', sans-serif",
                        fontSize: "0.85rem",
                        color: "var(--ink)",
                    }}
                    >
                    {file.name}
                    </span>
                </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
