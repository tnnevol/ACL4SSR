const axios = require("axios");
const fs = require("fs-extra");

const $axios = axios.create({
  timeout: 8000,
});

// 去除空行正则
const blankLineReg = /^(?:\s*\r?\n)+/gm;
const endSpaceRegex = /\s*$/g;
// 去除注释正则
const commentReg = /^\s*;.*\n?$/gm;
const commentReg2 = /^\s*#.*\n?$/gm;

const rulesetsStr = `;去广告：支持
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

function createRulesetList() {
  const rulesetList = [
    /*  {
      name: "🎯 全球直连",
      src: "https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/LocalAreaNetwork.list",
    }, */
  ];
  rulesetsStr
    .replace(commentReg, "")
    .replace(blankLineReg, "")
    .replace(/^ruleset=/gm, "")
    .split("\n")
    .forEach((line) => {
      const [name, src] = line.split(",");
      if (!name || !src) return;
      rulesetList.push({
        name,
        src,
      });
    });
  return rulesetList;
}
// ^(.*)((,no-resolve)?)$
async function createRules() {
  const rulesetList = createRulesetList();
  const ruleLineList = await Promise.all(
    rulesetList.map((ruleset) =>
      $axios.get(ruleset.src).then((res) => {
        return res.data
          .replace(commentReg2, "")
          .replace(/^USER-AGENT.*|URL-REGEX.*$/gm, "")
          .replace(blankLineReg, "")
          .replace(endSpaceRegex, "")
          .replace(/^(.*?)(,no-resolve)?$/gm, `$1,${ruleset.name}$2`);
      })
    )
  );
  const rules = ruleLineList.map((ruleLine) => ruleLine.split("\n")).flat();
  rules.push(...["GEOIP,CN,🎯 全球直连", "MATCH,🐟 漏网之鱼"]);
  // fs.writeFileSync("./ruleset.txt", rules.join("\n"));
  return JSON.stringify(rules, null, 2);
}

async function createConfigScript() {
  const rules = await createRules();
  const scriptStr = `// 定义 main 函数
  function main(config) {
    // 所有地区 🚀 手动切换
    const allRegex = /自动|故障|流量|官网|套餐|机场|订阅/;
    const allProxies = config.proxies
      .filter((e) => !allRegex.test(e.name))
      .map((e) => e.name);
  
    // 狮城地区
    const SingaporeRegex = /新加坡|sg|SG|Singapore|🇸🇬|Singapore|坡/u;
    const SingaporeProxies = config.proxies
      .filter((e) => SingaporeRegex.test(e.name))
      .map((e) => e.name);
  
    // 日本地区
    const JapanRegex = /日本|JP|Japan|🇯🇵|Tokyo|Osaka|霓虹|jp/u;
    const JapanProxies = config.proxies
      .filter((e) => JapanRegex.test(e.name))
      .map((e) => e.name);
  
    // 美国地区
    const AmericaRegex =
      /美国|US|United States|America|🇺🇸|Los Angeles|San Jose|Phoenix|洛杉矶|🇺🇸|凤凰城|us|UnitedStates/u;
    const AmericaProxies = config.proxies
      .filter((e) => AmericaRegex.test(e.name))
      .map((e) => e.name);
  
    // 台湾地区
    const TaiwanRegex = /台湾|TW|Taiwan|🇹🇼|Taipei|台北/u;
    const TaiwanProxies = config.proxies
      .filter((e) => TaiwanRegex.test(e.name))
      .map((e) => e.name);
  
    // 🇭🇰 香港节点
    const HongKongRegex = /香港|HK|Hong Kong|🇭🇰/u;
    const HongKongProxies = config.proxies
      .filter((e) => HongKongRegex.test(e.name))
      .map((e) => e.name);
  
    // 🎶 网易音乐
    const NetEaseRegex = /网易|音乐|解锁|Music|NetEase/u;
    const NetEaseProxies = config.proxies
      .filter((e) => NetEaseRegex.test(e.name))
      .map((e) => e.name);
  
    // 🎥 奈飞节点
    const NetflixRegex = /NF|奈飞|解锁|Netflix|NETFLIX|Media/u;
    const NetflixProxies = config.proxies
      .filter((e) => NetflixRegex.test(e.name))
      .map((e) => e.name);
  
    // 🇺🇲 美国节点
    const US = {
      name: "🇺🇲 美国节点",
      type: "url-test",
      url: "https://www.gstatic.com/generate_204",
      interval: 120,
      tolerance: 30,
      timeout: 1000,
      lazy: true,
      proxies: AmericaProxies,
    };
  
    // 🇭🇰 香港节点
    const HongKong = {
      name: "🇭🇰 香港节点",
      type: "url-test",
      url: "https://www.gstatic.com/generate_204",
      interval: 120,
      tolerance: 30,
      timeout: 1000,
      lazy: true,
      proxies: HongKongProxies,
    };
  
    // 🇨🇳 台湾节点
    const Taiwan = {
      name: "🇨🇳 台湾节点",
      type: "url-test",
      url: "https://www.gstatic.com/generate_204",
      interval: 120,
      tolerance: 30,
      timeout: 1000,
      lazy: true,
      proxies: TaiwanProxies,
    };
  
    // 🇯🇵 日本节点
    const Japan = {
      name: "🇯🇵 日本节点",
      type: "url-test",
      url: "https://www.gstatic.com/generate_204",
      interval: 120,
      tolerance: 30,
      timeout: 1000,
      lazy: true,
      proxies: JapanProxies,
    };
  
    // 🇸🇬 狮城节点
    const Singapore = {
      name: "🇸🇬 狮城节点",
      type: "url-test",
      url: "https://www.gstatic.com/generate_204",
      interval: 120,
      tolerance: 30,
      timeout: 1000,
      lazy: true,
      proxies: SingaporeProxies,
    };
  
    // 🚀 节点选择
    const NodeSelect = {
      name: "🚀 节点选择",
      type: "select",
      proxies: [
        "♻️ 自动选择",
        "🇭🇰 香港节点",
        "🇨🇳 台湾节点",
        "🇺🇲 美国节点",
        "🇸🇬 狮城节点",
        "🇯🇵 日本节点",
        "🚀 手动切换",
        "DIRECT",
      ],
    };
    // 🔗 Ipv6
    const Ipv6 = {
      name: "🔗 Ipv6",
      type: "select",
      proxies: [
        "♻️ 自动选择",
        "🇭🇰 香港节点",
        "🇨🇳 台湾节点",
        "🇺🇲 美国节点",
        "🇸🇬 狮城节点",
        "🇯🇵 日本节点",
        "🚀 手动切换",
        "DIRECT",
      ],
    };
  
    // 🚀 手动切换
    const ManualSwitch = {
      name: "🚀 手动切换",
      type: "select",
      proxies: allProxies,
    };
  
    // ♻️ 自动选择
    const Auto = {
      name: "♻️ 自动选择",
      type: "url-test",
      url: "https://www.gstatic.com/generate_204",
      interval: 120,
      tolerance: 30,
      timeout: 1000,
      lazy: true,
      proxies: allProxies,
    };
  
    const groups = (config["proxy-groups"] = []);
    // 规则
    const rules = [];
  
    // 插入分组
    groups.unshift(
      NodeSelect, // 节点选择
      Ipv6,
      ManualSwitch, // 手动切换
      Auto, // 自动切换
      ...[
        "📲 电报消息",
        "💬 OpenAi",
        "📹 油管视频",
        "🌍 国外媒体",
        "🌏 国内媒体",
        "📢 谷歌FCM",
        "Ⓜ️ 微软Bing",
        "Ⓜ️ 微软云盘",
        "Ⓜ️ 微软服务",
        "🍎 苹果服务",
        "🎮 游戏平台",
        "🐟 漏网之鱼",
      ].map((name) => ({
        name,
        type: "select",
        proxies: [
          "🇭🇰 香港节点",
          "🇨🇳 台湾节点",
          "🇺🇲 美国节点",
          "🇸🇬 狮城节点",
          "🇯🇵 日本节点",
          "🚀 手动切换",
          "DIRECT",
        ],
      })),
      {
        name: "🎥 奈飞视频",
        type: "select",
        proxies: [
          "🎥 奈飞节点",
          "🚀 节点选择",
          "♻️ 自动选择",
          "🇭🇰 香港节点",
          "🇨🇳 台湾节点",
          "🇺🇲 美国节点",
          "🇸🇬 狮城节点",
          "🇯🇵 日本节点",
          "🚀 手动切换",
          "DIRECT",
        ],
      },
      {
        name: "📺 巴哈姆特",
        type: "select",
        proxies: ["🇨🇳 台湾节点", "🚀 节点选择", "🚀 手动切换", "DIRECT"],
      },
      {
        name: "📺 哔哩哔哩",
        type: "select",
        proxies: ["🎯 全球直连", "🇨🇳 台湾节点", "🇭🇰 香港节点"],
      },
      {
        name: "🎶 网易音乐",
        type: "select",
        proxies: ["DIRECT", "🚀 节点选择", "♻️ 自动选择"].concat(NetEaseProxies),
      },
      {
        name: "🎯 全球直连",
        type: "select",
        proxies: ["DIRECT", "🚀 节点选择", "♻️ 自动选择"],
      },
      {
        name: "🛑 广告拦截",
        type: "select",
        proxies: ["DIRECT", "REJECT"],
      },
      {
        name: "🍃 应用净化",
        type: "select",
        proxies: ["DIRECT", "REJECT"],
      },
      HongKong,
      Japan,
      US,
      Taiwan,
      Singapore,
      {
        name: "🎥 奈飞节点",
        type: "select",
        proxies: NetflixProxies.concat(["REJECT", "DIRECT"]),
      }
    );
    // 插入规则
    config.rules = ${rules};
  
    return config;
  }
  `;
  fs.writeFileSync("./ACL4SSR_Online_Full.js", scriptStr);
}
createConfigScript();
