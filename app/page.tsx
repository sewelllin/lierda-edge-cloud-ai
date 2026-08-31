'use client';

import { useMemo, useState } from 'react';
import { Activity, ArrowDown, ArrowRight, Bot, Check, Cloud, Code2, Copy, Cpu, ExternalLink, Gauge, GitBranch, Play, RadioTower, RefreshCw, Send, TerminalSquare, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sdkRepositoryUrl = 'https://sdk.lierda.com/AI/aiot_bx1_cx1_sdk_general';
const sdkCloneCommand = 'git clone https://sdk.lierda.com/AI/aiot_bx1_cx1_sdk_general.git AIoT_BX1_CX1_SDK_General';

const practicePrompt = `你正在利尔达 BX1/CX1 AIoT SDK 工程中工作。SDK 仓库：${sdkRepositoryUrl}

首先确认当前目录包含 code/standalone/freertos/；若尚未获取工程，请指导用户从上述公开仓库克隆或下载，不要臆造其他地址。当前 SDK 仅支持 Linux 编译，推荐 Ubuntu 20.04/22.04。

请使用项目内可用的端侧 SDK Skill，自主完成“人感夜灯 + 状态上报”最佳实践。

目标：
1. PIR 检测到有人且处于夜间时，将灯光调为 40% 暖光；连续 60 秒无人则关灯。
2. 每次占用状态和灯光状态变化，都通过统一端云链路上报平台。
3. 支持平台下发开关、亮度、无人延时配置，并保留 OTA 升级能力。
4. 将设备日志、传感器数据和动作结果回流，作为 AI 判断是否达标的依据。

执行要求：
- 先读取工程、SDK 文档和已安装 Skill，说明计划与验收标准。
- 应用代码优先放在 code/standalone/freertos/apps/，可复用 code/standalone/freertos/apps/aiot_app/ 的网络、日志、设备控制与 OTA 能力；硬件差异通过 BSP/Board 层隔离。
- 修改真实工程并运行已有测试；必要时补充最小测试。
- 从 code/standalone/freertos/Boards/ecr6600/standalone 进入构建流程，编译固件；若检测到本地设备，优先调用 Skill 完成本地烧录，否则生成可追溯的 OTA 包。
- 在真实设备或硬件模拟器上验证：有人亮灯、无人关灯、状态上报、云端指令四条链路。
- 若日志或物理数据表明未通过，继续定位、修改、编译与验证，直到满足验收标准。
- 最后给出修改摘要、验证证据、固件产物位置和可回滚说明。

不要臆造工具名称或测试结果；遇到需要用户确认的硬件操作时，明确请求确认。`;

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
        <a className="brand" href="#top" aria-label="利尔达端云AI首页"><span className="brand-mark">Li</span><span>Lierda</span></a>
        <nav aria-label="主导航"><a href="#architecture">技术架构</a><a href="#quickstart">快速开始</a></nav>
        <a className="header-cta" href="#quickstart">运行最佳实践 <ArrowRight /></a>
      </header>

      <section id="top" className="hero section-shell">
        <div className="hero-copy">
          <div className="eyebrow"><span /> 端 · 云 · AI 一体化开发</div>
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
            <figure className="product-card product-wifi"><figcaption><b>Wi‑Fi</b><span>局域网 / 固定场景</span></figcaption><img src="/ai-card-wifi.png" alt="利尔达 Wi-Fi 版 AI 云卡正面" /></figure>
            <figure className="product-card product-cat"><figcaption><b>CAT.1</b><span>蜂窝网络 / 独立联网</span></figcaption><img src="/ai-card-cat1.png" alt="利尔达 CAT.1 版 AI 云卡正面" /></figure>
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
          <span className="section-kicker">QUICK START / 约 15 分钟</span><h2>最佳实践：人感夜灯 + 状态上报</h2>
          <p>一个小用例，跑通自然语言需求、端侧开发、IoT 上报、云端指令、烧录或 OTA，以及设备端验证的完整闭环。</p>
          <ul><li><Check /> PIR 检测与本地灯光控制</li><li><Check /> 属性、状态、日志统一上报</li><li><Check /> 云端配置与 OTA 下发</li><li><Check /> AI 根据物理数据继续自调试</li></ul>
          <div className="sdk-facts"><span>BX1 / CX1</span><span>FreeRTOS</span><span>Linux Build</span><span>Local Flash / OTA</span></div>
        </div>
        <div className="launch-card">
          <div className="launch-head"><div><span>CODEX TASK</span><h3>把用例交给本地 Codex</h3></div><Code2 /></div>
          <div className="start-step"><span>01</span><div><b>获取 BX1/CX1 SDK</b><small>公开 GitLab · main 分支</small></div></div>
          <div className="repository-box"><GitBranch /><code>AI/aiot_bx1_cx1_sdk_general</code><a href={sdkRepositoryUrl} target="_blank" rel="noreferrer" aria-label="打开 SDK 仓库"><ExternalLink /></a></div>
          <div className="repo-actions"><a href={sdkRepositoryUrl} target="_blank" rel="noreferrer">打开 SDK 仓库 <ArrowRight /></a><button onClick={copyRepository}><Copy /> {repoCopied ? '克隆命令已复制' : '复制克隆命令'}</button></div>
          <div className="start-step path-step"><span>02</span><div><b>选择本地工程</b><small>已获取工程时可直接定位</small></div></div>
          <label htmlFor="projectPath">本地项目目录 <small>可选</small></label>
          <input id="projectPath" value={projectPath} onChange={(event) => setProjectPath(event.target.value)} placeholder="C:\workspace\ai-device-demo" />
          <p className="field-help">填写后，Codex 会在该项目中创建新任务；留空则先打开新任务，再选择项目。</p>
          <div className="start-step run-step"><span>03</span><div><b>自然语言完成需求</b><small>修改 · 编译 · 烧录 / OTA · 端测</small></div></div>
          <Button className="launch-button" onClick={openCodex}><Play /> 唤起 Codex 并开始开发</Button>
          <button id="fallback" className="copy-button" onClick={copyPrompt}><Copy /> {copied ? '任务已复制' : '无法唤起？复制完整任务'}</button>
          <div className="launch-note"><span className="status-dot" /> 需要本机已安装 Codex 桌面应用</div>
        </div>
      </section>

      <footer><div className="section-shell footer-inner"><div className="brand footer-brand"><span className="brand-mark">Li</span><span>Lierda</span></div><p>把系统集成的复杂度交给平台，把产品创新的主动权留给开发者。</p><a href="#top">返回顶部 <ArrowRight /></a></div></footer>
    </main>
  );
}
