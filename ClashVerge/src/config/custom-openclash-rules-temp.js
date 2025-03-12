const CUSTOM_OPENCLASH_RULES_TEMP = `;Custom_Clash_Rules
;全分组防 DNS 泄漏订阅转换模板
;作者：https://github.com/Aethersailor
;项目地址：https://github.com/Aethersailor/Custom_Clash_Rules
;该订阅模板为 Custom_OpenClash_Rules 项目的衍生项目
;基于 ACL4SSR 模板魔改而来，感谢原作者！


[custom]
;设置规则标志位
;以下规则，按照从上往下的顺序遍历，优先命中上位规则
;修改顺序会影响分流效果

ruleset=🔗 Ipv6,https://raw.githubusercontent.com/tnnevol/ACL4SSR/master/Clash/Ruleset/Ipv6.list
ruleset=🎯 全球直连,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Lan/Lan.list,28800
ruleset=🎯 全球直连,https://raw.githubusercontent.com/Aethersailor/Custom_OpenClash_Rules/main/rule/Custom_Direct.list,28800
ruleset=🚀 节点选择,https://raw.githubusercontent.com/Aethersailor/Custom_OpenClash_Rules/main/rule/Custom_Proxy.list,28800
ruleset=🚀 节点选择,https://raw.githubusercontent.com/tnnevol/ACL4SSR/master/Clash/ProxyGFWlistExtension.list
ruleset=🎯 全球直连,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Direct/Direct.list,28800
ruleset=🚀 节点选择,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/GoogleCNProxyIP.list,28800
ruleset=🎯 全球直连,https://raw.githubusercontent.com/Aethersailor/Custom_OpenClash_Rules/main/rule/Steam_CDN.list,28800
ruleset=🎯 全球直连,https://raw.githubusercontent.com/Aethersailor/Custom_OpenClash_Rules/main/rule/Game_Download_CDN.list,28800
ruleset=📲 电报消息,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Telegram/Telegram.list,28800
ruleset=🕊️ Twitter(X),https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Twitter/Twitter.list,28800
ruleset=💬 Copilot,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Copilot/Copilot.list,28800
ruleset=🚀 测速工具,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Speedtest/Speedtest.list,28800
ruleset=📹 油管视频,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/YouTube/YouTube.list,28800
ruleset=🎥 AppleTV+,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/AppleTV/AppleTV.list,28800
ruleset=🍎 苹果服务,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Apple/Apple.list,28800
ruleset=Ⓜ️ 微软服务,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Microsoft/Microsoft.list,28800
ruleset=🎯 全球直连,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/XiaoMi/XiaoMi.list,28800
ruleset=📢 谷歌FCM,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GoogleFCM/GoogleFCM.list,28800
ruleset=🇬 谷歌服务,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Google/Google.list,28800
ruleset=🎶 TikTok,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/TikTok/TikTok.list,28800
ruleset=🎥 Netflix,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Netflix/Netflix.list,28800
ruleset=🎥 DisneyPlus,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Disney/Disney.list,28800
ruleset=🎥 HBO,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/HBO/HBO.list,28800
ruleset=🎥 HBO,https://raw.githubusercontent.com/Aethersailor/Custom_OpenClash_Rules/refs/heads/main/rule/HBO_fix.list,28800
ruleset=🎥 PrimeVideo,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/AmazonPrimeVideo/AmazonPrimeVideo.list,28800
ruleset=🎥 Emby,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Emby/Emby.list,28800
ruleset=🎥 Emby,https://raw.githubusercontent.com/ddgksf2013/Filter/refs/heads/master/Emby.list,28800
ruleset=🎻 Spotify,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Spotify/Spotify.list,28800
ruleset=📺 巴哈姆特,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Bahamut/Bahamut.list,28800
ruleset=🎯 全球直连,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/ChinaMedia/ChinaMedia.list,28800
ruleset=🎯 全球直连,https://raw.githubusercontent.com/Aethersailor/Custom_OpenClash_Rules/refs/heads/main/rule/IPTVMainland_Domain.list,28800
ruleset=🌎 国外媒体,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/GlobalMedia/GlobalMedia.list,28800
ruleset=🛒 国外电商,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Amazon/Amazon.list,28800
ruleset=🛒 国外电商,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/AmazonIP/AmazonIP.list,28800
ruleset=🛒 国外电商,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/refs/heads/master/rule/Clash/Shopee/Shopee.list,28800
ruleset=🛒 国外电商,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Shopify/Shopify.list,28800
ruleset=🛒 国外电商,https://raw.githubusercontent.com/Aethersailor/Custom_OpenClash_Rules/refs/heads/main/rule/Ozon.list,28800
ruleset=🎯 全球直连,https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Download/Download.list,28800
;设置规则标志位结束`;

module.exports = CUSTOM_OPENCLASH_RULES_TEMP;
