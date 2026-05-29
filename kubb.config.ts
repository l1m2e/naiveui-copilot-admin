/// <reference types="node" />
import process from 'node:process'
import { defineConfig } from '@kubb/core'
import { pluginClient } from '@kubb/plugin-client'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/plugin-ts'

const input = process.env.KUBB_INPUT ?? 'http://localhost:4111/api/openapi.json'

/**
 * 从后端拉取已清洗的 OpenAPI 文档。
 * 后端 middleware 已处理：内联局部 $ref、补全 operationId、按 prefix 过滤。
 */
async function fetchSubDoc(prefix: string) {
  const url = `${input}?prefix=${encodeURIComponent(prefix)}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAPI from ${url}: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

function makeConfig(name: string, data: any) {
  return {
    input: { data },
    output: {
      path: `./src/api/generated/${name}`,
      format: false,
      clean: true,
    },
    hooks: {
      done: [
      // 修复 Kubb 生成的 import 后缀（单引号和双引号）
        `find "src/api/generated/${name}" -name '*.ts' -exec sed -i '' "s/\\.ts'/'/g" {} +`,
        `find "src/api/generated/${name}" -name '*.ts' -exec sed -i '' 's/\\.ts"/"/g' {} +`,
        // 删除无意义的聚合函数文件（不以 HTTP 方法开头的 grouped client）
        // 限制 mindepth/maxdepth 为 2，避免误删嵌套子目录中的合法客户端文件（如 get/wellKnownAgentIdAgentCard/Json.ts）
        `find "src/api/generated/${name}/clients" -mindepth 2 -maxdepth 2 -type f -name '*.ts' ! -name 'index.ts' ! -name 'get*' ! -name 'post*' ! -name 'put*' ! -name 'patch*' ! -name 'delete*' -delete`,
        // 从 barrel 中移除已删除聚合函数的引用
        // [a-zA-Z] 匹配大小写开头的导出名（如 MCP、MCPClientVersions）
        `perl -i -ne 'print unless /^export \\{ [a-zA-Z]/ && m!/clients/! && !/^export \\{ (?:get|post|put|patch|delete|head)/' "src/api/generated/${name}/index.ts"`,
      ],
    },
    plugins: [
      pluginOas({
        generators: [],
        group: { type: 'tag', name: ({ group }) => group },
      }),
      pluginTs({
        output: { path: './types', barrelType: 'propagate' },
        group: { type: 'tag', name: ({ group }) => group },
      }),
      pluginClient({
        output: { path: './clients', barrelType: 'propagate' },
        importPath: '~/api/client',
        dataReturnType: 'data',
        group: { type: 'tag', name: ({ group }) => group },
      }),
    ],
  }
}

export default defineConfig(async () => [
  makeConfig('admin', await fetchSubDoc('/admin')),
  makeConfig('mastra', await fetchSubDoc('/api')),
])
