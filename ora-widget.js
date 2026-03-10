/**
 * Ora/OraX Widget Embed Script (iframe mode)
 *
 * Usage (profile name or appId, tool defaults to "ora"):
 *   <script src="ora-widget.js" defer></script>
 *   <script>
 *     window.addEventListener("DOMContentLoaded", () => {
 *       window.initiateOraChatbot({ profile: "fashion" });
 *       // or: window.initiateOraChatbot({ tool: "orax", profile: "health" });
 *       // or: window.initiateOraChatbot({ appId: 5 });
 *     });
 *   </script>
 */
(function () {
  const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);

  // Auto-detect base URL from where this script is loaded
  const scriptSrc = document.currentScript && document.currentScript.src;
  const SCRIPT_BASE = scriptSrc
    ? scriptSrc.replace(/\/embed\/ora-widget\.js.*$/, "")
    : isLocalhost ? "http://localhost:3001" : "https://agenticonvo.com";

  window.initiateOraChatbot = function ({ appId, profile, tool, icon } = {}) {
    const ref = profile || appId;
    if (!ref) {
      console.error("Ora Chatbot requires a profile or appId.");
      return;
    }

    const toolType = tool || "ora";

    const CHAT_BASE = `${SCRIPT_BASE}/${toolType}/${ref}`;

    const DEFAULT_ICON_URL = `${SCRIPT_BASE}/assets/chatlogo.png`;

    const parentSite = window.location.hostname;
    const iframeId = "ora-chat-iframe";
    const chatUrl = `${CHAT_BASE}?widget=1&parent_site=${encodeURIComponent(parentSite)}`;

    const createIframe = () => {
      const iframe = document.createElement("iframe");
      iframe.id = iframeId;
      iframe.src = chatUrl;
      iframe.setAttribute("scrolling", "no");
      iframe.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 400px;
        height: 512px;
        border: none;
        overflow: hidden;
        display: block;
        z-index: 9998;
      `;
      document.body.appendChild(iframe);
    };

    // Create floating button
    const button = document.createElement("button");
    const iconImg = document.createElement("img");
    iconImg.src = icon || DEFAULT_ICON_URL;
    iconImg.alt = "Chat Icon";
    iconImg.style.cssText = "width:100%;height:100%;object-fit:contain;display:block;";

    button.appendChild(iconImg);
    button.title = `Chat with ${toolType === "orax" ? "OraX" : "Ora"}`;
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 48px;
      height: 48px;
      border: none;
      background: transparent;
      padding: 0;
      margin: 0;
      box-shadow: none;
      cursor: pointer;
      z-index: 9999;
    `;

    document.body.appendChild(button);

    button.addEventListener("click", () => {
      const iframe = document.getElementById(iframeId);
      if (iframe && iframe.style.display === "block") {
        window.postMessage({ type: "ORA_MINIMIZE" }, "*");
      } else if (!iframe) {
        createIframe();
      } else {
        iframe.style.display = "block";
      }
    });

    // Listen for minimize/close messages from the iframe
    window.addEventListener("message", (event) => {
      if (!event.data || typeof event.data.type !== "string") return;
      const chatFrame = document.getElementById(iframeId);
      if (event.data.type === "ORA_MINIMIZE" && chatFrame) {
        chatFrame.style.display = "none";
      }
      if (event.data.type === "ORA_CLOSE" && chatFrame) {
        chatFrame.remove();
      }
    });
  };
})();
