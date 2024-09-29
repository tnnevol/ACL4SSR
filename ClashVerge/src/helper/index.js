const path = require('node:path')
const fs = require('fs-extra')
const {
  BLANK_LINE_REG,
  END_SPACE_REGEX,
  COMMENT_REG,
  COMMENT_REG2,
  CLASH_RULE_OUT_PATH,
  RULE_SET_NAME_DICT,
} = require('../config')

const $axios = require('../service')

/**
 * 表示规则集列表的一个条目。
 * @typedef {object} Ruleset
 * @property {string} name - 规则集的名称。
 * @property {string} src - 规则集的来源或路径。
 */

/**
 *
 * @param {string} temp
 * @return {Ruleset[]}
 */
function createRulesetList(temp) {
  const rulesetList = [
    /*  {
          name: "",
          src: "",
        }, */
  ]
  temp
    .replace(COMMENT_REG, '')
    .replace(BLANK_LINE_REG, '')
    .replace(/^ruleset=/gm, '')
    .split('\n')
    .forEach((line) => {
      const [name, src] = line.split(',')
      if (!name || !RULE_SET_NAME_DICT[name] || !src)
        return
      rulesetList.push({
        name: RULE_SET_NAME_DICT[name],
        src,
      })
    })
  return rulesetList
}

module.exports = {
  createRulesetList,

  /**
   * 创建规则集对应的规则文件名称
   * @param {string} temp
   * @return {Promise<{name: string, rules: string[]}>}
   */
  async createRuleProvidersMap(temp) {
    const rulesetList = createRulesetList(temp)
    const rulesList = await Promise.all(
      rulesetList.map(({ src, name }) =>
        $axios.get(src).then((res) => {
          return {
            name,
            rules: res.data
            // 注释
              .replace(COMMENT_REG2, '')
            // 不支持的通配符
              .replace(/^USER-AGENT.*|URL-REGEX.*$/gm, '')
            // 空行
              .replace(BLANK_LINE_REG, '')
            // 结尾
              .replace(END_SPACE_REGEX, '')
              .split('\n'),
          }
        }),
      ),
    )
    return rulesList.reduce((accMap, curr) => {
      const { name, rules } = curr
      if (!accMap[name]) {
        accMap[name] = ['payload:', ...rules.map(rule => `  - ${rule}`)]
      }
      else {
        accMap[name].push(...rules.map(rule => `  - ${rule}`))
      }
      return accMap
    }, {})
  },
  /**
   * 创建规则集对应的规则文件
   * @param {{name: string, rules: string[]}} ruleProvidersMap
   * @param {string} configType - 配置文件存放位置
   * @return {Promise<void>}
   */
  async createRuleProvidersByRuleset(ruleProvidersMap, configType) {
    const OUT_PATH = path.join(CLASH_RULE_OUT_PATH, configType || '')
    fs.ensureDirSync(OUT_PATH, 0o2775)

    Object.entries(ruleProvidersMap).forEach(([name, rules]) => {
      fs.writeFileSync(`${OUT_PATH}/${name}.txt`, rules.join('\n'))
    })
  },
}
