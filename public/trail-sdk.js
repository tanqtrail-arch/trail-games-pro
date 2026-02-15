// =============================================================================
// TRAIL Game SDK v1.0
// 外部ゲームがTRAILプラットフォームと通信するための軽量SDK
//
// 使い方:
//   <script src="https://your-domain.com/trail-sdk.js"></script>
//   <script>
//     const trail = new TrailSDK();
//
//     // ゲーム初期化データを受け取る
//     trail.onInit((payload) => {
//       console.log('Game ID:', payload.game_id);
//       startMyGame();
//     });
//
//     // ゲーム開始を通知
//     trail.started();
//
//     // 進捗を報告
//     trail.progress(3, 10); // 10問中3問目
//
//     // ゲーム完了を報告
//     trail.complete({
//       score: 80,
//       max_score: 100,
//       time_seconds: 45,
//       details: [
//         { question: '問題1', correct: true, time_seconds: 5 },
//         { question: '問題2', correct: false, time_seconds: 8 },
//       ],
//     });
//   </script>
// =============================================================================

(function (global) {
  "use strict";

  function TrailSDK() {
    this._initCallback = null;
    this._pauseCallback = null;
    this._resumeCallback = null;
    this._resetCallback = null;

    var self = this;

    // Listen for messages from the host
    global.addEventListener("message", function (event) {
      var data = event.data;
      if (!data || typeof data.type !== "string") return;

      switch (data.type) {
        case "INIT_GAME":
          if (self._initCallback && data.payload) {
            self._initCallback(data.payload);
          }
          break;
        case "PAUSE_GAME":
          if (self._pauseCallback) self._pauseCallback();
          break;
        case "RESUME_GAME":
          if (self._resumeCallback) self._resumeCallback();
          break;
        case "RESET_GAME":
          if (self._resetCallback) self._resetCallback();
          break;
      }
    });

    // Notify the host that the game is ready
    this._post({ type: "GAME_READY" });
  }

  // Send a postMessage to the parent window
  TrailSDK.prototype._post = function (message) {
    if (global.parent && global.parent !== global) {
      global.parent.postMessage(message, "*");
    }
  };

  // Register callback for when the host sends init data
  TrailSDK.prototype.onInit = function (callback) {
    this._initCallback = callback;
    return this;
  };

  // Register callback for pause
  TrailSDK.prototype.onPause = function (callback) {
    this._pauseCallback = callback;
    return this;
  };

  // Register callback for resume
  TrailSDK.prototype.onResume = function (callback) {
    this._resumeCallback = callback;
    return this;
  };

  // Register callback for reset
  TrailSDK.prototype.onReset = function (callback) {
    this._resetCallback = callback;
    return this;
  };

  // Notify that the game has started
  TrailSDK.prototype.started = function () {
    this._post({ type: "GAME_STARTED" });
    return this;
  };

  // Report progress (e.g., question 3 of 10)
  TrailSDK.prototype.progress = function (current, total) {
    this._post({
      type: "GAME_PROGRESS",
      payload: { current: current, total: total },
    });
    return this;
  };

  // Report game completion with results
  TrailSDK.prototype.complete = function (result) {
    this._post({
      type: "GAME_COMPLETED",
      payload: {
        score: result.score,
        max_score: result.max_score,
        time_seconds: result.time_seconds || 0,
        skills: result.skills || null,
        details: result.details || [],
      },
    });
    return this;
  };

  // Report an error
  TrailSDK.prototype.error = function (message, code) {
    this._post({
      type: "GAME_ERROR",
      payload: { message: message, code: code || "UNKNOWN" },
    });
    return this;
  };

  // Expose to global scope
  global.TrailSDK = TrailSDK;
})(typeof window !== "undefined" ? window : this);
