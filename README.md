# full-access-guardian

Universal AI Agent safety guardian. Warns before dangerous operations. For example, the ZCode.

## Overview

AI Agent 的安全 Guardian——在执行危险操作前让 AI 自我检查。

**设计理念：** 不靠强制拦截，靠 AI 内心独白。危险操作前 AI 停下来想一下，有疑虑就问用户。

**核心思路：** AI 自己把自己教育好。通过在 system prompt 里加入 Guardian 指令，AI 会养成自我检查的习惯。

## Features

- **System Prompt 自注入**：安装后 AI 自动把 Guardian 指令加入自己的 system prompt
- **guardian_check 工具**：结构化危险命令检查
- **AI 内心独白**：危险操作前 AI 停下来思考
- **非阻塞**：Guardian 只警告，不拦截，AI 做最终决定
- **框架无关**：任何支持 Skill + System Prompt 的 AI Agent 框架都能用

## How It Works

### 安装流程

```
用户: "安装 guardian"
   ↓
AI 检测到 skill 触发
   ↓
AI 读取自己的 system prompt 配置
   ↓
AI 把 Guardian 安全指令写入 system prompt
   ↓
安装完成
```

### 运行时流程

```
AI 准备执行危险命令
   ↓
guardian_check 返回警告
   ↓
AI 向用户展示警告："这可能危险，我需要确认"
   ↓
用户确认 → AI 执行
用户拒绝 → AI 撤回
```

## Supported Dangerous Patterns

| Pattern | Risk |
|---------|------|
| `rm -rf`, `del /s /q` | 递归删除 |
| `dd`, `fdisk`, `mkfs` | 磁盘危险命令 |
| `shutdown`, `reboot` | 系统关机/重启 |
| `curl`/`wget` 发送敏感数据 | 数据外泄 |
| `chmod 777` | 权限过度开放 |
| `regedit` | 注册表修改 |

## Framework Compatibility

| Framework | Compatible | Notes |
|-----------|-----------|-------|
| ZCode | ✅ | Full support |
| HanaAgent | ✅ | Skill 兼容 OpenClaw 格式 |
| Claude Code | ✅ | 支持 skill + system prompt |
| Cursor | ✅ | 支持 skill + system prompt |
| Other | ⚡ | 任何支持 skill 机制 + system prompt 的框架 |

## Installation

### 通用安装

1. 复制 `SKILL.md` 到你的 skill 目录
2. 让 AI 执行"安装 guardian"命令
3. AI 会自动完成后续配置

### ZCode

```bash
cp SKILL.md ~/.zcode/skills/guardian/SKILL.md
```

然后对 AI 说"安装 guardian"。

### HanaAgent

1. 将 SKILL.md 放入 plugins 或 skills 目录
2. 对 AI 说"安装 guardian"
3. AI 会自动配置 system prompt

### Claude Code / Cursor

1. 复制 SKILL.md 到对应 skill 目录
2. 说"安装 guardian"
3. AI 自动完成配置

## Guardian 安全规则

安装后，AI 的 system prompt 会包含：

```
## Guardian 安全规则

1. 执行前自检：操作危险吗？涉及删除/系统修改/凭据暴露吗？
2. 危险操作识别：rm -rf, del, chmod 777, curl 发送敏感数据...
3. 有疑虑时：先告诉用户，等待确认，不要未经确认就执行
4. guardian_check 工具：危险命令前调用，获取结构化警告
```

## Guardian Tool

### guardian_check

```json
输入: { "command": "rm -rf /some/path", "tool": "bash" }

输出: {
  "dangerous": true,
  "risk_level": "high",
  "warning": "⚠️ 危险操作：递归删除...",
  "recommendations": ["确认路径正确", "考虑非递归删除"]
}
```

## License

MIT
