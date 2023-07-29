/* eslint-disable no-undef */
// 使用pnpm管理依赖
console.log(process.env.npm_execpath)
if (!/yarn/.test(process.env.npm_execpath || "")) {
    console.warn("\u001b[33m请使用yarn管理该项目!.\u001b[39m\n");
    process.exit(1);
  }
