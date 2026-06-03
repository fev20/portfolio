import { useParams } from "wouter";
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
        <p style={{ color: "#64ffda", fontFamily: "'JetBrains Mono', monospace" }}>
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
            color: "rgba(100,255,218,0.6)",
            marginBottom: "2rem",
            display: "block",
            padding: 0,
          }}
        >
          ← 돌아가기
        </button>

        {/* breadcrumb */}
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.75rem",
            color: "#4a5568",
            marginBottom: "0.5rem",
          }}
        >
          나는 지금 / {category.label}
        </p>

        {/* 제목 */}
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            fontWeight: 800,
            color: "#ccd6f6",
            marginBottom: "2rem",
          }}
        >
          {item.label}
        </h1>

        <div
          style={{
            background: "rgba(100,255,218,0.02)",
            border: "1px solid rgba(100,255,218,0.1)",
            borderRadius: "12px",
            padding: "2rem",
            minHeight: "300px",
          }}
        >
          {/* 텍스트 */}
          {item.content?.text ? (
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.95rem",
                color: "#8892b0",
                lineHeight: 1.8,
              }}
            >
              {item.content.text}
            </p>
          ) : (
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8rem",
                color: "#4a5568",
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
                  className="rounded-lg w-full object-cover"
                  style={{ border: "1px solid rgba(100,255,218,0.1)" }}
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
                    onClick={() => window.open(file.url, "_blank")}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 w-full text-left"
                    style={{
                    background: "rgba(100,255,218,0.03)",
                    border: "1px solid rgba(100,255,218,0.1)",
                    cursor: "pointer",
                    }}
                >
                    <span
                    style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.75rem",
                        color: "rgba(100,255,218,0.5)",
                    }}
                    >
                    📄
                    </span>
                    <span
                    style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "0.85rem",
                        color: "#a8b2d8",
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