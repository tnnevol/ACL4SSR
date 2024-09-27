const fs = require("fs-extra");
const $axios = require("./service");

const {
    BLANK_LINE_REG,
    END_SPACE_REGEX,
    COMMENT_REG,
    COMMENT_REG2,
    CLASH_RULE_OUT_PATH,
    RULE_SET_NAME_DICT,
} = require("./config");

/**
 * 表示规则集列表的一个条目。
 * @typedef {Object} Ruleset
 * @property {string} name - 规则集的名称。
 * @property {string} src - 规则集的来源或路径。
 */


/**
 * 创建规则集对应的规则文件名称
 * @param {Ruleset[]} rulesetList
 * @return {Promise<{name: string, rules: string[]}>}
 */
async function createRuleProvidersMap(rulesetList) {
    const rulesList = await Promise.all(
        rulesetList.map(({src, name}) =>
            $axios.get(src).then((res) => {
                return {
                    name,
                    rules: res.data
                        // 注释
                        .replace(COMMENT_REG2, "")
                        // 不支持的通配符
                        .replace(/^USER-AGENT.*|URL-REGEX.*$/gm, "")
                        // 空行
                        .replace(BLANK_LINE_REG, "")
                        // 结尾
                        .replace(END_SPACE_REGEX, "")
                        .split("\n"),
                };
            })
        )
    );
    return rulesList.reduce((accMap, curr) => {
        const {name, rules} = curr;
        if (!accMap[name]) {
            accMap[name] = ["payload:", ...rules.map((rule) => `  - ${rule}`)];
        } else {
            accMap[name].push(...rules);
        }
        return accMap;
    }, {});
}


module.exports = {
    /**
     *
     * @param {string} rulesetsStr
     * @return {Ruleset[]}
     */
    createRulesetList: function (rulesetsStr) {
        const rulesetList = [
            /*  {
              name: "",
              src: "",
            }, */
        ];
        rulesetsStr
            .replace(COMMENT_REG, "")
            .replace(BLANK_LINE_REG, "")
            .replace(/^ruleset=/gm, "")
            .split("\n")
            .forEach((line) => {
                const [name, src] = line.split(",");
                if (!name || !RULE_SET_NAME_DICT[name] || !src) return;
                rulesetList.push({
                    name: RULE_SET_NAME_DICT[name],
                    src,
                });
            });
        return rulesetList;
    },

    /**
     * 创建规则集对应的规则文件
     * @param {Ruleset[]} rulesetList
     * @param {string} configType - 配置文件存放位置
     * @return {Promise<void>}
     */
    createRuleProvidersByRuleset: async function (rulesetList, configType) {
        const OUT_PATH = [CLASH_RULE_OUT_PATH, configType].filter(Boolean).join("/");
        const ruleProvidersMap = await createRuleProvidersMap(rulesetList);
        /*if (!fs.ensureDirSync(OUT_PATH)) {
            fs.mkdirSync(OUT_PATH);
        }*/
        fs.ensureDirSync(OUT_PATH)
        Object.entries(ruleProvidersMap).forEach(([name, rules]) => {
            fs.writeFileSync(`${OUT_PATH}/${name}.txt`, rules.join("\n"));
        });
    }
};

