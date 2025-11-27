/**
 * SysUserPageBo，用户信息业务分页查询对象
 */
export interface UserPageQueryParams {
  /**
   * 需要过滤的用户ID
   */
  checkUserFilter?: string[]
  /**
   * 数据权限（0科室 1全院）
   */
  dataRootList?: string[]
  /**
   * 科室ID
   */
  departmentIds?: string[]
  /**
   * 排序的方向desc或者asc
   */
  isAsc?: string
  /**
   * 用户名称
   */
  name?: string
  /**
   * 排序列
   */
  orderByColumn?: string
  /**
   * 当前页数
   */
  pageNum?: number
  /**
   * 分页大小
   */
  pageSize?: number
  /**
   * 帐号状态（0正常 1停用）
   */
  status?: string
  /**
   * 用户ID
   */
  userId?: string
  /**
   * 用户账号
   */
  userName?: string
  [property: string]: any
}

/**
 * TableDataInfoSysUserPageVo，表格分页数据对象
 */
export interface UserPageResponse {
  /**
   * 消息状态码
   */
  code: number
  /**
   * 当前页
   */
  current: number
  /**
   * 消息内容
   */
  msg: string
  /**
   * 列表数据
   */
  rows: SysUserPageVo[]
  /**
   * 每页总条数
   */
  size: number
  /**
   * 总记录数
   */
  total: number
  [property: string]: any
}

/**
 * SysUserPageVo
 */
export interface SysUserPageVo {
  /**
   * 用户出生日期
   */
  birth?: number
  /**
   * 创建时间
   */
  createTime: number
  /**
   * 数据权限（0科室 1全院）
   */
  dataRoot: string
  /**
   * 数据权限（0科室 1全院）
   */
  dataRootLabel?: string
  /**
   * 科室对象列表
   */
  departmentVoList: SysDepartmentVo[]
  /**
   * 用户学历
   */
  education?: string
  /**
   * 用户名称
   */
  name: string
  /**
   * 手机号
   */
  phone?: string
  /**
   * 角色对象
   */
  roleVoList: SysRoleVo[]
  /**
   * 用户性别
   */
  sex?: string
  /**
   * 用户性别
   */
  sexLabel?: string
  /**
   * 擅长
   */
  skillPoints?: string
  /**
   * 来源（0本系统 院方系统）
   */
  source: string
  /**
   * 来源（0本系统 院方系统）
   */
  sourceLabel?: string
  /**
   * 账号状态（0正常 1停用）
   */
  status: string
  /**
   * 账号状态（0正常 1停用）
   */
  statusLabel: string
  /**
   * 租户ID
   */
  tenantId: string
  /**
   * 职工简介
   */
  userDesc?: string
  /**
   * 用户ID
   */
  userId: string
  /**
   * 用户账号
   */
  userName: string
  /**
   * 用户职称
   */
  userTitle?: string
  /**
   * 用户职称
   */
  userTitleLabel: string
  /**
   * 工号
   */
  userWorkNo: string
  [property: string]: any
}

/**
 * SysDepartmentVo，科室视图对象 sys_department
 */
export interface SysDepartmentVo {
  /**
   * 祖级列表
   */
  ancestors: string
  /**
   * 科室编码
   */
  departmentCode: string
  /**
   * 科室（院区）名称
   */
  departmentDistrictName?: string
  /**
   * 科室名称
   */
  departmentName: string
  /**
   * 所属院区ID
   */
  districtId?: string
  /**
   * 院方标识
   */
  hospitalId: string
  /**
   * 上级院方标识
   */
  hospitalParentId?: string
  /**
   * 科室ID
   */
  id: string
  /**
   * 是否有子菜单
   */
  isChildren: boolean
  /**
   * 负责人
   */
  leader?: string
  /**
   * 层级1-4
   */
  level: number
  /**
   * 显示顺序
   */
  orderNum: number
  /**
   * 父科室ID
   */
  parentId: string
  /**
   * 父部门名称
   */
  parentName: string
  /**
   * 联系电话
   */
  phone?: string
  /**
   * 来源（0本系统 1院方系统）
   */
  source: string
  /**
   * 来源（0本系统 院方系统）
   */
  sourceLabel: string
  /**
   * 科室状态（0正常 1停用）
   */
  status: string
  /**
   * 同步患者状态（0正常 1停用）
   */
  syncPatientStatus: string
  /**
   * 同步用户状态（0正常 1停用）
   */
  syncUserStatus: string
  [property: string]: any
}

/**
 * SysRoleVo，角色信息视图对象 sys_role
 */
export interface SysRoleVo {
  /**
   * 创建时间
   */
  createTime: number
  /**
   * 数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）
   */
  dataScope: string
  /**
   * 部门树选择项是否关联显示
   */
  deptCheckStrictly: boolean
  /**
   * 用户是否存在此角色标识 默认不存在
   */
  flag?: boolean
  /**
   * 菜单树选择项是否关联显示
   */
  menuCheckStrictly: boolean
  /**
   * 选中菜单列表
   */
  menuIds?: string[]
  /**
   * 备注
   */
  remark?: string
  /**
   * 角色ID
   */
  roleId: string
  /**
   * 角色权限字符串
   */
  roleKey: string
  /**
   * 角色名称
   */
  roleName: string
  /**
   * 显示顺序
   */
  roleSort: number
  /**
   * 角色状态（0正常 1停用）
   */
  status: string
  superAdminRole: boolean
  [property: string]: any
}

export async function fetchUserList(params: UserPageQueryParams): Promise<UserPageResponse> {
  const myHeaders = new Headers()
  // TODO: Replace placeholder values with actual logic (e.g. from env or store)
  myHeaders.append('clientId', '{{CLIENTID}}')
  myHeaders.append('Authorization', 'Bearer {{ACCESS_TOKEN}}')
  myHeaders.append('Content-Type', 'application/json')

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(params),
    redirect: 'follow',
  }

  try {
    const response = await fetch('http://127.0.0.1:4523/m1/4895776-4551570-default/trickle/system/user/pageList', requestOptions)
    const result = await response.json()
    return result
  }
  catch (error) {
    console.error('error', error)
    throw error
  }
}
