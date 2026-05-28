/**
 * 复制文本到剪贴板
 * 优先使用现代 Clipboard API (HTTPS),降级到 execCommand (HTTP/HTTPS 都支持)
 * @param text 要复制的文本内容
 * @returns Promise<boolean> 复制是否成功
 */
export async function copyText(text: string): Promise<boolean> {
  // 优先使用现代 Clipboard API (仅 HTTPS 环境)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    }
    catch (err) {
      console.warn('Clipboard API failed, fallback to execCommand:', err)
    }
  }

  // 降级方案:execCommand (HTTP/HTTPS 都支持)
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    textarea.style.top = '-9999px'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const successful = document.execCommand('copy')
    document.body.removeChild(textarea)
    return successful
  }
  catch (err) {
    console.error('Copy to clipboard failed:', err)
    return false
  }
}
