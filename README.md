# full-access-guardian

AI Agent guardian that warns before dangerous operations. Works with any AI Agent framework that supports hooks.

## Overview

A universal safety skill for AI Agents that monitors operations and warns when dangerous actions are about to be executed. Designed for users who run in "full access" mode but still want safety checks.

**Compatible with: ZCode, Claude Code, Cursor, and any AI Agent with hook/pre-tool support.**

## Features

- PreToolUse hook monitors: `Bash`, `Write`, `Edit`, `Delete`
- Warns on dangerous patterns: `rm -rf`, `del`, `shutdown`, `curl POST`, etc.
- Non-blocking - AI makes final decision
- Clean warning format with operation details
- Framework agnostic - just needs Node.js for the hook script

## Installation

### For ZCode Users

1. Copy `SKILL.md` to `~/.zcode/skills/guardian/SKILL.md`
2. Copy `hooks/guardian.js` to `~/.zcode/hooks/guardian.js`
3. Add to `~/.zcode/cli/config.json`:

```json
{
  "hooks": {
    "enabled": true,
    "events": {
      "PreToolUse": [
        {
          "matcher": "Bash|Write|Edit|Delete",
          "hooks": [
            {
              "type": "command",
              "command": "node \"~/.zcode/hooks/guardian.js\"",
              "timeout": 5
            }
          ]
        }
      ]
    }
  }
}
```

### For Claude Code / Cursor Users

1. Copy `hooks/guardian.js` to your hooks directory
2. Configure the PreToolUse hook in your config
3. See your framework's hook documentation for the exact format

## Usage

When you run in "full access" mode, Guardian will silently warn before dangerous operations:

```
⚠️ [Guardian Alert] 检测到危险操作: "递归删除操作"
工具: Bash
输入: {"command":"rm -rf /some/path"}
建议: 确认用户明确要求此操作，且了解操作不可逆。
```

The AI sees the warning and can pause to reconsider.

## Supported Dangerous Patterns

| Pattern | Risk |
|---------|------|
| `rm -rf` | 递归删除 |
| `del` | 删除操作 |
| `shutdown` / `reboot` | 系统关机 |
| `curl -X POST/DELETE/PUT` | 外部请求 |
| `dd` / `fdisk` / `mkfs` | 磁盘危险命令 |

## Framework Compatibility

| Framework | Compatible | Notes |
|-----------|-----------|-------|
| ZCode | ✅ | Full support |
| Claude Code | ✅ | Hook system similar |
| Cursor | ✅ | TabNine / Compose hooks |
| Other | ⚡ | Any hook system that runs Node.js |

## License

MIT
