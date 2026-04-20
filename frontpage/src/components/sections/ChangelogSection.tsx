"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Tag, ExternalLink, History, ChevronDown } from "lucide-react";
import { useChangelogs } from "@/lib/release/context";

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function ReleaseCard({ release, isLatest }: { release: { tag: string; date: string; items: string[] }; isLatest: boolean }) {
    return (
        <div style={{ display: "flex", gap: "1.25rem" }}>
            {/* Dot */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: "0.2rem" }}>
                <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: isLatest ? "var(--accent)" : "var(--bg-2)",
                    border: `1.5px solid ${isLatest ? "var(--accent)" : "var(--border)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}>
                    <Tag size={12} color={isLatest ? "#fff" : "var(--text-subtle)"} />
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: isLatest ? "var(--text)" : "var(--text-muted)" }}>
                        {release.tag}
                    </span>
                    {isLatest && (
                        <span style={{
                            fontSize: "0.62rem",
                            fontWeight: 700,
                            color: "var(--accent)",
                            background: "rgba(220,38,38,0.12)",
                            border: "1px solid rgba(220,38,38,0.3)",
                            borderRadius: "999px",
                            padding: "0.12rem 0.5rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                        }}>
                            latest
                        </span>
                    )}
                    <span style={{ fontSize: "0.75rem", color: "var(--text-subtle)", marginLeft: "auto" }}>
                        {formatDate(release.date)}
                    </span>
                </div>

                <div className="glass" style={{
                    borderRadius: "var(--radius-lg)",
                    padding: "1rem 1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                }}>
                    {release.items.map((item) => (
                        <div key={item} style={{ display: "flex", gap: "0.55rem", alignItems: "flex-start" }}>
                            <span style={{ color: "var(--accent)", flexShrink: 0, display: "inline-flex", paddingTop: "0.22rem" }}>
                                <Check size={12} />
                            </span>
                            <span style={{ fontSize: "0.855rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                                {item}
                            </span>
                        </div>
                    ))}
                    <a
                        href={`https://github.com/henriqqw/AnimeCaos/releases/tag/${release.tag}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            fontSize: "0.72rem",
                            color: "var(--text-subtle)",
                            marginTop: "0.25rem",
                            textDecoration: "none",
                            transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-subtle)")}
                    >
                        Ver release no GitHub <ExternalLink size={10} />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function ChangelogSection() {
    const changelogs = useChangelogs();
    const [expanded, setExpanded] = useState(false);

    const latest = changelogs[0];
    const older = changelogs.slice(1);

    if (!latest) return null;

    return (
        <>
            <h2 style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--text-subtle)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
            }}>
                <History size={13} />
                Changelog
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Latest release — sempre visível */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                >
                    <ReleaseCard release={latest} isLatest />
                </motion.div>

                {/* Releases antigas — expansível */}
                <AnimatePresence>
                    {expanded && older.map((release, i) => (
                        <motion.div
                            key={release.tag}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3, delay: i * 0.06 }}
                        >
                            <ReleaseCard release={release} isLatest={false} />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Botão expandir/recolher */}
                {older.length > 0 && (
                    <button
                        type="button"
                        onClick={() => setExpanded((v) => !v)}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            color: "var(--text-subtle)",
                            background: "none",
                            border: "1px solid var(--border)",
                            borderRadius: "var(--radius)",
                            padding: "0.55rem 1rem",
                            cursor: "pointer",
                            transition: "color 0.2s, border-color 0.2s",
                            alignSelf: "flex-start",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.color = "var(--text)";
                            (e.currentTarget as HTMLElement).style.borderColor = "var(--text-subtle)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.color = "var(--text-subtle)";
                            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                        }}
                    >
                        <motion.span
                            animate={{ rotate: expanded ? 180 : 0 }}
                            transition={{ duration: 0.25 }}
                            style={{ display: "inline-flex" }}
                        >
                            <ChevronDown size={14} />
                        </motion.span>
                        {expanded ? "Recolher" : `Ver versões anteriores (${older.length})`}
                    </button>
                )}
            </div>
        </>
    );
}
