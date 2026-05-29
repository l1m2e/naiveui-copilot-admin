import * as _admin from './generated/admin'
import * as _mastra from './generated/mastra'
/**
 * API 客户端统一导出入口
 *
 * 组合 3 个命名空间，统一通过 api.xxx 访问：
 *   api.xl.postSessions(data, headers)
 *   api.admin.getScreeningAutoFillForms(query)
 *   api.mastra.postAgentsAgentIdStream(agentId, data)
 */
import * as _xl from './generated/xl'

export const api = {
  xl: _xl,
  admin: _admin,
  mastra: _mastra,
}
