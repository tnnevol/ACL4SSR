const { ACL4SSR_ONLINE_FULL_RULE_SET_TEMP } = require("./config");
const createConfigScript = require("./createScript");

createConfigScript({
  temp: ACL4SSR_ONLINE_FULL_RULE_SET_TEMP,
  ruleProvidersName: "acl4ssr-online-full",
  scriptName: "ACL4SSR_Online_Full.js",
});
