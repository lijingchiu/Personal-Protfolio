# 邱立璟 · 個人作品集展示

## GitHub Pages 部署步驟

1. 在 GitHub 新建一個 Repository（例如 `portfolio`）
2. 將此資料夾內所有檔案上傳到 Repository 根目錄
3. 進入 Repository → **Settings** → **Pages**
4. Source 選擇 **Deploy from a branch**
5. Branch 選 **main**，資料夾選 **/ (root)**
6. 點 **Save**，約 1~2 分鐘後即可訪問

部署完成後網址格式為：
`https://<你的GitHub帳號>.github.io/portfolio/`

## 注意事項

- YouTube SHOWREEL 影片在部署到正式網域後即可正常自動播放
- 所有外部依賴（GSAP、Lenis、Three.js 等）均透過 CDN 載入，無需額外安裝
- `.nojekyll` 檔案已包含，確保 GitHub Pages 不會干擾靜態資源
