import process from 'node:process'
import { defineConfig } from '@kubb/core'
import { pluginClient } from '@kubb/plugin-client'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/plugin-ts'

const input = process.env.KUBB_INPUT ?? 'http://localhost:4111/api/openapi.json'

/**
 * 从指定 URL 拉取 OpenAPI JSON 文档
 */
async function fetchOpenApiDocument() {
  const response = await fetch(input)

  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAPI document from ${input}: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * 修复 Mastra OpenAPI 文档中无法被 Kubb 解析的 $ref 指针。
 *
 * 【问题】
 * Mastra 使用 z.toJSONSchema() 将 Zod schema 转为 JSON Schema，
 * 对于递归类型（如 z.json()、文件树），它会生成局部的 $defs / definitions 块，
 * 例如：
 *   { "properties": { "metadata": { "$ref": "#/$defs/__schema0" } }, "$defs": { "__schema0": { ... } } }
 *
 * 但 $ref 使用的是文档根相对路径（以 #/ 开头），Kubb 的 Oas.get() 会从文档根
 * 用 jsonpointer 查找 definitions / $defs，而文档根并不存在这些 key，导致：
 *   - Missing $ref pointer "#/definitions/__schema0". Token "definitions" does not exist.
 *   - Could not find a definition for #/definitions/__schema0.
 *   - Could not find a definition for #/$defs/__schema0.
 *
 * 【方案】
 * 自底向上遍历文档，将局部 $defs / definitions 中的 schema **内联**到
 * 引用它的位置，避免产生 Kubb 无法解析的 $ref。
 * 对于递归自引用（如 z.json() 的 JsonValue 引用自身），替换为空对象 {}，
 * TypeScript 会将 {} 解析为 any，与 Kubb 原本对无法解析 ref 的处理一致。
 *
 * 【受影响的 Mastra 端点】（截至 2026-05）
 * - POST /agents/{agentId}/signals  → #/definitions/__schema0
 * - /stored/skills（所有方法）       → #/definitions/__schema0
 * - /xl/sessions（所有方法）         → #/$defs/__schema0
 */
function sanitizeOpenApiDocument(doc: any): any {
  /**
   * 递归替换 $ref 为实际 schema 内容。
   * @param obj       要遍历的对象
   * @param defs      当前作用域的 $defs / definitions 集合
   * @param inlining  正在展开的 schema 名集合（用于检测递归自引用）
   */
  function inlineRefs(obj: any, defs: Record<string, any>, inlining: Set<string>): void {
    if (!obj || typeof obj !== 'object') return

    for (const [key, value] of Object.entries(obj)) {
      // 跳过 $defs / definitions 本身，它们不参与内联
      if (key === '$defs' || key === 'definitions') continue

      if (!value || typeof value !== 'object') continue

      // 如果 value 是一个 $ref，且指向本地 $defs / definitions，尝试内联
      if (typeof value.$ref === 'string') {
        const match = value.$ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/)
        if (match && defs[match[1]]) {
          const schemaName = match[1]
          if (inlining.has(schemaName)) {
            // 递归自引用：删除 $ref，保留空对象（TypeScript → any）
            delete value.$ref
          }
          else {
            // 将 schema 内容深拷贝后合并到 $ref 所在的对象，替代 $ref
            const schemaCopy = JSON.parse(JSON.stringify(defs[schemaName]))
            delete value.$ref
            Object.assign(value, schemaCopy)
            // 继续处理内联后内容中可能存在的嵌套 $ref
            inlining.add(schemaName)
            inlineRefs(value, defs, inlining)
            inlining.delete(schemaName)
          }
          continue // $ref 已被内联，不再递归进入 value
        }
      }

      // 递归处理子对象中的 $ref
      inlineRefs(value, defs, inlining)
    }
  }

  /**
   * 自底向上遍历文档。对每个包含 $defs / definitions 的节点：
   * 1. 将 $ref 替换为实际 schema（递归自引用替换为空对象）
   * 2. 删除 $defs / definitions 块
   */
  function processNode(obj: any): void {
    if (!obj || typeof obj !== 'object') return

    // 先递归处理子节点（自底向上，确保嵌套的 $defs 先被处理）
    for (const value of Object.values(obj)) {
      if (value && typeof value === 'object') {
        processNode(value)
      }
    }

    // 处理当前节点的 $defs / definitions
    for (const defsKey of ['$defs', 'definitions'] as const) {
      const defs = obj[defsKey]
      if (!defs || typeof defs !== 'object') continue

      // 在当前节点范围内内联所有 $ref
      inlineRefs(obj, defs, new Set())

      // 删除已处理的局部 $defs / definitions
      delete obj[defsKey]
    }
  }

  processNode(doc)

  /**
   * 为缺失 operationId 的端点生成确定性的操作名。
   *
   * 问题：某些 Mastra 端点没有设置 operationId，Kubb 自动从路径生成时
   * 会产生大小写不一致的命名（如 streamVNext → StreamVnext 或 StreamVNext），
   * 导致两份重复的生成文件（在 macOS 大小写不敏感文件系统上互相覆盖）。
   *
   * 方案：在 Kubb 处理之前，为每个缺失 operationId 的端点显式设置一个
   * 确定性的名称，按 Kubb 的命名约定：{method}{PascalCase路径段}。
   * 同时检测大小写冲突（macOS 兼容），为冲突的第二个名称加后缀 `Alt`。
   */
  function assignOperationIds(doc: any): void {
    const usedIds = new Set<string>() // 实际使用的 operationId
    const usedLower = new Set<string>() // 小写版，用于检测大小写冲突

    for (const [path, item] of Object.entries(doc.paths ?? {})) {
      for (const [method, op] of Object.entries(item as any)) {
        if (!['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace'].includes(method)) continue
        if ((op as any).operationId) {
          usedIds.add((op as any).operationId)
          usedLower.add((op as any).operationId.toLowerCase())
          continue
        }

        // 从路径生成操作名
        const segments = path.split('/').filter(Boolean)
        let id = method.toLowerCase()

        for (const segment of segments) {
          if (segment.startsWith('{') && segment.endsWith('}')) {
            // 路径参数：{agentId} → AgentId
            const param = segment.slice(1, -1)
            id += param.charAt(0).toUpperCase() + param.slice(1)
          }
          else {
            // 普通路径段：按 - 分割，每段首字母大写
            const parts = segment.split('-')
            for (const part of parts) {
              if (part.length === 0) continue
              id += part.charAt(0).toUpperCase() + part.slice(1)
            }
          }
        }

        // 冲突检测：如果小写版已存在，说明大小写撞了（macOS 兼容）
        const idLower = id.toLowerCase()
        if (usedLower.has(idLower)) {
          id += 'Alt'
        }

        // 处理完全相同的冲突（同路径不同方法等情况）
        let finalId = id
        let counter = 2
        while (usedIds.has(finalId)) {
          finalId = id + counter
          counter++
        }
        usedIds.add(finalId)
        usedLower.add(finalId.toLowerCase())
        ;(op as any).operationId = finalId
      }
    }
  }

  assignOperationIds(doc)

  return doc
}

export default defineConfig(async () => ({
  input: {
    data: sanitizeOpenApiDocument(await fetchOpenApiDocument()),
  },
  output: {
    path: './src/api/generated',
    lint: 'eslint',
    format: false,
    clean: true,
  },
  hooks: {
    done: ['find src/api/generated -name \'*.ts\' -exec sed -i \'\' "s/\\.ts\'/\'/g" {} +'],
  },
  plugins: [
    pluginOas({
      generators: [],
      group: {
        type: 'tag',
        name: ({ group }) => group,
      },
    }),
    pluginTs({
      output: {
        path: './types',
        barrelType: 'propagate',
      },
      group: {
        type: 'tag',
        name: ({ group }) => group,
      },
    }),
    pluginClient({
      output: {
        path: './clients',
        barrelType: 'propagate',
      },
      importPath: '~/api/client',
      dataReturnType: 'data',
      group: {
        type: 'tag',
        name: ({ group }) => group,
      },
    }),
  ],
}))
