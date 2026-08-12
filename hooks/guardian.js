#!/usr/bin/env node
/**
 * Guardian Hook - PreToolUse interceptor
 * Reads tool info from stdin (ZCode passes JSON via stdin)
 */

let inputData;
try {
  inputData = JSON.parse(require('fs').readFileSync(0, 'utf8'));
} catch (e) {
  // 如果无法解析输入，允许操作
  process.exit(0);
}

const toolName = inputData.tool_name || '';
const toolInput = JSON.stringify(inputData.tool_input || {});

// Dangerous patterns
const dangerousPatterns = [
  { pattern: /rm\s+-rf/i, risk: '递归删除操作' },
  { pattern: /del\s+/i, risk: '删除操作' },
  { pattern: /rmdir/i, risk: '目录删除' },
  { pattern: /drop\s+table/i, risk: '数据库删除表' },
  { pattern: /truncate/i, risk: '清空数据' },
  { pattern: /delete\s+from/i, risk: '数据库删除' },
  { pattern: /shutdown/i, risk: '系统关机' },
  { pattern: /reboot/i, risk: '系统重启' },
  { pattern: /dd\s+/i, risk: '磁盘写入命令' },
  { pattern: /fdisk/i, risk: '磁盘分区命令' },
  { pattern: /mkfs/i, risk: '格式化磁盘' },
  { pattern: /curl.*-X\s+(POST|DELETE|PUT)/i, risk: '外部POST请求' },
  { pattern: /wget.*--post/i, risk: '外部POST请求' },
  { pattern: /format\s+[a-z]:/i, risk: '格式化磁盘' },
];

// Check if dangerous
function checkDangerous(input) {
  for (const item of dangerousPatterns) {
    if (item.pattern.test(input)) {
      return item.risk;
    }
  }
  return null;
}

// Main check
const risk = checkDangerous(toolName + ' ' + toolInput);

if (risk) {
  const warning = {
    additionalContext: `⚠️ [Guardian Alert] 检测到危险操作: "${risk}"
工具: ${toolName}
输入: ${toolInput.substring(0, 200)}
建议: 确认用户明确要求此操作，且了解操作不可逆。`
  };
  console.log(JSON.stringify(warning));
}

// Exit 0 = allow (even if safe, no output needed)
process.exit(0);
