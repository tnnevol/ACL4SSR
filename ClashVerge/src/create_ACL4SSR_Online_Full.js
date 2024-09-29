const fs = require("fs-extra");

const {createRuleProvidersByRuleset, createRuleProvidersMap} = require("./helper");

const {
    ACL4SSR_ONLINE_FULL_RULE_SET_TEMP,
    SCRIPT_OUT_PATH,
    RULE_PROVIDER_COMMON,
    GITHUB_RAW_BASE_URL,
    REVERSED_RULE_SET_NAME_DICT,
    DNS_CONFIG,
    GROUP_BASE_OPTION
} = require("./config");

async function createConfigScript() {
    const ruleProvidersMap = await createRuleProvidersMap(ACL4SSR_ONLINE_FULL_RULE_SET_TEMP)
    await createRuleProvidersByRuleset(
        ruleProvidersMap,
        "acl4ssr-online-full"
    );
    const ruleProviders = {};
    const rules = [];

    Object.keys(ruleProvidersMap).forEach((name) =>{
        ruleProviders[name] = {
            ...RULE_PROVIDER_COMMON,
            behavior: "classical",
            url: `${GITHUB_RAW_BASE_URL}/ClashVerge/dist/clash-rules/acl4ssr-online-full/${name}.txt`,
            path: `./ruleset/tnnevol/${name}.yaml`,
        };
        rules.push(`RULE-SET,${name},${REVERSED_RULE_SET_NAME_DICT[name]}`)
    })

    const scriptTemp = `
function getProxiesByRegex(proxies, regex, concatProxies = []) {
    return [
        ...proxies.filter((e) => regex.test(e.name)).map((e) => e.name),
        ...concatProxies,
    ];
}

const ruleProviders = ${JSON.stringify(ruleProviders, null, 2)};

const rules = [
    ...${JSON.stringify(rules, null, 2)},
    // 其他规则
    "GEOIP,LAN,🎯 全球直连,no-resolve",
    "GEOIP,CN,🎯 全球直连,no-resolve",
    "MATCH,🐟 漏网之鱼"
];

// 代理组通用配置
const groupBaseOption = ${JSON.stringify(GROUP_BASE_OPTION, null, 2)};

function main(config) {
    // 狮城地区
    const SingaporeRegex = /新加坡|坡|狮城|SG|Singapore/u;
    const SingaporeProxies = getProxiesByRegex(config.proxies, SingaporeRegex);

    // 日本地区
    const JapanRegex = /日本|川日|东京|大阪|泉日|埼玉|沪日|深日|JP|Japan|Tokyo/u;
    const JapanProxies = getProxiesByRegex(config.proxies, JapanRegex);

    // 美国地区
    const AmericaRegex =
        /美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|US|United States/u;
    const AmericaProxies = getProxiesByRegex(config.proxies, AmericaRegex);

    // 台湾地区
    const TaiwanRegex = /台|新北|彰化|TW|Taiwan/u;
    const TaiwanProxies = getProxiesByRegex(config.proxies, TaiwanRegex);

    // 🇭🇰 香港节点
    const HongKongRegex = /港|HK|hk|Hong Kong|HongKong|hongkong|Hongkong|🇭🇰/u;
    const HongKongProxies = getProxiesByRegex(config.proxies, HongKongRegex);

    // 🇺🇲 美国节点
    const US = {
        ...groupBaseOption,
        name: "🇺🇲 美国节点",
        type: "url-test",
        tolerance: 30,
        proxies: AmericaProxies,
    };

    // 🇭🇰 香港节点
    const HongKong = {
        ...groupBaseOption,
        name: "🇭🇰 香港节点",
        type: "url-test",
        tolerance: 30,
        proxies: HongKongProxies,
    };

    // 🇨🇳 台湾节点
    const Taiwan = {
        ...groupBaseOption,
        name: "🇨🇳 台湾节点",
        type: "url-test",
        tolerance: 30,
        proxies: TaiwanProxies,
    };

    // 🇯🇵 日本节点
    const Japan = {
        ...groupBaseOption,
        name: "🇯🇵 日本节点",
        type: "url-test",
        tolerance: 30,
        proxies: JapanProxies,
    };

    // 🇸🇬 狮城节点
    const Singapore = {
        ...groupBaseOption,
        name: "🇸🇬 狮城节点",
        type: "url-test",
        tolerance: 30,
        proxies: SingaporeProxies,
    };

    // 所有区域节点
    const allAreaGroup = [HongKong, Taiwan, US, Japan, Singapore]
        .filter((point) => {
            return point.proxies.length > 0;
        })
    const allAreaProxiesNames = allAreaGroup
        .map((point) => point.name);

    // 通用的节点组
    const commonProxies = [
        "♻️ 自动选择",
        "🚀 手动切换",
        "故障转移",
        "负载均衡(散列)",
        "负载均衡(轮询)",
        ...allAreaProxiesNames,
        "DIRECT",
    ];

    // 🎶 网易音乐
    const NetEaseRegex = /网易|音乐|解锁|Music|NetEase/u;
    const NetEaseProxies = getProxiesByRegex(config.proxies, NetEaseRegex, [
        "DIRECT",
        "🚀 节点选择",
        "♻️ 自动选择",
    ]);

    // 🎥 奈飞节点
    const NetflixRegex = /NF|奈飞|解锁|Netflix|NETFLIX|Media/u;
    const NetflixProxies = getProxiesByRegex(config.proxies, NetflixRegex, [
        "DIRECT",
        "REJECT"
    ]);


    // 覆盖原配置中DNS配置
    config["dns"] = ${JSON.stringify(DNS_CONFIG, null, 2)};
    // 覆盖原配置中的规则
    config["rule-providers"] = ruleProviders;
    config["rules"] = rules;
    
    
    config["proxy-groups"] = [
        {
            ...groupBaseOption,
            name: "🚀 节点选择",
            type: "select",
            proxies: commonProxies,
        },
        {
            ...groupBaseOption,
            name: "🔗 Ipv6",
            type: "select",
            "include-all": true
        },
        {
            ...groupBaseOption,
            name: "🚀 手动切换",
            type: "select",
            "include-all": true,
        },
        {
            ...groupBaseOption,
            name: "♻️ 自动选择",
            type: "url-test",
            tolerance: 100,
            "include-all": true,
        },
        {
            ...groupBaseOption,
            name: "故障转移",
            type: "fallback",
            "include-all": true,
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/ambulance.svg",
        },
        {
            ...groupBaseOption,
            name: "负载均衡(散列)",
            type: "load-balance",
            strategy: "consistent-hashing",
            "include-all": true,
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/merry_go.svg",
        },
        {
            ...groupBaseOption,
            name: "负载均衡(轮询)",
            type: "load-balance",
            strategy: "round-robin",
            "include-all": true,
            icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/balance.svg",
        },
        {
            ...groupBaseOption,
            url: "https://chatgpt.com",
            "expected-status": "200",
            name: "💬 OpenAi",
            type: "select",
            "include-all": true,
            filter:
                "AD|🇦🇩|AE|🇦🇪|AF|🇦🇫|AG|🇦🇬|AL|🇦🇱|AM|🇦🇲|AO|🇦🇴|AR|🇦🇷|AT|🇦🇹|AU|🇦🇺|AZ|🇦🇿|BA|🇧🇦|BB|🇧🇧|BD|🇧🇩|BE|🇧🇪|BF|🇧🇫|BG|🇧🇬|BH|🇧🇭|BI|🇧🇮|BJ|🇧🇯|BN|🇧🇳|BO|🇧🇴|BR|🇧🇷|BS|🇧🇸|BT|🇧🇹|BW|🇧🇼|BZ|🇧🇿|CA|🇨🇦|CD|🇨🇩|CF|🇨🇫|CG|🇨🇬|CH|🇨🇭|CI|🇨🇮|CL|🇨🇱|CM|🇨🇲|CO|🇨🇴|CR|🇨🇷|CV|🇨🇻|CY|🇨🇾|CZ|🇨🇿|DE|🇩🇪|DJ|🇩🇯|DK|🇩🇰|DM|🇩🇲|DO|🇩🇴|DZ|🇩🇿|EC|🇪🇨|EE|🇪🇪|EG|🇪🇬|ER|🇪🇷|ES|🇪🇸|ET|🇪🇹|FI|🇫🇮|FJ|🇫🇯|FM|🇫🇲|FR|🇫🇷|GA|🇬🇦|GB|🇬🇧|GD|🇬🇩|GE|🇬🇪|GH|🇬🇭|GM|🇬🇲|GN|🇬🇳|GQ|🇬🇶|GR|🇬🇷|GT|🇬🇹|GW|🇬🇼|GY|🇬🇾|HN|🇭🇳|HR|🇭🇷|HT|🇭🇹|HU|🇭🇺|ID|🇮🇩|IE|🇮🇪|IL|🇮🇱|IN|🇮🇳|IQ|🇮🇶|IS|🇮🇸|IT|🇮🇹|JM|🇯🇲|JO|🇯🇴|JP|🇯🇵|KE|🇰🇪|KG|🇰🇬|KH|🇰🇭|KI|🇰🇮|KM|🇰🇲|KN|🇰🇳|KR|🇰🇷|KW|🇰🇼|KZ|🇰🇿|LA|🇱🇦|LB|🇱🇧|LC|🇱🇨|LI|🇱🇮|LK|🇱🇰|LR|🇱🇷|LS|🇱🇸|LT|🇱🇹|LU|🇱🇺|LV|🇱🇻|LY|🇱🇾|MA|🇲🇦|MC|🇲🇨|MD|🇲🇩|ME|🇲🇪|MG|🇲🇬|MH|🇲🇭|MK|🇲🇰|ML|🇲🇱|MM|🇲🇲|MN|🇲🇳|MR|🇲🇷|MT|🇲🇹|MU|🇲🇺|MV|🇲🇻|MW|🇲🇼|MX|🇲🇽|MY|🇲🇾|MZ|🇲🇿|NA|🇳🇦|NE|🇳🇪|NG|🇳🇬|NI|🇳🇮|NL|🇳🇱|NO|🇳🇴|NP|🇳🇵|NR|🇳🇷|NZ|🇳🇿|OM|🇴🇲|PA|🇵🇦|PE|🇵🇪|PG|🇵🇬|PH|🇵🇭|PK|🇵🇰|PL|🇵🇱|PS|🇵🇸|PT|🇵🇹|PW|🇵🇼|PY|🇵🇾|QA|🇶🇦|RO|🇷🇴|RS|🇷🇸|RW|🇷🇼|SA|🇸🇦|SB|🇸🇧|SC|🇸🇨|SD|🇸🇩|SE|🇸🇪|SG|🇸🇬|SI|🇸🇮|SK|🇸🇰|SL|🇸🇱|SM|🇸🇲|SN|🇸🇳|SO|🇸🇴|SR|🇸🇷|SS|🇸🇸|ST|🇸🇹|SV|🇸🇻|SZ|🇸🇿|TD|🇹🇩|TG|🇹🇬|TH|🇹🇭|TJ|🇹🇯|TL|🇹🇱|TM|🇹🇲|TN|🇹🇳|TO|🇹🇴|TR|🇹🇷|TT|🇹🇹|TV|🇹🇻|TW|🇹🇼|TZ|🇹🇿|UA|🇺🇦|UG|🇺🇬|US|🇺🇸|UY|🇺🇾|UZ|🇺🇿|VA|🇻🇦|VC|🇻🇨|VN|🇻🇳|VU|🇻🇺|WS|🇼🇸|YE|🇾🇪|ZA|🇿🇦|ZM|🇿🇲|ZW|🇿🇼"
        },
        ...[
            "📲 电报消息",
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
            ...groupBaseOption,
            name,
            type: "select",
            proxies: commonProxies
        })),
        {
            ...groupBaseOption,
            name: "🎥 奈飞视频",
            type: "select",
            proxies: ["🎥 奈飞节点", ...commonProxies],
        },
        {
            ...groupBaseOption,
            name: "🎥 奈飞节点",
            type: "select",
            proxies: NetflixProxies,
        },
        {
            ...groupBaseOption,
            name: "📺 巴哈姆特",
            type: "select",
            proxies: commonProxies,
        },
        {
            ...groupBaseOption,
            name: "📺 哔哩哔哩",
            type: "select",
            proxies: ["DIRECT", ...allAreaProxiesNames],
        },
        {
            ...groupBaseOption,
            name: "🎶 网易音乐",
            type: "select",
            proxies: NetEaseProxies,
        },
        {
            ...groupBaseOption,
            name: "🎯 全球直连",
            type: "select",
            proxies: ["DIRECT", "🚀 节点选择", "♻️ 自动选择"],
        },
        {
            ...groupBaseOption,
            name: "🛑 广告拦截",
            type: "select",
            proxies: ["REJECT", "DIRECT"],
        },
        {
            ...groupBaseOption,
            name: "🍃 应用净化",
            type: "select",
            proxies: ["REJECT", "DIRECT"],
        },
        ...allAreaGroup
    ];


    return config;
}
  `

    // 没有 dist 目录创建 dist 目录
    fs.ensureDirSync(SCRIPT_OUT_PATH, 0o2775);

    fs.writeFileSync(`${SCRIPT_OUT_PATH}/ACL4SSR_Online_Full.js`, scriptTemp);
}

createConfigScript();
