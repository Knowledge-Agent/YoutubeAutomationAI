# SEO 执行方案（首页 + Blog，收到关键词列表后）

## 目标

1. 整理首页关键词 SEO，提升核心词排名与首页转化能力。  
2. 对已有文章做关键词融合改写，提升已收录页面排名与点击率。  
3. 给已有文章补充配图，提升可读性、停留时长和社媒分享表现。  
4. 基于 YouTube Automation 主题持续产出新文章，形成稳定内容增量。  

## 你给我关键词后，我会先做什么

1. 对关键词做分组：
   - 核心词（品牌/产品主词）
   - 主题词（如 faceless youtube、youtube automation tools）
   - 问题词（how to / what is / best / vs）
   - 交易词（tool、software、pricing、review）
2. 建立关键词映射表：
   - `keyword -> 目标URL -> 内容类型(旧文改写/新文) -> 优先级`
3. 去重和防冲突：
   - 一个主关键词只绑定一个主页面，避免关键词内耗。

## 一、首页关键词 SEO SOP

### 1. 首页关键词落位文件

1. 英文首页配置：`/Users/wenyue.wei/Projects/YoutubeAutomationAI/src/config/locale/messages/en/pages/index.json`  
2. 中文首页配置：`/Users/wenyue.wei/Projects/YoutubeAutomationAI/src/config/locale/messages/zh/pages/index.json`  
3. 全站兜底 metadata：  
   - `/Users/wenyue.wei/Projects/YoutubeAutomationAI/src/config/locale/messages/en/common.json`
   - `/Users/wenyue.wei/Projects/YoutubeAutomationAI/src/config/locale/messages/zh/common.json`

### 2. 首页关键词改造位置

1. `metadata.title`：放 1 个核心主词 + 价值结果词。  
2. `metadata.description`：包含主词 + 场景词 + 行动词。  
3. `metadata.keywords`：主词 + 同义词 + 长尾词（控制在高相关范围内）。  
4. `page.sections.hero.title/description`：自然覆盖核心词和语义相关词。  
5. `page.sections.introduce/usage/benefits/faq/cta`：按模块分配关键词，不重复堆词。  

### 3. show_sections 与关键词策略

1. `show_sections` 继续生效，仅控制 section 是否展示。  
2. 可按 SEO 优先级保留：`hero`、`usage`、`benefits`、`faq`、`blog`、`cta`。  
3. 若临时隐藏某 section，对应关键词应迁移到仍展示的 section。  

### 4. 首页验收清单

1. 首页主关键词在 `title`、首屏首段、至少 1 个 H2 附近自然出现。  
2. FAQ 至少覆盖 3 个问题型长尾词。  
3. CTA 文案包含行动导向关键词（如 join/start/get）。  
4. 中英文首页关键词语义一致，但不做生硬直译。  

## 二、已有文章改写 SOP（融合关键词）

### 1. 盘点现有文章

- 目录：`/Users/wenyue.wei/Projects/YoutubeAutomationAI/content/posts`
- 读取每篇 frontmatter 与正文结构：
  - `title`
  - `description`
  - `tags`
  - `categories`
  - `created_at`

### 2. 改写原则

1. 保留原文主旨，不做“洗稿式”无意义替换。  
2. 每篇文章只设 1 个主关键词 + 3-6 个相关词。  
3. 关键词重点注入位置：
   - H1（标题）
   - 首段前 120 字
   - 2-3 个 H2 小节标题
   - 结尾 FAQ/总结段
   - `description`（meta 摘要来源）
4. 控制密度，优先语义自然，不堆砌。  

### 3. 旧文改写输出项

1. 更新 `title`（保证含主关键词且可点击）。  
2. 更新 `description`（120-160 字符左右，包含主词和行动语义）。  
3. 补充 1-2 段“实操步骤/清单化内容”。  
4. 增加内链：
   - 至少 2 条指向站内相关文章
   - 至少 1 条指向首页或核心转化页

## 三、已有文章配图 SOP

### 1. 配图位置

1. 封面图：frontmatter `image`  
2. 正文图：每 2-3 个 H2 至少 1 张图（教程型内容优先）  

### 2. 配图标准

1. 与段落主题强相关（工具界面/流程图/数据可视化优先）。  
2. 清晰度优先，尽量统一横图比例（建议 16:9）。  
3. 补充图片语义说明（alt 文案）用于 SEO。  
4. 避免版权风险来源（仅使用可商用图源或可复用截图）。  

### 3. DeepSearch 配图策略

1. 先按关键词 + 文章主题检索候选图。  
2. 过滤不相关、低质量、版权不明确素材。  
3. 每篇至少挑选：
   - 1 张封面图
   - 2-4 张正文图（视文章长度）

## 四、新增文章生产 SOP（按你指定流程）

### Step 1：检索 YouTube Automation

1. 按关键词簇检索 YouTube（如：`youtube automation`, `faceless channel`, `shorts workflow`）。  
2. 选取高相关视频池（优先近期、播放/互动较高、主题明确）。  

### Step 2：逐一抓取对应脚本

1. 抓取视频基础信息：
   - 标题
   - 链接
   - 频道
   - 发布时间
2. 抓取或整理 transcript/script。  
3. 提炼结构化要点：
   - 核心观点
   - 步骤方法
   - 工具推荐
   - 常见误区

### Step 3：融合关键词编写 Blog

1. 文章类型分两类并行：
   - `video-breakdown`（单视频拆解）
   - `topic-guide`（多视频综合指南，优先级更高）
2. 固定写作模板：
   - 结论先行
   - 场景/问题定义
   - 分步骤实操
   - 工具与对比
   - 常见错误
   - FAQ
   - 结尾 CTA + 内链
3. 每篇绑定：
   - 1 个主关键词
   - 3-6 个相关关键词

### Step 4：DeepSearch 补充合适配图

1. 按每个 H2 主题检索图。  
2. 封面图与正文图分别筛选。  
3. 统一风格后插入 MDX。  

## 五、发布前质检清单（必须过）

1. URL slug 清晰可读且包含主关键词。  
2. `title` 与首段语义一致，不标题党。  
3. 关键词分布自然，无明显堆砌。  
4. 内链数量达标（至少 3 条站内链接）。  
5. 图片可访问、相关性高、无明显版权风险。  
6. 首页 metadata 与 section 文案关键词分布自然。  
7. frontmatter 完整：
   - `title`
   - `description`
   - `created_at`
   - `author_name`
   - `image`
   - `categories`
   - `tags`

## 六、收到关键词后的交付节奏

1. 第 1 轮：先完成首页关键词改造（中英双语）。  
2. 第 2 轮：改写已有文章（优先 Top 5）。  
3. 第 3 轮：新增 3-5 篇文章（1 篇综合指南 + 2-4 篇拆解文）。  
4. 第 4 轮：根据表现继续迭代标题、首段、配图与内链。  

## 你接下来给我的内容（建议格式）

1. 关键词列表（可分核心词/长尾词）。  
2. 优先语言（英文优先或中英双语）。  
3. 想优先改写的文章 slug（如有）。  
4. 是否有禁用图源/偏好图源。  

---

拿到你的关键词后，我会直接按这份 SOP 开始执行：先做首页关键词 SEO，再改旧文、补图，最后批量生成新文。
