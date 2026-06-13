import commerceAfterImage from "../assets/commerce-after.jpg";
import commerceBeforeImage from "../assets/commerce-before.jpg";
import dailyAfterImage from "../assets/daily-after.jpg";
import dailyBeforeImage from "../assets/daily-before.jpg";
import fashionAfterImage from "../assets/fashion-after.jpg";
import fashionBeforeImage from "../assets/fashion-before.jpg";
import personAfterImage from "../assets/tryon-person-after.jpg";
import personBeforeImage from "../assets/tryon-person-before.jpg";

const styleCards = [
  ["原生风格", "最接近原图", "portrait-one"],
  ["日常真实", "自然细节", "portrait-two"],
  ["电商展示", "突出商品", "portrait-three"],
  ["时尚大片", "更强氛围", "portrait-four"],
];

const featureCards = [
  ["购买前预览", "把衣服预览到自己的照片上，下单、退换或比较款式前先看效果。", "购买更安心"],
  ["比较穿搭", "在同一张人物照上尝试不同服装和风格，再决定最终造型。", "更多选择"],
  ["分享预览", "下载无水印结果，用来展示一套穿搭想法。", "无水印下载"],
];

const scenarioCards = [
  ["AI 换装工具", "当目标是直接给照片换衣服时，使用这个专门的换装页面。", "打开 AI 换装", "热门"],
  ["连衣裙在线试穿", "预览连衣裙廓形、长度和造型效果，进入专门的连衣裙页面。", "试穿连衣裙", "新"],
  ["AI Fashion Model 商品图", "从卖家服装图生成上身商品图，适合单个 SKU 验证。", "生成商品图", "卖家"],
  ["GPT Image 2 虚拟试穿", "当你关心 GPT Image 2 的比例和模型设置时，使用这个模型页面。", "体验 GPT IMAGE 2", "GPT IMAGE 2"],
];

const faqItems = [
  "什么是虚拟试穿?",
  "需要上传什么?",
  "“风格”和“关注点”是什么?",
  "需要登录吗？积分和清晰度怎么算?",
  "我的照片安全吗?",
  "可以下载并用于商用吗?",
  "AnyTryOn 是免费的虚拟试穿工具吗?",
  "也可以用 AnyTryOn 给照片换衣服吗?",
];

function PhotoTile({ className = "", label, image, hoverImage, alt }) {
  const imageClass = image ? "photo-tile-image" : "";
  const hoverClass = hoverImage ? "photo-tile-hover-swap" : "";

  return (
    <div className={`photo-tile ${imageClass} ${hoverClass} ${className}`}>
      {image ? (
        <img className="photo-tile-img photo-tile-img-default" src={image} alt={alt || label} />
      ) : null}
      {hoverImage ? (
        <img className="photo-tile-img photo-tile-img-hover" src={hoverImage} alt="" aria-hidden="true" />
      ) : null}
      <span>{label}</span>
    </div>
  );
}

function UploadPanel({ title, badge, action, thumbs, muted = false }) {
  return (
    <article className={`upload-panel ${muted ? "muted-panel" : ""}`}>
      <div className="panel-heading">
        <h3>{title}</h3>
        <span>{badge}</span>
      </div>
      <div className="upload-box">
        <span className="upload-icon">⌁</span>
        <strong>{action}图片</strong>
        <button type="button">{action.replace("图片", "")}</button>
        <small>没有图片?</small>
        <div className="thumb-row">
          {thumbs.map((thumb) => (
            <PhotoTile key={thumb} className={thumb} label="" />
          ))}
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <main className="landing-page">
      <section className="hero-section" id="try-on">
        <div className="hero-copy">
          <h1>
            在线虚拟
            <span>试穿</span>
            工具
          </h1>
          <p>
            光源TryOn 是免费的在线虚拟试穿工具：上传人物照和服装图，在购买或决定穿搭前预览上身效果。首次生成无需登录且免费，下载结果无水印。
          </p>
          <a className="dark-cta" href="#workspace">
            开始虚拟试穿 <span aria-hidden="true">⌁</span>
          </a>
        </div>
        <div className="hero-collage" aria-label="虚拟试穿示例">
          <PhotoTile
            className="portrait-one"
            label="人物照"
            image={personBeforeImage}
            hoverImage={personAfterImage}
            alt="金发女性人物照"
          />
          <PhotoTile
            className="portrait-two"
            label="日常真实"
            image={dailyBeforeImage}
            hoverImage={dailyAfterImage}
            alt="日常真实风格人物照"
          />
          <PhotoTile
            className="portrait-three"
            label="电商展示"
            image={commerceBeforeImage}
            hoverImage={commerceAfterImage}
            alt="电商展示风格人物照"
          />
          <PhotoTile
            className="portrait-four"
            label="时尚大片"
            image={fashionBeforeImage}
            hoverImage={fashionAfterImage}
            alt="时尚大片风格人物照"
          />
        </div>
      </section>

      <section className="workspace-section" id="workspace" aria-label="AnyTryOn 工作区">
        <div className="workspace-grid">
          <aside className="upload-column">
            <UploadPanel
              title="人物照"
              badge="必选"
              action="添加人物"
              thumbs={["portrait-one", "portrait-two", "portrait-three"]}
            />
            <UploadPanel
              title="主服装图"
              badge="必选"
              action="添加主服装"
              thumbs={["cloth-one", "cloth-two", "cloth-three"]}
            />
            <UploadPanel
              title="下装图"
              badge="可选"
              action="添加下装"
              thumbs={["pants-one", "pants-two", "pants-three"]}
              muted
            />
          </aside>

          <section className="preview-column">
            <h2>AnyTryOn</h2>
            <div className="preview-stage">
              <div className="stage-actions">
                <button type="button">预览</button>
                <button type="button">1K 输出</button>
              </div>
              <div className="before-after">
                <article>
                  <span>试穿前</span>
                  <PhotoTile className="portrait-dark" label="试穿前" />
                </article>
                <div className="stage-divider" />
                <article>
                  <span>试穿后</span>
                  <PhotoTile className="portrait-light" label="试穿后" />
                </article>
              </div>
            </div>
            <div className="preview-assets">
              <article>
                <PhotoTile className="cloth-one" label="" />
                <h3>主服装图</h3>
                <p>示例预览中使用的衣服</p>
              </article>
              <article>
                <span className="empty-icon">▱</span>
                <h3>下装图</h3>
                <p>示例预览未展示可选单品</p>
              </article>
            </div>
          </section>

          <aside className="settings-column">
            <h2>下一步调整</h2>
            <section className="settings-card">
              <h3>风格</h3>
              <div className="style-grid">
                {styleCards.map(([title, text, imageClass], index) => (
                  <button className={index === 0 ? "selected" : ""} key={title} type="button">
                    <PhotoTile className={imageClass} label="" />
                    <strong>{title}</strong>
                    <small>{text}</small>
                  </button>
                ))}
              </div>
            </section>
            <section className="settings-card">
              <h3>设置</h3>
              <p>关注点</p>
              <div className="segmented">
                <button className="selected" type="button">
                  服装
                </button>
                <button type="button">我</button>
              </div>
              <p>比例</p>
              <div className="ratio-grid">
                {["自动", "1:1", "3:4", "4:3", "9:16", "16:9"].map((ratio, index) => (
                  <button className={index === 0 ? "selected" : ""} key={ratio} type="button">
                    {ratio}
                  </button>
                ))}
              </div>
              <p>尺寸</p>
              <div className="size-grid">
                <button className="selected" type="button">
                  <strong>1K</strong>
                  <small>极速 2 积分</small>
                </button>
                <button disabled type="button">
                  <strong>2K</strong>
                  <small>2 积分</small>
                </button>
                <button disabled type="button">
                  <strong>4K</strong>
                  <small>未解锁 升级</small>
                </button>
              </div>
              <small>自动比例仅支持 1K。</small>
              <button className="generate-button" type="button">
                ⌁ 一键试衣
              </button>
            </section>
          </aside>
        </div>
      </section>

      <section className="decision-section">
        <div className="section-heading">
          <h2>先试穿，再决定穿什么</h2>
          <p>在购买、出门或分享穿搭前，用 AnyTryOn 先确认衣服穿到人物身上的效果。</p>
        </div>
        <div className="decision-grid">
          <div className="value-stack">
            {featureCards.map(([title, text, tag], index) => (
              <article className={index === 0 ? "active" : ""} key={title}>
                <span>{tag}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <div className="stacked-preview">
            <PhotoTile className="portrait-before" label="试穿前" />
            <PhotoTile className="portrait-after" label="试穿后" />
            <span>购买前预览</span>
          </div>
        </div>
      </section>

      <section className="compare-section">
        <div className="section-heading">
          <h2>为什么先做虚拟试穿</h2>
          <p>在花钱或确定造型前，先快速预览服装上身效果。</p>
        </div>
        <div className="compare-grid">
          <article>
            <span>没有虚拟试穿</span>
            <ul>
              <li>只能靠平铺图、店铺图或想象判断效果。</li>
              <li>要等衣服到手后，才知道穿在人身上怎么样。</li>
              <li>每多比较一个造型，都要投入更多时间。</li>
              <li>真正决定前，很难快速比较多个风格。</li>
            </ul>
          </article>
          <article>
            <span>使用 ANYTRYON</span>
            <ul>
              <li>从一张人物照和服装图开始。</li>
              <li>通常 1 分钟左右得到真实试衣预览。</li>
              <li>购买、出门或分享穿搭前可以多试几个方案。</li>
              <li>随时更换服装和风格，不用从头重来。</li>
              <li>上传与结果默认保持私密。</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="guide-section" id="guide">
        <div className="section-heading">
          <h2>如何用 AnyTryOn 在线试穿衣服</h2>
          <p>不用写提示词，也不用设计工具。添加人物照和服装图，选择风格和关注点，就能下载用于购买或穿搭决策的无水印试衣图。</p>
        </div>
        <div className="step-grid">
          <article>
            <span>1</span>
            <h3>上传人物照</h3>
            <p>上传一张清晰的人物照片，可以是你自己、模特或商品主体，它会成为虚拟试穿的基础。</p>
          </article>
          <article>
            <span>2</span>
            <h3>上传衣服图</h3>
            <p>上传你想预览的服装。正面、干净、光线好的服装图，更容易得到自然效果。</p>
          </article>
          <article>
            <span>3</span>
            <h3>生成并下载</h3>
            <p>选择风格和关注点，生成试穿预览，然后用于购买或穿搭决策。</p>
          </article>
        </div>
      </section>

      <section className="scenario-section" id="pricing">
        <div className="section-heading">
          <h2>需要更具体的试穿场景？</h2>
          <p>如果你想直接换衣、试连衣裙，或使用 GPT Image 2，可以进入对应页面。</p>
        </div>
        <div className="scenario-grid">
          {scenarioCards.map(([title, text, action, tag], index) => (
            <article className={index === 1 ? "active" : ""} key={title}>
              <span className="scenario-icon">⌁</span>
              <small>{tag}</small>
              <h3>{title}</h3>
              <p>{text}</p>
              <a href="#workspace">
                {action} <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="section-heading">
          <span>常见问题</span>
          <h2>常见问题</h2>
          <p>了解照片要求、风格、积分、隐私，以及怎样得到更好的虚拟试穿预览。</p>
        </div>
        <div className="faq-list">
          {faqItems.map((item) => (
            <details key={item}>
              <summary>
                {item}
                <span>⌄</span>
              </summary>
              <p>这里先保留为折叠状态，后续可以继续补充完整回答内容。</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <h2>准备好开始 试穿一套衣服了吗?</h2>
        <p>上传人物照和服装图，选择风格，生成可下载、可分享的真实虚拟试穿图。</p>
        <div>
          <a href="#workspace">开始虚拟试穿</a>
          <a href="#pricing">查看定价</a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-grid">
          <section>
            <h2>AnyTryOn.</h2>
            <p>在线虚拟试穿工作区：上传人物照和服装图，在购买或决定穿搭前预览上身效果。</p>
            <h3>法律条款</h3>
            <a href="#faq">隐私政策</a>
            <a href="#faq">服务条款</a>
            <a href="#faq">退款政策</a>
            <a href="#faq">Cookie 设置</a>
          </section>
          <section>
            <h3>工具</h3>
            <a href="#workspace">虚拟试穿</a>
            <a href="#workspace">AI 换装工具</a>
            <a href="#workspace">连衣裙试穿</a>
            <a href="#pricing">定价</a>
          </section>
          <section>
            <h3>帮助</h3>
            <a href="#faq">关于</a>
            <a href="#faq">常见问题</a>
            <a href="#faq">联系我们</a>
          </section>
        </div>
        <p className="copyright">© 2026 AnyTryOn. 购买、搭配、上架前先看效果。</p>
      </footer>

      <div className="floating-tools" aria-label="快捷工具">
        <button type="button">⌘</button>
        <button type="button">文</button>
      </div>
    </main>
  );
}
