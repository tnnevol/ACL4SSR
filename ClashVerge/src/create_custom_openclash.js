const { CUSTOM_OPENCLASH_RULES_TEMP } = require("./config");
const createConfigScript = require("./createScript");

createConfigScript({
  temp: CUSTOM_OPENCLASH_RULES_TEMP,
  ruleProvidersName: "custom-openclash",
  scriptName: "custom_openclash.js",
  selecteExtensionGroup: [
    "🚀 GitHub",
    "🚀 测速工具",
    "🎥 AppleTV+",
    "🕊️ Twitter(X)",
    "💬 ChatGPT",
    "💬 Copilot",
    "🤖 AI服务",
    "🎶 TikTok",
    "🎥 DisneyPlus",
    "🎥 HBO",
    "🎥 PrimeVideo",
    "🎥 Emby",
    "🎮 Steam",
    "🎻 Spotify",
    "🛒 国外电商",
  ],
  extendsRules: [
    "GEOSITE,cn,🎯 全球直连,DIRECT",
    "GEOSITE,google-cn,🎯 全球直连,DIRECT",
    "GEOSITE,category-games@cn,🎯 全球直连,DIRECT",
    "GEOSITE,category-public-tracker,🎯 全球直连,DIRECT",
    "GEOSITE,openai,💬 ChatGPT,PROXY",
    "GEOSITE,anthropic,🤖 AI服务,PROXY",
    "GEOSITE,google-gemini,🤖 AI服务,PROXY",
    "GEOSITE,github,🚀 GitHub,PROXY",
    "GEOSITE,gfw,🚀 节点选择,PROXY",
    "GEOSITE,steam,🎮 Steam,PROXY",
    "GEOSITE,category-games,🎮 游戏平台,PROXY",
  ],
});
