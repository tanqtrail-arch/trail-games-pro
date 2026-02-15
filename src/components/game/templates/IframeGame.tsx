"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { GamePostMessage } from "@/types";
import type { GameResult } from "../GameEngine";

interface IframeGameProps {
  gameConfig: {
    id: string;
    title: string;
    skill_tags: { 思考力: number; 探究力: number; 創造力: number };
    template: {
      type: "iframe";
      url: string;
      params?: Record<string, string>;
      sandbox?: string;
    };
  };
  onFinish: (result: GameResult) => void;
}

type IframeStatus = "loading" | "ready" | "playing" | "error";

export default function IframeGame({ gameConfig, onFinish }: IframeGameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const statusRef = useRef<IframeStatus>("loading");
  const [status, setStatus] = useState<IframeStatus>("loading");
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Build iframe URL with params
  const iframeUrl = (() => {
    const base = gameConfig.template.url;
    const params = gameConfig.template.params;
    if (!params || Object.keys(params).length === 0) return base;
    const sep = base.includes("?") ? "&" : "?";
    const qs = new URLSearchParams(params).toString();
    return `${base}${sep}${qs}`;
  })();

  const sandbox = gameConfig.template.sandbox || "allow-scripts allow-same-origin";

  // Helper: send INIT_GAME to the iframe and mark as ready
  const sendInitGame = useCallback(() => {
    statusRef.current = "ready";
    setStatus("ready");
    iframeRef.current?.contentWindow?.postMessage(
      {
        type: "INIT_GAME",
        payload: {
          user_id: "current-user", // TODO: replace with actual user
          game_id: gameConfig.id,
          template: gameConfig.template,
        },
      },
      "*"
    );
  }, [gameConfig]);

  // Handle postMessage from iframe
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      // Only accept messages that look like TRAIL game messages
      const data = event.data as GamePostMessage;
      if (!data || typeof data.type !== "string") return;

      switch (data.type) {
        case "GAME_READY":
          if (statusRef.current === "loading") {
            sendInitGame();
          }
          break;

        case "GAME_STARTED":
          statusRef.current = "playing";
          setStatus("playing");
          startTimeRef.current = Date.now();
          break;

        case "GAME_PROGRESS":
          if ("payload" in data) {
            setProgress(data.payload);
          }
          break;

        case "GAME_COMPLETED":
          if ("payload" in data) {
            const { score, max_score, time_seconds, skills, details } = data.payload;
            const elapsed = time_seconds || Math.round((Date.now() - startTimeRef.current) / 1000);
            onFinish({
              score,
              maxScore: max_score,
              timeSeconds: elapsed,
              skills: skills || gameConfig.skill_tags,
              details: details?.map((d, i) => ({
                question: d.question || i + 1,
                correct: d.correct,
                time: d.time_seconds || 0,
              })) || [],
            });
          }
          break;

        case "GAME_ERROR":
          if ("payload" in data) {
            statusRef.current = "error";
            setStatus("error");
            setErrorMsg(data.payload.message);
          }
          break;
      }
    },
    [gameConfig, onFinish, sendInitGame]
  );

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  // Fallback: when iframe finishes loading, if GAME_READY was not received, init directly
  const handleIframeLoad = useCallback(() => {
    // Give a short delay for GAME_READY postMessage to arrive
    setTimeout(() => {
      if (statusRef.current === "loading") {
        sendInitGame();
      }
    }, 500);
  }, [sendInitGame]);

  // Loading timeout (15 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (statusRef.current === "loading") {
        statusRef.current = "error";
        setStatus("error");
        setErrorMsg("ゲームの読み込みがタイムアウトしました。ページを再読み込みしてください。");
      }
    }, 15000);
    return () => clearTimeout(timer);
  }, [status]);

  return (
    <div className="relative w-full h-screen bg-gray-900">
      {/* Status overlay */}
      {(status === "loading" || status === "error") && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/80">
          {status === "loading" && (
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-trail-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white text-sm font-medium">ゲームを読み込み中...</p>
            </div>
          )}
          {status === "error" && (
            <div className="text-center max-w-md px-4">
              <div className="text-4xl mb-4">!</div>
              <p className="text-white text-sm font-medium mb-2">エラーが発生しました</p>
              <p className="text-gray-400 text-xs mb-4">{errorMsg}</p>
              <button
                onClick={() => {
                  setStatus("loading");
                  setErrorMsg("");
                  iframeRef.current?.contentWindow?.location.reload();
                }}
                className="px-6 py-2 bg-trail-primary text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                再読み込み
              </button>
            </div>
          )}
        </div>
      )}

      {/* Progress bar */}
      {status === "playing" && progress && (
        <div className="absolute top-0 left-0 right-0 z-10 h-1 bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-trail-primary to-trail-secondary transition-all duration-300"
            style={{ width: `${(progress.current / progress.total) * 100}%` }}
          />
        </div>
      )}

      {/* iframe */}
      <iframe
        ref={iframeRef}
        src={iframeUrl}
        sandbox={sandbox}
        className="w-full h-full border-0"
        title={gameConfig.title}
        allow="autoplay"
        onLoad={handleIframeLoad}
      />
    </div>
  );
}
