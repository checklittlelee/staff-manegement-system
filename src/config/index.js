// 环境配置封装

// 1. 当前环境
const env = import.meta.env.MODE || "prod" // 如果没有MODE，则使用 prod生产环境

// 2. 定义环境配置对象，包含三个环境
const EnvConfig = {
  dev: {
    baseApi: "/api",
    mockApi: "https://mock.apifox.com/m1/4068509-0-default/api",
  },
  test: {
    baseApi: "//test.futurefe.com/api",
    mockApi: "https://mock.apipark.cn/m1/4068509-0-default/api",
  },
  prod: {
    baseApi: "//futurefe.com/api",
    mockApi: "https://mock.apipark.cn/m1/4068509-0-default/api",
  },
}

// 3. 根据当前环境，导出配置对象
export default {
  env,
  // mock: true,
  namespace: "manage", // 防止命名冲突、便于管理
  ...EnvConfig[env], // 根据当前环境展开相应的配置
}
