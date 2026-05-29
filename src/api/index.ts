import * as admin from './generated/admin'
import * as mastra from './generated/mastra'
/**
 * API 客户端统一导出入口
 *
 * 组合 2 个命名空间，统一通过 api.xxx 访问：
 *   api.admin.getScreeningAutoFillForms(query)
 *   api.mastra.postAgentsAgentIdStream(agentId, data)
 */
export const api = {
  admin,
  mastra,
}
