# 個人作品集網站　完整修改紀錄（交接 Claude Design 校正用）

> 此文件逐條列出本次對網站的**所有**改動，含 before → after、中英文、定位錨點。供 Claude Design 校正文案／視覺。

---

## 0. 基本資訊與運作機制（務必先讀）

**改動檔案（兩個都改，內容一致）**
- `index.html`（主檔，深色主題、功能較完整）
- `deploy/index.html`（部署版，淺色主題、較舊精簡）
- 備份：`index.html.bak`、`deploy/index.html.bak`（同資料夾，可還原）
- 另有 `網站修改清單.md`（摘要版）與本檔（完整版）

**i18n 機制（影響你怎麼改字）**
- 文字有兩處來源：① HTML 內帶 `data-i18n="key"` 的預設文字；② `<script>` 內 `const I18N = { zh:{…}, en:{…} }` 字典。
- 進站時 `applyLang()` 會用**字典**覆寫所有 `[data-i18n]` 元素，預設語言 `zh`。→ **實際顯示以字典為準**；HTML 預設字只是載入前的瞬間值。
- 本次修改：字典（zh+en）與 HTML 預設字**兩邊都同步改**了，所以兩者一致。你之後若要改文案，**改字典即可**（HTML 預設字可一併改以免閃爍）。
- `applyLang` 規則：元素若有 `data-i18n-html="br"`，字典值中的 `\n` 會轉成 `<br>`；否則用 `textContent`。

**已知既有怪癖（非本次造成，未動，請評估）**
- `I18N.zh` 與 `I18N.en` 各有**重複鍵** `about.k`、`about.title`（定義兩次，JS 取後者）。導致頁面兩個 `關於我` 區塊標題會顯示成同一句（皆為「用特效／點亮每個畫面」）。本次未動，若要兩段標題不同需改鍵名。
- 頁面有兩個 `<section id="about">`（id 重複）。

**未更動項目**：聯絡方式（電話 0963-471-107、信箱 lijingchiu@yahoo.com.tw）、作品集 01–12 縮圖／影片與標題（虹塵作品，屬實）、`tools.k`（工具使用／Tools）、`about.k`、`about.title`、所有 `work.*`／`group.*`／`zone.*`／`nav.*` 鍵。

---

## 1. 定位（Hero／頁尾）— 中文 zh

| key | before | after |
|---|---|---|
| `hero.eyebrow` | `VFX ARTIST · UNITY3D SHADER` | `TECHNICAL ARTIST · GAME VFX · UNITY3D SHADER` |
| `foot.role` | `VFX Artist · 視覺特效師` | `遊戲特效設計師 · 技術美術` |

`hero.lede`
- before：`遊戲特效 × 沉浸式展覽 × AI 輔助開發 —\n以 Particle System 與 Shader 打造令人印象深刻的視覺體驗。`
- after：`遊戲特效 × 技術美術 × AI 輔助開發 —\n以 Particle System、Shader 與自製開發者工具，打造兼顧張力與效能的即時視覺。`

## 1b. 定位 — 英文 en

| key | before | after |
|---|---|---|
| `hero.eyebrow` | `VFX ARTIST · UNITY3D SHADER` | `TECHNICAL ARTIST · GAME VFX · UNITY3D SHADER` |
| `foot.role` | `VFX Artist · Unity3D Shader` | `Game VFX Artist · Technical Artist` |

`hero.lede`
- before：`Game VFX × Immersive Exhibitions × AI-assisted dev —\ncrafting memorable visuals with Particle Systems and Shader art.`
- after：`Game VFX × Technical Art × AI-assisted dev —\nbuilding realtime visuals that balance impact and performance with particle systems, shaders and custom tools.`

> 註：Hero 大字標題 `<h1>` 的 `Lijing / Chiu / VFX` 三行**未改**（視覺主視覺，VFX 保留）。

---

## 2. 創作歷程時間軸（全部重排）— 中文 zh

最關鍵：原 2021「首個商業專案／手遊技能特效」與履歷不符，已移除；六格依真實年表重寫。

| key | before | after |
|---|---|---|
| `tl.d1` | `2020 · 啟程` | `2020 · 啟程`（無變動） |
| `tl.t1` | `踏入即時渲染世界` | `踏入即時渲染` |
| `tl.l1a` | `投入遊戲特效與即時渲染領域` | `於世新大學數位多媒體設計學系在學，投入遊戲特效自學` |
| `tl.l1b` | `從 Unity 粒子系統開始，建立對動態視覺的直覺` | `從 Unity 粒子系統起步，建立對動態視覺的直覺` |
| `tl.l1c` | `活用各項即時渲染工具` | `大量研究風格化特效的理念與做法` |
| `tl.d2` | `2021 · 首個商業專案` | `2021 · 技術深耕` |
| `tl.t2` | `手遊技能特效製作` | `自學 Shader 開發` |
| `tl.l2a` | `參與商業手遊的技能與打擊特效` | `自學 HLSL 與 Shader Graph` |
| `tl.l2b` | `在效能限制下做出最具張力的畫面` | `鑽研材質、光照模型與效能優化原理` |
| `tl.l2c` | `建立可重用的特效資產流程` | `累積可重用的特效與材質資產` |
| `tl.d3` | `2022 · 技術深耕` | `2022 · 畢業 × 入行` |
| `tl.t3` | `深入 Shader 開發` | `畢製獲獎，正式入行` |
| `tl.l3a` | `自學 HLSL 與 Shader Graph` | `畢業製作《信仰之路》獲遊戲設計組金獎，入圍放視大賞 PC 遊戲組決選` |
| `tl.l3b` | `從零打造可重用的材質與光效系統` | `加入自營團隊「虹塵」（前身波克學院），製作遊戲技能與場景特效` |
| `tl.l3c` | `鑽研數學與光照模型原理` | `於紅然參與華山 1914 沉浸式展覽製作` |
| `tl.d4` | `2023 · 沉浸式展演` | `2023 · 沉浸式展演`（無變動） |
| `tl.t4` | `互動裝置與投影` | `展覽場景與技術特效` |
| `tl.l4a` | `參與沉浸式展覽製作` | `參與《迷宮書店》《Wonderland》《楊麗花沉浸式記者會》等專案` |
| `tl.l4b` | `將即時特效延伸到大型投影與互動裝置` | `負責場景、技術特效與場景過渡銜接` |
| `tl.l4c` | `整合感測器與即時互動邏輯` | `年末加入唯晶科技，轉入 3A 遊戲特效` |
| `tl.d5` | `2024 · 工作流革新` | `2024 · 3A 特效 × AI 工作流` |
| `tl.t5` | `導入 AI 輔助開發` | `高級遊戲特效美術師` |
| `tl.l5a` | `將 AI 工具融入特效與前端工作流` | `參與《聖女之歌2》與 3A 東方賽博龐克機甲遊戲特效開發` |
| `tl.l5b` | `大幅提升從概念到成品的迭代速度` | `編寫角色／特效 Shader，負責畫面與引擎流水線優化` |
| `tl.l5c` | `探索程序化生成與自動化流程` | `以 Codex／Claude Code 自製開發者工具，加速團隊製程` |
| `tl.d6` | `2025 · 此刻` | `2025 · 至今` |
| `tl.t6` | `打造個人作品集` | `技術美術 × 個人作品集` |
| `tl.l6a` | `整合歷年作品與技術積累` | `持續深化 Shader、場景渲染與效能優化` |
| `tl.l6b` | `以這個網站呈現屬於自己的視覺語言` | `運用 AI 自動化（MCP／Automation／Skill）優化流水線` |
| `tl.l6c` | `持續探索 WebGL 與互動體驗` | `打造此個人作品集，整理歷年作品與技術積累` |

## 2b. 創作歷程時間軸 — 英文 en

| key | before | after |
|---|---|---|
| `tl.d1` | `2020 · Beginning` | （無變動） |
| `tl.t1` | `Entering Realtime Rendering` | （無變動） |
| `tl.l1a` | `Stepped into game VFX and realtime rendering` | `Studying Digital Multimedia Design at Shih Hsin University; self-teaching game VFX` |
| `tl.l1b` | `Started with Unity particle systems to build motion intuition` | （無變動） |
| `tl.l1c` | `Got hands-on with realtime rendering tools` | `Researched stylised VFX concepts and techniques` |
| `tl.d2` | `2021 · First Commercial Project` | `2021 · Going Deeper` |
| `tl.t2` | `Mobile Game Skill VFX` | `Self-taught Shaders` |
| `tl.l2a` | `Crafted skill and impact effects for a commercial mobile game` | `Self-taught HLSL and Shader Graph` |
| `tl.l2b` | `Maximised drama under tight performance limits` | `Studied materials, lighting models and performance optimisation` |
| `tl.l2c` | `Built a reusable VFX asset pipeline` | `Built reusable VFX and material assets` |
| `tl.d3` | `2022 · Going Deeper` | `2022 · Graduation × First Role` |
| `tl.t3` | `Diving into Shaders` | `Award-winning grad project; entering the industry` |
| `tl.l3a` | `Self-taught HLSL and Shader Graph` | `Grad project "Advancing for Faith" won Gold (Game Design); finalist at Vision Get Wild (PC Games)` |
| `tl.l3b` | `Built reusable material and lighting systems from scratch` | `Joined my own team "虹塵 / HongChen" (formerly Boke), creating game skill & scene VFX` |
| `tl.l3c` | `Studied the math and lighting-model fundamentals` | `Joined RYB on the Huashan 1914 immersive exhibitions` |
| `tl.d4` | `2023 · Immersive Shows` | （無變動） |
| `tl.t4` | `Installations & Projection` | `Exhibition Scenes & Technical VFX` |
| `tl.l4a` | `Joined immersive exhibition production` | `Worked on "Maze Bookstore", "Wonderland" and the "Yang Li-hua" immersive showcase` |
| `tl.l4b` | `Extended realtime VFX onto large-scale projection & installations` | `Owned scenes, technical VFX and scene transitions` |
| `tl.l4c` | `Integrated sensors with realtime interaction logic` | `Joined Winking Studios at year-end, moving into 3A game VFX` |
| `tl.d5` | `2024 · Workflow Shift` | `2024 · 3A VFX × AI Workflow` |
| `tl.t5` | `Adopting AI-assisted Dev` | `Senior Game VFX Artist` |
| `tl.l5a` | `Integrated AI tools into the VFX and frontend workflow` | `VFX for 《聖女之歌2》and a 3A Eastern cyberpunk-mecha title` |
| `tl.l5b` | `Greatly accelerated iteration from concept to result` | `Authored character/effect shaders; optimised rendering & engine pipeline` |
| `tl.l5c` | `Explored procedural generation and automation` | `Built developer tools with Codex/Claude Code to speed up the team` |
| `tl.d6` | `2025 · Now` | （無變動） |
| `tl.t6` | `Building this Portfolio` | `Technical Art × Portfolio` |
| `tl.l6a` | `Brought together years of work and craft` | `Deepening shaders, scene rendering and performance optimisation` |
| `tl.l6b` | `Presenting my own visual language through this site` | `Streamlining pipelines with AI automation (MCP/Automation/Skill)` |
| `tl.l6c` | `Continuing to explore WebGL and interactive experiences` | `Building this portfolio, curating years of work and craft` |

## 2c. 時間軸標籤（HTML 硬寫，無 i18n）

六個 `<div class="tl-tags"><span>A</span><span>B</span></div>` 依出現順序設定為：

| 第幾格 | before | after |
|---|---|---|
| 1 (2020) | Unity3D / Particle | Unity3D / Particle（無變動） |
| 2 (2021) | VFX Graph / Mobile | **HLSL / Shader Graph** |
| 3 (2022) | HLSL / Shader Graph | **放視大賞 / 虹塵** |
| 4 (2023) | Projection / Interactive | **沉浸式展覽 / Projection** |
| 5 (2024) | AI Workflow / Realtime | **3A / AI Workflow** |
| 6 (2025) | Portfolio / WebGL | **Technical Art / WebGL** |

---

## 3. 關於我（兩段）

### 3a. 第一段（簡介區，`<section id="about">` 之一）

`about.lead`（zh）
- before：`我是邱立璟，專注於即時渲染特效與沉浸式視覺體驗。擁有遊戲特效、Shader 開發與互動裝置的實戰經驗，曾參與多個商業專案與展覽製作。`
- after：`我是邱立璟，遊戲特效設計師／技術美術，現任唯晶科技高級遊戲特效美術師。專注即時渲染特效、Shader 開發與 AI 強化的開發者工具，從 3A 遊戲到沉浸式展覽皆有實戰經驗。`

`about.lead`（en）
- before：`I am Lijing Chiu, specialising in realtime VFX and immersive visual experiences. With hands-on experience in game VFX, shader development and interactive installations.`
- after：`I'm Lijing Chiu — a game VFX artist / technical artist, currently Senior Game VFX Artist at Winking Studios. I focus on realtime VFX, shader development and AI-enhanced developer tools, with experience from 3A games to immersive exhibitions.`

**數據（HTML 硬寫數字 + `about.s*` 標籤）**

| 項目 | before | after |
|---|---|---|
| 數字1 `about-stat__num` | `5+` | `4` |
| 標籤 `about.s1`(zh) | `年實戰經驗` | `年實戰經驗`（無變動） |
| 數字2 `about-stat__num` | `20+` | `8+` |
| 標籤 `about.s2`(zh) | `完成專案` | `專案經歷` |
| 標籤 `about.s2`(en) | `Projects` | `Projects`（無變動） |
| 數字3 / 標籤 `about.s3` | `3` / `核心技術` | （無變動） |

### 3b. 第二段（詳細區，`<section id="about">` 之二）

`about.bio1`（zh）
- before：`我是邱立璟，基隆人，Unity3D 視覺特效師。現任職於遊戲科技公司擔任特效師，曾參與 3A 等級東方風格遊戲開發，擁有互動沉浸式展覽專案經驗，同時有自由接案經驗。`
- after：`我是邱立璟，基隆人，遊戲特效設計師／技術美術。現任唯晶科技高級遊戲特效美術師，參與《聖女之歌2》與 3A 東方賽博龐克機甲遊戲的特效開發，亦曾參與「哥布林殺手」IP 相關作品；先前於紅然負責華山 1914 沉浸式展覽的場景與技術特效，並持續於自營團隊「虹塵」製作風格化遊戲特效。`

`about.bio1`（en）
- before：`I'm Lijing Chiu from Keelung, Taiwan — a Unity3D VFX artist currently working at a game tech studio. I've participated in 3A-quality Eastern-style game development, have experience in interactive immersive exhibition projects, and also take on freelance work.`
- after：`I'm Lijing Chiu from Keelung, Taiwan — a game VFX artist / technical artist. As Senior Game VFX Artist at Winking Studios I work on VFX for 《聖女之歌2》and a 3A Eastern cyberpunk-mecha title, and have contributed to a Goblin Slayer IP project. Previously at RYB I handled scenes and technical VFX for the Huashan 1914 immersive exhibitions, and I continue creating stylised game VFX with my own team, 虹塵 (HongChen).`

`about.bio2`（zh）
- before：`擅長以 Particle System、Shader Graph 與 AI 輔助工具（Claude Code、Codex、Gemini）加速開發流程，並持有 JLPT N1 日文檢定，可進行跨語言協作。`
- after：`擅長以 Particle System、Shader Graph／HLSL 製作風格化與寫實特效，並負責場景渲染、打光與效能優化；善用 AI（Claude Code、Codex、Gemini、Antigravity）與自製開發者工具（Unity／Git）優化流水線。持有 JLPT N1，可進行中日跨語言協作。`

`about.bio2`（en）
- before：`I accelerate pipelines with Particle System, Shader Graph and AI tools (Claude Code, Codex, Gemini). JLPT N1 certified — able to collaborate across languages.`
- after：`I craft stylised and realistic effects with Particle System and Shader Graph/HLSL, and own scene rendering, lighting and performance optimisation. I streamline pipelines with AI (Claude Code, Codex, Gemini, Antigravity) and self-built developer tools (Unity/Git). JLPT N1 certified for Chinese–Japanese collaboration.`

**數據（HTML 硬寫數字 + `stat.*` 標籤）**

| 項目 | before | after |
|---|---|---|
| 數字1 `.stat .n` | `4+` | `4` |
| 標籤 `stat.1`(zh) | `年資歷` | `年實戰經驗` |
| 標籤 `stat.1`(en) | `Yrs Exp.` | `Years Exp.` |
| 數字2 / 標籤 `stat.2` | `3` / `工作職位`(zh) / `Roles`(en) | （無變動） |
| 數字3 `2022` / 標籤 `stat.3`(zh) | `2022` / `放視大賞決選` | （無變動） |
| 標籤 `stat.3`(en) | `放視大賞 Award` | `Vision Get Wild Finalist` |

---

## 4. 專長領域 chips（HTML 硬寫，無 i18n）

`<div class="chips">` 內 `<span>` 清單：
- before：`Particle System` / `Shader Graph` / `Visual Effect Graph` / `Post Processing` / `AI 輔助開發` / `沉浸式展覽` / `C# 程式` / `FL Studio`
- after：`Particle System` / `Shader Graph / HLSL` / `Visual Effect Graph` / `場景渲染與優化` / `風格化特效` / `Post Processing` / `開發者工具` / `AI 輔助開發` / `沉浸式展覽` / `C# / Shader` / `FL Studio`

---

## 5. 工具區改版：百分比進度條 → 分類標籤（HTML + CSS + JS 全換）

### 5a. HTML — 整個 `<div class="tools">…</div>`（7 條進度條）被替換為：

```html
<div class="toolset">
  <div class="toolset__group"><span class="toolset__cat">Engine &amp; VFX</span><div class="toolset__tags"><span>Unity3D</span><span>Particle System</span><span>Visual Effect Graph</span></div></div>
  <div class="toolset__group"><span class="toolset__cat">Shader</span><div class="toolset__tags"><span>Shader Graph</span><span>HLSL</span><span>Amplify Shader Editor</span><span>C#</span></div></div>
  <div class="toolset__group"><span class="toolset__cat">3D &amp; Texture</span><div class="toolset__tags"><span>3ds Max</span><span>Blender</span><span>Substance Designer</span><span>Substance Painter</span></div></div>
  <div class="toolset__group"><span class="toolset__cat">2D &amp; Motion</span><div class="toolset__tags"><span>Photoshop</span><span>After Effects</span><span>Premiere</span></div></div>
  <div class="toolset__group"><span class="toolset__cat">Audio</span><div class="toolset__tags"><span>FL Studio</span><span>Audition</span></div></div>
  <div class="toolset__group"><span class="toolset__cat">AI &amp; Pipeline</span><div class="toolset__tags"><span>Claude Code</span><span>Codex</span><span>Gemini</span><span>Antigravity</span><span>Cowork</span><span>Git</span></div></div>
</div>
```

**移除的舊百分比資料**（不再出現）：Unity3D 96% / Shader Graph·HLSL 92% / Photoshop 90% / After Effects 84% / 3ds Max 78% / Blender 73% / Substance Designer 68%。

### 5b. CSS — 移除 `.tools / .tools__row / .tools__bar / .fill / @keyframes bar-shimmer`（及註解），新增：

```css
.toolset { display: flex; flex-direction: column; gap: 16px; }
.toolset__group {
  display: grid; grid-template-columns: 116px 1fr; gap: 12px 14px;
  align-items: start; padding-bottom: 16px; border-bottom: 1px solid var(--hair);
}
.toolset__group:last-child { padding-bottom: 0; border-bottom: none; }
.toolset__cat {
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
  font-weight: 700; color: var(--accent); padding-top: 7px; white-space: nowrap;
}
.toolset__tags { display: flex; flex-wrap: wrap; gap: 7px; }
.toolset__tags span {
  font-size: 12.5px; padding: 6px 13px; border-radius: 9px;
  border: 1px solid var(--hair); background: transparent;
  color: var(--fg); opacity: 0.92; cursor: default;
  transition: transform .22s ease, border-color .22s, background .22s, opacity .22s;
}
.toolset__tags span:hover {
  opacity: 1; transform: translateY(-2px); border-color: var(--accent);
  background: linear-gradient(135deg, rgba(29,110,245,0.16), rgba(168,85,247,0.16));
}
@media (max-width: 560px){
  .toolset__group { grid-template-columns: 1fr; gap: 7px; padding-bottom: 13px; }
  .toolset__cat { padding-top: 0; }
}
```

> 配色用既有變數 `--accent`、`--hair`、`--fg`，深淺色主題皆可。

### 5c. JS（GSAP 捲動動畫）— 替換

- before：
```js
// tool bars fill — spring
gsap.utils.toArray('.tools__bar .fill').forEach((el, i) => {
  gsap.to(el, {
    width: el.dataset.pct + '%', duration: 1.4,
    ease: 'back.out(1.3)',
    scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    delay: i * 0.04,
  });
});
```
- after：
```js
// tool tags — spring stagger
gsap.utils.toArray('.toolset__tags span').forEach((el, i) => {
  gsap.from(el, {
    opacity: 0, scale: 0.7, y: 12,
    duration: 0.7, ease: 'back.out(2.8)',
    delay: (i % 7) * 0.05,
    scrollTrigger: { trigger: el.closest('.toolset'), start: 'top 88%', once: true },
  });
});
```

> 註：外部 `app.js` 內另有 `.tools .fill` 動畫（第 159 行附近），現已成空操作（無害）；若要清乾淨可一併移除。

---

## 6. 改動依據（履歷對照重點，供校正判斷）

- 現職：唯晶科技（WINKING）高級遊戲特效美術師，2023/10 起在職，台北內湖。
- 專案：《聖女之歌2》、3A 東方賽博龐克機甲遊戲、哥布林殺手 IP 相關作品（皆履歷上有）。
- 紅然股份（RYB）2022/9–2023/9：華山 1914《迷宮書店》《Wonderland》《楊麗花沉浸式記者會》場景與技術特效。
- 自營團隊「虹塵」＝前身波克學院，2022/5 起持續，風格化遊戲特效。
- 年資定調：4 年實戰（含在學共約 6 年）。
- 畢業製作《信仰之路》：遊戲設計組金獎；放視大賞 PC 遊戲組決選（兩者不同，勿混為一談）。
- 證照：JLPT N1。
- 工具（履歷全集）：Unity3D、Particle System、Visual Effect Graph、Shader Graph、HLSL、Amplify Shader Editor、C#、3ds Max、Blender、Substance Designer/Painter、Photoshop、After Effects、Premiere、FL Studio、Audition、Claude Code、Codex、Gemini、Antigravity、Cowork（MCP/Automation/Skill）、Git。

## 7. 校正時可一併評估（本次刻意未動）

1. 重複鍵 `about.k`、`about.title`（zh/en 各兩次）造成兩段「關於我」標題相同，建議改鍵名分流。
2. 兩個 `<section id="about">` id 重複，建議改唯一 id。
3. 工具標籤目前不分熟練度，若要可加「精通／熟練」層級或調整分類順序。
4. `deploy/index.html` 是較舊的淺色版本；若正式上線以主檔 `index.html` 為準，建議重新由主檔產生 deploy，避免雙版本長期分歧。
5. 確認無誤後刪除 `index.html.bak`、`deploy/index.html.bak`。
