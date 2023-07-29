// <type> [?scope]: <subject description>
// [?body]
// [?footer(s)]
// feat(模块名称): 本次提交主要更新信息-相关地址

module.exports = {
    "extends": ["@commitlint/config-conventional"],
    // https://commitlint.js.org/#/reference-rules
  
    rules: {
      "type-enum": [
        2,
        "always",
        ["feat", "fix", "refactor", "style", "docs", "test", "revert", "chore", "pref"]
      ],
      "type-case": [0],
      "type-empty": [0],
      "scope-empty": [0],
      "scope-case": [0],
      "subject-full-stop": [0, "never"],
      "subject-case": [0, "never"],
      "header-max-length": [0, "always", 72]
    },
    prompt: {
      messages: {
        skip: "",
        max: "upper %d chars",
        min: "%d chars at least",
        emptyWarning: "当前内容不能为空",
        upperLimitWarning: "over limit",
        lowerLimitWarning: "below limit"
      },
      questions: {
        type: {
          description: "Commit类型选择:",
          "enum": {
            feat: {
              description: "✨ 新需求+1"
            },
            pref: {
              description: "✨ 一些小优化"

            },
            fix: {
              description: "🐛 修复了一个bug"
            },
            refactor: {
              description: "📦 重构历史代码"
            },
            style: {
              description: "💎 样式优化"
            },
            docs: {
              description: "📚 文档修改"
            },
            test: {
              description: "🚨 补充测试用例"
            },
            revert: {
              description: "♻️ 回滚代码了"
            },
            chore: {
              description: "🗑 其他"
            }
          }
        },
        scope: {
          description: "目前在更新哪个模块呢 (component or path)?"
        },
        subject: {
          description: "简单介绍下更新了什么内容？"
        },
        body: {
          description: "是否有关联文档链接？"
        }
      }
    }
  };
