'use client';

import { useMemo, useState } from 'react';
import { Activity, ArrowDown, ArrowRight, Bot, Check, Cloud, Code2, Copy, Cpu, ExternalLink, Gauge, GitBranch, Play, RadioTower, RefreshCw, Send, TerminalSquare, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sdkRepositoryUrl = 'https://sdk.lierda.com/AI/aiot_bx1_cx1_sdk_general';
const sdkCloneCommand = 'git clone https://sdk.lierda.com/AI/aiot_bx1_cx1_sdk_general.git AIoT_BX1_CX1_SDK_General';

const practicePrompt = `你正在利尔达 BX1/CX1 AIoT SDK 工程中工作。

**任务**

实现“数字问答小游戏”，包括设备端固件和 Ubuntu PySide6 上位机。

上位机随机设置 0～999 的目标数字，设备使用原唤醒词接收语音并上传云端识别，将识别文字通过串口发送至上位机。上位机提取数字并判断答案，再将结果发送回设备，由外部音频芯片和喇叭播放“回答正确”或“回答错误”，随后自动进入下一题。

**任务需求**

- 上位机提供串口选择、连接、断开和重新检测功能；设备负责上传 ASR 结果和喇叭播放。
- 界面显示：游戏状态（未开始、进行中、结束）、ASR 结果、解析数字、判断结果（回答正确/回答错误）、回答正确题数、当前答题总数。
- 点击“开始游戏”后，检查并显示设备就绪状态；上位机随机生成目标数字并以大号字体突出显示，同时清零回答正确题数和当前答题总数。
- 必须确保唤醒后立即说话能够可靠上传，唤醒事件不得丢失。
- 上位机仅判断 ASR 最终结果，避免 ASR 中间结果触发多次判断。
- 支持中文答题，例如“一百二十三”“五八九”“答案是五百一十六”“结果是六七一”等表述。
- “回答正确/回答错误”的 OPUS 帧传到外部音频芯片；确保每一个独立 OPUS packet 的字节数小于允许的最大值。
- 小游戏期间完全禁止云端 TTS 播放，只允许播放“回答正确”或“回答错误”。
- 完成任务后使用 venv 安装所需依赖。
- README.md 必须包括：游戏说明、venv 创建与依赖安装、上位机运行方式、固件构建方式、串口参数和硬件连接。

**执行要求**

- 默认工作目录为 ~/lierda/quick_start，开始前主动询问用户是否需要指定其他工作目录。
- 检查工作目录是否存在；若不存在则创建。
- 确认工作目录中是否包含利尔达 BX1/CX1 AIoT SDK 工程：aiot_bx1_cx1_sdk_general/code/standalone/freertos/。
- 若尚未获取工程，从公开仓库克隆：${sdkRepositoryUrl}。
- 先阅读 SDK 文档、现有工程和可用 Skill，给出实施计划与验收标准。
- 修改真实工程，完成设备端固件、PySide6 上位机、串口协议、中文数字解析和音频反馈链路。
- 运行可用测试并补充必要的最小测试，重点验证最终 ASR 去重、中文数字解析、OPUS packet 大小和游戏状态切换。
- 编译固件，并在得到用户确认后通过本地烧录或 OTA 更新设备。
- 联调真实设备或硬件模拟器，结合模组日志、串口数据和上位机状态验证完整流程；未通过则继续修改、编译和验证。
- 最后提供修改摘要、运行步骤、测试证据、固件产物位置及可回滚说明。

不要臆造工具名称、设备状态或测试结果；涉及烧录、OTA、串口占用等硬件操作时，按需请求用户确认。`;

const architecture = [
  { icon: Cpu, label: '设备端', detail: 'AI 云模组 / 云卡 · 统一 SDK' },
  { icon: RadioTower, label: '轻量连接', detail: '语音 AI + 传统 IoT · 一条 TCP 链路' },
  { icon: Cloud, label: 'AIoT 平台', detail: '设备管理 · AI 交互 · 全链路可观测' },
  { icon: Bot, label: 'AI 开发', detail: 'Skill 调用 · 编译 · 烧录 / OTA · 端测' },
];

const loopSteps = [
  { icon: Code2, no: '01', title: '理解与修改', detail: 'AI 读取工程与端侧 Skill，把自然语言目标转成真实代码变更。' },
  { icon: TerminalSquare, no: '02', title: '编译与下发', detail: '自动构建固件，按研发阶段选择本地烧录或 OTA。' },
  { icon: Activity, no: '03', title: '设备端测', detail: '运行真实固件，验证传感器输入、动作输出与端云交互。' },
  { icon: RefreshCw, no: '04', title: '结果回流', detail: '日志、物理数据与执行结果回到 AI，未通过则继续迭代。' },
];

export default function Home() {
  const [projectPath, setProjectPath] = useState('');
  const [copied, setCopied] = useState(false);
  const [repoCopied, setRepoCopied] = useState(false);
  const codexUrl = useMemo(() => {
    const params = new URLSearchParams({ prompt: practicePrompt });
    if (projectPath.trim()) params.set('path', projectPath.trim());
    if (typeof window !== 'undefined') params.set('originUrl', window.location.href);
    return `codex://threads/new?${params.toString()}`;
  }, [projectPath]);

  async function copyPrompt() {
    await navigator.clipboard.writeText(practicePrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function copyRepository() {
    await navigator.clipboard.writeText(sdkCloneCommand);
    setRepoCopied(true);
    window.setTimeout(() => setRepoCopied(false), 1800);
  }

  function openCodex() {
    window.location.href = codexUrl;
    window.setTimeout(() => document.getElementById('fallback')?.focus(), 900);
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand site-title" href="#top" aria-label="端云AI集成开发模式体验首页">端云AI集成开发模式体验</a>
        <nav aria-label="主导航"><a href="#architecture">技术架构</a><a href="#quickstart">快速开始</a></nav>
        <a className="header-cta" href="#quickstart">运行最佳实践 <ArrowRight /></a>
      </header>

      <section id="top" className="hero section-shell">
        <div className="hero-copy">
          <div className="eyebrow"><span /> 端 · 云 · AI 集成开发</div>
          <h1>让 AI 不只写代码，<br /><em>更把需求跑到设备上。</em></h1>
          <p>一个端侧 SDK、一条轻量连接、一套 AIoT 平台。自然语言需求经由 Skill 进入真实工程，完成编译、烧录或 OTA，并用设备日志与物理数据自主验证。</p>
          <div className="hero-actions">
            <Button className="primary-action" onClick={openCodex}><Play /> 在 Codex 中开始</Button>
            <a className="text-link" href="#architecture">查看开发闭环 <ArrowRight /></a>
          </div>
          <div className="proof-row"><span>统一 SDK</span><i /><span>语音 AI + IoT 同链路</span><i /><span>Skill 自主开发</span><i /><span>设备端测闭环</span></div>
        </div>
        <div className="hero-visual" aria-label="端云AI开发闭环示意图">
          <div className="visual-grid" />
          <div className="device-card">
            <div className="device-top"><span>AI DEVICE</span><span className="status-dot" /></div>
            <div className="chip"><b>Lierda</b><small>AI CLOUD CORE</small></div>
            <div className="device-data"><span>PIR · 1</span><span>LIGHT · 40%</span></div>
          </div>
          <div className="signal signal-a"><span>LOG</span></div><div className="signal signal-b"><span>OTA</span></div>
          <div className="cloud-card"><Cloud /><div><b>AIoT Cloud</b><small>Observe · Decide · Deliver</small></div></div>
          <div className="loop-caption"><Code2 /> 修改 → 编译 → 下发 → 端测 → 回流</div>
        </div>
      </section>

      <section id="architecture" className="architecture section-shell">
        <div className="section-heading"><span>01 / DEVELOPMENT FABRIC</span><h2>从设备到平台，一条链路贯通</h2><p>语音、属性、状态、日志、指令、配置和 OTA 共享同一套端云通道。</p></div>
        <div className="architecture-rail">
          {architecture.map(({ icon: Icon, label, detail }, index) => (
            <article key={label} className="arch-node"><div className="arch-index">0{index + 1}</div><Icon /><h3>{label}</h3><p>{detail}</p>{index < architecture.length - 1 && <ArrowRight className="rail-arrow" />}</article>
          ))}
        </div>
      </section>

      <section className="same-link">
        <div className="section-shell same-link-inner">
          <div className="same-link-copy">
            <span>02 / ONE CONNECTION</span>
            <h2>语音 AI 与传统 IoT，<br />走同一条轻量链路</h2>
            <p>端侧统一 SDK 将不同类型的数据组织为统一数据帧。减少重复协议栈、连接维护和多方联调，让资源占用更轻、成本边界更清晰。</p>
          </div>
          <div className="data-lanes" aria-label="统一链路承载的数据类型">
            <div className="lane lane-up"><div><UploadCloud /><b>上行</b></div><span>音频</span><span>属性</span><span>状态</span><span>日志</span></div>
            <div className="lane-core"><div className="pulse" /><b>TCP 长连接</b><small>ONE SDK · ONE CHANNEL</small></div>
            <div className="lane lane-down"><div><ArrowDown /><b>下行</b></div><span>音频</span><span>指令</span><span>配置</span><span>OTA</span></div>
          </div>
        </div>
      </section>

      <section className="hardware section-shell">
        <div className="hardware-stage">
          <div className="hardware-copy">
            <span>03 / EDGE HARDWARE</span>
            <h2>一张 AI 云卡，<br />两种连接方式</h2>
            <p>Wi‑Fi 与 CAT.1 版本共享同一套上层开发模型。网络方式可按场景选择，应用代码和端云协同方式无需重来。</p>
            <div className="hardware-tags"><span>音频 I/O</span><span>设备控制</span><span>统一 SDK</span><span>日志回流</span></div>
          </div>
          <div className="product-stack">
            <figure className="product-card product-wifi"><figcaption><b>Wi‑Fi</b><span>局域网 / 固定场景</span></figcaption><img src="./ai-card-wifi.png" alt="利尔达 Wi-Fi 版 AI 云卡正面" /></figure>
            <figure className="product-card product-cat"><figcaption><b>CAT.1</b><span>蜂窝网络 / 独立联网</span></figcaption><img src="./ai-card-cat1.png" alt="利尔达 CAT.1 版 AI 云卡正面" /></figure>
          </div>
        </div>
      </section>

      <section className="platform-section">
        <div className="section-shell platform-grid">
          <div className="platform-console">
            <div className="console-bar"><span /><span /><span /><b>AIoT / Trace Explorer</b></div>
            <div className="trace-row"><em>00:00.000</em><span className="trace trace-device">DEVICE</span><small>音频帧 / 属性 / 状态</small></div>
            <div className="trace-row"><em>00:00.084</em><span className="trace trace-link">LINK</span><small>统一数据帧到达</small></div>
            <div className="trace-row"><em>00:00.312</em><span className="trace trace-ai">AI</span><small>Intent → Skill / Tool</small></div>
            <div className="trace-row"><em>00:00.748</em><span className="trace trace-cloud">CLOUD</span><small>动作编码下发</small></div>
            <div className="trace-row trace-active"><em>00:00.903</em><span className="trace trace-pass">PASS</span><small>设备动作与日志已回流</small></div>
          </div>
          <div className="platform-copy">
            <span>04 / OBSERVABILITY</span><h2>AI 看见真实世界，<br />才能自主调试。</h2>
            <p>平台把模组日志、设备状态、传感器数据和 AI 链路耗时放在同一个开发视野中。问题可定位，结果可验证，版本可发布也可回滚。</p>
            <div className="metric-grid"><div><Activity /><b>全链路可观测</b><small>从设备接入到 AI 返回</small></div><div><Gauge /><b>响应耗时分析</b><small>定位每个关键环节</small></div><div><Send /><b>数据流 API</b><small>开放接入业务系统</small></div></div>
          </div>
        </div>
      </section>

      <section className="dev-loop section-shell">
        <div className="section-heading loop-heading"><span>05 / AUTONOMOUS LOOP</span><h2>不是“生成代码”，而是“完成需求”</h2><p>Skill 把 AI 接入本地工具链与真实设备，终点从代码生成推进到设备效果验收。</p></div>
        <div className="loop-steps">
          {loopSteps.map(({ icon: Icon, no, title, detail }) => <article key={no}><span>{no}</span><Icon /><h3>{title}</h3><p>{detail}</p></article>)}
        </div>
        <div className="loop-rule"><RefreshCw /><b>未通过</b><span>继续修改 / 编译 / 下发 / 验证</span><i /><Check /><b>通过</b><span>交付可验证的设备效果</span></div>
      </section>

      <section id="quickstart" className="quickstart section-shell">
        <div className="quick-copy">
          <span className="section-kicker">QUICK START / DEVICE + DESKTOP</span><h2>最佳实践：数字问答小游戏</h2>
          <p>上位机随机出题，设备语音作答。AI 同时完成设备端固件、Ubuntu PySide6 上位机和串口联调，把需求推进到真实设备效果。</p>
          <ul><li><Check /> 0～999 随机数字出题</li><li><Check /> 最终 ASR 与中文数字解析</li><li><Check /> PySide6 串口上位机</li><li><Check /> OPUS 正误反馈与端测</li></ul>
          <div className="sdk-facts"><span>BX1 / CX1</span><span>PySide6</span><span>SERIAL</span><span>OPUS</span></div>
        </div>
        <div className="launch-card">
          <div className="launch-head"><div><span>CODEX TASK</span><h3>把用例交给本地 Codex</h3></div><Code2 /></div>
          <div className="start-step"><span>01</span><div><b>获取 BX1/CX1 SDK</b><small>公开 GitLab · main 分支</small></div></div>
          <div className="repository-box"><GitBranch /><code>AI/aiot_bx1_cx1_sdk_general</code><a href={sdkRepositoryUrl} target="_blank" rel="noreferrer" aria-label="打开 SDK 仓库"><ExternalLink /></a></div>
          <div className="repo-actions"><a href={sdkRepositoryUrl} target="_blank" rel="noreferrer">打开 SDK 仓库 <ArrowRight /></a><button onClick={copyRepository}><Copy /> {repoCopied ? '克隆命令已复制' : '复制克隆命令'}</button></div>
          <div className="start-step path-step"><span>02</span><div><b>准备工作目录</b><small>默认 ~/lierda/quick_start</small></div></div>
          <label htmlFor="projectPath">指定其他工作目录 <small>可选</small></label>
          <input id="projectPath" value={projectPath} onChange={(event) => setProjectPath(event.target.value)} placeholder="~/lierda/quick_start" />
          <p className="field-help">留空时 Codex 会先询问是否采用默认目录，并在目录不存在时创建；填写后则直接定位到指定目录。</p>
          <div className="start-step run-step"><span>03</span><div><b>自然语言完成小游戏</b><small>固件 + 上位机 · 串口联调 · 烧录 / OTA · 端测</small></div></div>
          <Button className="launch-button" onClick={openCodex}><Play /> 唤起 Codex 并开始开发</Button>
          <button id="fallback" className="copy-button" onClick={copyPrompt}><Copy /> {copied ? '任务已复制' : '无法唤起？复制完整任务'}</button>
          <div className="launch-note"><span className="status-dot" /> 需要本机已安装 Codex 桌面应用</div>
        </div>
      </section>

      <footer><div className="section-shell footer-inner"><div className="brand footer-brand"><span className="brand-mark">Li</span><span>Lierda</span></div><p>把系统集成的复杂度交给平台，把产品创新的主动权留给开发者。</p><a href="#top">返回顶部 <ArrowRight /></a></div></footer>
    </main>
  );
}
