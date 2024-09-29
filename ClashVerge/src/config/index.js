const path = require('path');

// 去除空行正则
const BLANK_LINE_REG = /^(?:\s*\r?\n)+/gm;
// 结尾空白符
const END_SPACE_REGEX = /\s*$/g;
// ; 注释正则
const COMMENT_REG = /^\s*;.*\n?$/gm;
// # 注释正则
const COMMENT_REG2 = /^\s*#.*\n?$/gm;


const RULE_SET_NAME_DICT = {
    "🎯 全球直连": "LocalAreaNetwork",
    "🛑 广告拦截": "BanAD",
    "🍃 应用净化": "BanProgramAD",
    "📢 谷歌FCM": "GoogleFCM",
    "🔗 Ipv6": "Ipv6",
    "Ⓜ️ 微软Bing": "Bing",
    "Ⓜ️ 微软云盘": "OneDrive",
    "Ⓜ️ 微软服务": "Microsoft",
    "🍎 苹果服务": "Apple",
    "📲 电报消息": "Telegram",
    "💬 OpenAi": "OpenAi",
    "🎶 网易音乐": "NetEaseMusic",
    "🎮 游戏平台": "Games",
    "📹 油管视频": "YouTube",
    "🎥 奈飞视频": "Netflix",
    "📺 巴哈姆特": "Bahamut",
    "📺 哔哩哔哩": "Bilibili",
    "🌏 国内媒体": "ChinaMedia",
    "🌍 国外媒体": "ProxyMedia",
    "🚀 节点选择": "ProxyGFWlist",
};
// 反转键值对
const REVERSED_RULE_SET_NAME_DICT = Object.entries(RULE_SET_NAME_DICT).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
}, {});


const OUT_PATH = path.resolve(__dirname, "../../dist");

const CLASH_RULE_OUT_PATH = path.join(OUT_PATH, './clash-rules');

const SCRIPT_OUT_PATH = path.join(OUT_PATH, './scripts');

// ACL4SSR_ONLINE_FULL 规则模板
const ACL4SSR_ONLINE_FULL_RULE_SET_TEMP = `;去广告：支持
;自动测速：支持
;微软分流：支持
;苹果分流：支持
;增强中国IP段：支持
;增强国外GFW：支持

;设置规则标志位
ruleset=🎯 全球直连,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/LocalAreaNetwork.list
ruleset=🎯 全球直连,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/UnBan.list
ruleset=🛑 广告拦截,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanAD.list
ruleset=🍃 应用净化,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/BanProgramAD.list
ruleset=📢 谷歌FCM,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/GoogleFCM.list
ruleset=🎯 全球直连,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/GoogleCN.list
ruleset=🎯 全球直连,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/SteamCN.list
ruleset=🔗 Ipv6,https://raw.githubusercontent.com/tnnevol/ACL4SSR/master/Clash/Ruleset/Ipv6.list
ruleset=Ⓜ️ 微软Bing,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Bing.list
ruleset=Ⓜ️ 微软云盘,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/OneDrive.list
ruleset=Ⓜ️ 微软服务,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Microsoft.list
ruleset=🍎 苹果服务,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Apple.list
ruleset=📲 电报消息,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Telegram.list
ruleset=💬 OpenAi,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/OpenAi.list
ruleset=🎶 网易音乐,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/NetEaseMusic.list
ruleset=🎮 游戏平台,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Epic.list
ruleset=🎮 游戏平台,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Origin.list
ruleset=🎮 游戏平台,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Sony.list
ruleset=🎮 游戏平台,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Steam.list
ruleset=🎮 游戏平台,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Nintendo.list
ruleset=📹 油管视频,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/YouTube.list
ruleset=🎥 奈飞视频,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Netflix.list
ruleset=📺 巴哈姆特,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Bahamut.list
ruleset=📺 哔哩哔哩,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/BilibiliHMT.list
ruleset=📺 哔哩哔哩,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/Bilibili.list
ruleset=🌏 国内媒体,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaMedia.list
ruleset=🌍 国外媒体,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyMedia.list
ruleset=🚀 节点选择,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ProxyGFWlist.list
ruleset=🎯 全球直连,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaIp.list
ruleset=🎯 全球直连,https://raw.githubusercontent.com/tnnevol/ACL4SSR/master/Clash/Ruleset/CNCustom.list
ruleset=🎯 全球直连,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaDomain.list
ruleset=🎯 全球直连,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaCompanyIp.list
ruleset=🎯 全球直连,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Download.list`;

// 规则集通用配置
const RULE_PROVIDER_COMMON = {
    type: "http",
    format: "yaml",
    interval: 86400,
};
const GITHUB_RAW_BASE_URL = "https://raw.githubusercontent.com/tnnevol/ACL4SSR/refs/heads/master";


// 国内DNS服务器
const DOMESTIC_NAMESERVERS = [
    "https://dns.alidns.com/dns-query", // 阿里云公共DNS
    "https://doh.pub/dns-query", // 腾讯DNSPod
    "https://doh.360.cn/dns-query", // 360安全DNS
];
// 国外DNS服务器
const FOREIGN_NAMESERVERS = [
    "https://1.1.1.1/dns-query", // Cloudflare(主)
    "https://1.0.0.1/dns-query", // Cloudflare(备)
    "https://208.67.222.222/dns-query", // OpenDNS(主)
    "https://208.67.220.220/dns-query", // OpenDNS(备)
    "https://194.242.2.2/dns-query", // Mullvad(主)
    "https://194.242.2.3/dns-query", // Mullvad(备)
];
// DNS配置
const DNS_CONFIG = {
    enable: true,
    listen: "0.0.0.0:1053",
    ipv6: true,
    "use-system-hosts": false,
    "cache-algorithm": "arc",
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.1/16",
    "fake-ip-filter": [
        // 本地主机/设备
        "+.lan",
        "+.local",
        // Windows网络出现小地球图标
        "+.msftconnecttest.com",
        "+.msftncsi.com",
        // QQ快速登录检测失败
        "localhost.ptlogin2.qq.com",
        "localhost.sec.qq.com",
        // 微信快速登录检测失败
        "localhost.work.weixin.qq.com",
    ],
    "default-nameserver": ["223.5.5.5", "119.29.29.29", "1.1.1.1", "8.8.8.8"],
    nameserver: [...DOMESTIC_NAMESERVERS, ...FOREIGN_NAMESERVERS],
    "proxy-server-nameserver": [...DOMESTIC_NAMESERVERS, ...FOREIGN_NAMESERVERS],
    "nameserver-policy": {
        "geosite:private,cn,geolocation-cn": DOMESTIC_NAMESERVERS,
        "geosite:google,youtube,telegram,gfw,geolocation-!cn": FOREIGN_NAMESERVERS,
    },
};

// 代理组通用配置
const GROUP_BASE_OPTION = {
    interval: 300,
    timeout: 3000,
    url: "https://www.google.com/generate_204",
    lazy: true,
    "max-failed-times": 3,
    hidden: false,
};


module.exports = {
    BLANK_LINE_REG,
    END_SPACE_REGEX,
    COMMENT_REG,
    COMMENT_REG2,
    CLASH_RULE_OUT_PATH,
    ACL4SSR_ONLINE_FULL_RULE_SET_TEMP,
    RULE_SET_NAME_DICT,
    REVERSED_RULE_SET_NAME_DICT,
    OUT_PATH,
    SCRIPT_OUT_PATH,
    GITHUB_RAW_BASE_URL,
    RULE_PROVIDER_COMMON,
    DNS_CONFIG,
    GROUP_BASE_OPTION
};
