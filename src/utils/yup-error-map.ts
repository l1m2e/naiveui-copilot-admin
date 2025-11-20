import { setLocale } from 'yup'

/**
 * 设置 Yup 中文错误映射
 */
export function setupYupErrorMap() {
  setLocale({
    mixed: {
      default: '输入无效',
      required: '此项为必填项',
      notType: ({ type }) => {
        const typeMap: Record<string, string> = {
          string: '文本',
          number: '数值',
          boolean: '布尔值',
          date: '日期',
          array: '列表',
          object: '对象',
        }
        return `类型错误：应为 ${typeMap[type] || type}`
      },
    },
    string: {
      length: ({ length }) => `字符长度必须是 ${length} 个`,
      min: ({ min }) => `字符长度不能少于 ${min} 个`,
      max: ({ max }) => `字符长度不能超过 ${max} 个`,
      matches: '格式不符合要求',
      email: '邮箱格式不正确',
      url: '链接格式不正确',
      uuid: 'UUID 格式不正确',
      trim: '不能包含首尾空格',
      lowercase: '必须是小写字母',
      uppercase: '必须是大写字母',
    },
    number: {
      min: ({ min }) => `数值不能少于 ${min}`,
      max: ({ max }) => `数值不能超过 ${max}`,
      lessThan: ({ less }) => `数值必须小于 ${less}`,
      moreThan: ({ more }) => `数值必须大于 ${more}`,
      positive: '数值必须是正数',
      negative: '数值必须是负数',
      integer: '数值必须是整数',
    },
    date: {
      min: ({ min }) => `日期不能早于 ${new Date(min).toLocaleString()}`,
      max: ({ max }) => `日期不能晚于 ${new Date(max).toLocaleString()}`,
    },
    boolean: {},
    object: {
      noUnknown: '对象中包含未知字段',
    },
    array: {
      min: ({ min }) => `选择数量不能少于 ${min} 项`,
      max: ({ max }) => `选择数量不能超过 ${max} 项`,
      length: ({ length }) => `选择数量必须是 ${length} 项`,
    },
  })
}
