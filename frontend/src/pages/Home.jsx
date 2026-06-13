import { useRef, useState } from "react";

import commerceAfterImage from "../assets/commerce-after.jpg";
import commerceBeforeImage from "../assets/commerce-before.jpg";
import dailyAfterImage from "../assets/daily-after.jpg";
import dailyBeforeImage from "../assets/daily-before.jpg";
import fashionAfterImage from "../assets/fashion-after.jpg";
import fashionBeforeImage from "../assets/fashion-before.jpg";
import personAfterImage from "../assets/tryon-person-after.jpg";
import personBeforeImage from "../assets/tryon-person-before.jpg";
import sampleBottom1 from "../assets/sample-bottom-1.jpg";
import sampleBottom2 from "../assets/sample-bottom-2.jpg";
import sampleBottom3 from "../assets/sample-bottom-3.jpg";
import samplePerson1 from "../assets/sample-person-1.jpg";
import samplePerson2 from "../assets/sample-person-2.jpg";
import samplePerson3 from "../assets/sample-person-3.jpg";
import sampleTop1 from "../assets/sample-top-1.jpg";
import sampleTop2 from "../assets/sample-top-2.jpg";
import sampleTop3 from "../assets/sample-top-3.jpg";
import stageAfterImage from "../assets/stage-after.jpg";
import stageBeforeImage from "../assets/stage-before.jpg";

const styleCards = [
  ["原生风格", "最接近原图", "portrait-one"],
  ["日常真实", "自然细节", "portrait-two"],
  ["电商展示", "突出商品", "portrait-three"],
  ["时尚大片", "更强氛围", "portrait-four"],
];

// 各面板的示例图库：没有自己照片的访客可一键载入
const personSamples = [
  { url: samplePerson1, name: "示例人物 1" },
  { url: samplePerson2, name: "示例人物 2" },
  { url: samplePerson3, name: "示例人物 3" },
];
const topSamples = [
  { url: sampleTop1, name: "示例上衣 1" },
  { url: sampleTop2, name: "示例上衣 2" },
  { url: sampleTop3, name: "示例上衣 3" },
];
const bottomSamples = [
  { url: sampleBottom1, name: "示例下装 1" },
  { url: sampleBottom2, name: "示例下装 2" },
  { url: sampleBottom3, name: "示例下装 3" },
];

// 比例选项：w/h 为示意小图标的像素尺寸（自动无图标）
const ratioOptions = [
  { label: "自动", w: 0, h: 0 },
  { label: "1:1", w: 22, h: 22 },
  { label: "3:4", w: 18, h: 24 },
  { label: "4:3", w: 24, h: 18 },
  { label: "9:16", w: 14, h: 24 },
  { label: "16:9", w: 24, h: 14 },
];

// 尺寸选项：2K/4K 需登录或升级，暂锁定（后续接 API 再解锁）
const sizeOptions = [
  { label: "1K", note: "极速 2 积分", locked: false },
  { label: "2K", note: "2 积分", locked: true },
  { label: "4K", note: "未解锁 升级", locked: true },
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
  "光原TryOn 是免费的虚拟试穿工具吗?",
  "也可以用 光原TryOn 给照片换衣服吗?",
];

function PhotoTile({ className = "", label, image, hoverImage, alt, showLabel = true }) {
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
      {showLabel && label ? <span>{label}</span> : null}
    </div>
  );
}

const iconProps = {
  width: 34,
  height: 34,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

function PersonAddIcon() {
  return (
    <svg {...iconProps}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  );
}

function ShirtIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
    </svg>
  );
}

function ImageAddIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
      <line x1="16" x2="22" y1="5" y2="5" />
      <line x1="19" x2="19" y1="2" y2="8" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>
  );
}

function AssetEmpty() {
  return (
    <div className="asset-empty">
      <LayersIcon />
      <span>未使用</span>
    </div>
  );
}

function UploadPanel({ title, badge, action, samples, icon, muted = false, value, onSelect, onSelectSample, onClear }) {
  const inputRef = useRef(null);

  function openPicker() {
    inputRef.current?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    onSelect(file);
    // 清空 value，确保再次选择同一文件也能触发 change
    event.target.value = "";
  }

  return (
    <article className={`upload-panel ${muted ? "muted-panel" : ""}`}>
      <div className="panel-heading">
        <h3>{title}</h3>
        <span>{badge}</span>
      </div>
      <div className={`upload-box ${value ? "has-preview" : ""}`}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
        {value ? (
          <div className="upload-filled">
            <img src={value.url} alt={`${title}预览`} />
            <button
              type="button"
              className="upload-clear"
              onClick={onClear}
              aria-label="移除图片"
            >
              ×
            </button>
          </div>
        ) : (
          <>
            <span className="upload-icon">{icon}</span>
            <strong>{action}图片</strong>
            <button type="button" onClick={openPicker}>
              {action.replace("图片", "")}
            </button>
            <small>没有图片? 点下方示例试试</small>
            <div className="thumb-row">
              {samples.map((sample) => (
                <button
                  className="thumb-sample"
                  key={sample.url}
                  type="button"
                  onClick={() => onSelectSample(sample)}
                  aria-label={`使用${sample.name}`}
                >
                  <img src={sample.url} alt={sample.name} />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </article>
  );
}

function useUploadSlot() {
  const [value, setValue] = useState(null);

  // 替换当前值，并释放上一张本地上传产生的 blob（示例图是静态资源，blob 为 null 不释放）
  function replaceWith(next) {
    setValue((prev) => {
      if (prev?.blob) {
        URL.revokeObjectURL(prev.blob);
      }
      return next;
    });
  }

  function onSelect(file) {
    const url = URL.createObjectURL(file);
    replaceWith({ url, name: file.name, blob: url });
  }

  function onSelectSample(sample) {
    replaceWith({ url: sample.url, name: sample.name, blob: null });
  }

  function onClear() {
    replaceWith(null);
  }

  return { value, onSelect, onSelectSample, onClear };
}

export default function Home() {
  const person = useUploadSlot();
  const mainCloth = useUploadSlot();
  const bottom = useUploadSlot();

  const [styleIndex, setStyleIndex] = useState(0);
  const [focus, setFocus] = useState("服装");
  const [ratio, setRatio] = useState("自动");
  const [size, setSize] = useState("1K");

  const ready = Boolean(person.value && mainCloth.value);
  const hasAnyUpload = Boolean(person.value || mainCloth.value || bottom.value);

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
            光原TryOn 是免费的在线虚拟试穿工具：上传人物照和服装图，在购买或决定穿搭前预览上身效果。首次生成无需登录且免费，下载结果无水印。
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
            showLabel={false}
          />
          <PhotoTile
            className="portrait-two"
            label="日常真实"
            image={dailyBeforeImage}
            hoverImage={dailyAfterImage}
            alt="日常真实风格人物照"
            showLabel={false}
          />
          <PhotoTile
            className="portrait-three"
            label="电商展示"
            image={commerceBeforeImage}
            hoverImage={commerceAfterImage}
            alt="电商展示风格人物照"
            showLabel={false}
          />
          <PhotoTile
            className="portrait-four"
            label="时尚大片"
            image={fashionBeforeImage}
            hoverImage={fashionAfterImage}
            alt="时尚大片风格人物照"
            showLabel={false}
          />
        </div>
      </section>

      <section className="workspace-section" id="workspace" aria-label="光原TryOn 工作区">
        <div className="workspace-grid">
          <aside className="upload-column">
            <UploadPanel
              title="人物照"
              badge="必选"
              action="添加人物"
              icon={<PersonAddIcon />}
              samples={personSamples}
              value={person.value}
              onSelect={person.onSelect}
              onSelectSample={person.onSelectSample}
              onClear={person.onClear}
            />
            <UploadPanel
              title="主服装图"
              badge="必选"
              action="添加主服装"
              icon={<ShirtIcon />}
              samples={topSamples}
              value={mainCloth.value}
              onSelect={mainCloth.onSelect}
              onSelectSample={mainCloth.onSelectSample}
              onClear={mainCloth.onClear}
            />
            <UploadPanel
              title="下装图"
              badge="可选"
              action="添加下装"
              icon={<ImageAddIcon />}
              samples={bottomSamples}
              muted
              value={bottom.value}
              onSelect={bottom.onSelect}
              onSelectSample={bottom.onSelectSample}
              onClear={bottom.onClear}
            />
          </aside>

          <section className="preview-column">
            <h2>光原TryOn</h2>
            <div className="preview-stage">
              <div className="stage-actions">
                <button type="button">预览</button>
                <button type="button">{size} 输出</button>
              </div>
              {hasAnyUpload ? (
                <div className="stage-ready">
                <div className="stage-ready-head">
                  <div>
                    <h3>{ready ? "素材已准备好" : "准备素材"}</h3>
                    <p>
                      {ready
                        ? "人物照和主服装图已选好，现在可以生成试衣结果。"
                        : "请先上传人物照和主服装图，下装为可选项。"}
                    </p>
                  </div>
                </div>
                <div className="material-cards">
                  <article>
                    <div className="material-thumb">
                      {person.value ? (
                        <img src={person.value.url} alt="人物照" />
                      ) : (
                        <span className="empty-icon">＋</span>
                      )}
                    </div>
                    <h4>人物照</h4>
                    <p>{person.value ? "已选用于本次生成" : "必选，待上传"}</p>
                  </article>
                  <article>
                    <div className="material-thumb">
                      {mainCloth.value ? (
                        <img src={mainCloth.value.url} alt="主服装图" />
                      ) : (
                        <span className="empty-icon">＋</span>
                      )}
                    </div>
                    <h4>主服装图</h4>
                    <p>{mainCloth.value ? "已选用于本次生成" : "必选，待上传"}</p>
                  </article>
                  <article>
                    <div className="material-thumb">
                      {bottom.value ? (
                        <img src={bottom.value.url} alt="下装图" />
                      ) : (
                        <span className="empty-icon">＋</span>
                      )}
                    </div>
                    <h4>下装图</h4>
                    <p>{bottom.value ? "本次生成使用了这个可选槽位" : "可选，未上传"}</p>
                  </article>
                </div>
                </div>
              ) : (
                <div className="before-after">
                  <article>
                    <span>试穿前</span>
                    <PhotoTile
                      className="portrait-dark"
                      image={stageBeforeImage}
                      alt="试穿前：白色衬衫人物照"
                      showLabel={false}
                    />
                  </article>
                  <div className="stage-divider" />
                  <article>
                    <span>试穿后</span>
                    <PhotoTile
                      className="portrait-light"
                      image={stageAfterImage}
                      alt="试穿后：蓝白条纹上衣效果"
                      showLabel={false}
                    />
                  </article>
                </div>
              )}
            </div>
            <div className="preview-assets">
              <article>
                {mainCloth.value ? (
                  <PhotoTile className="cloth-one" image={mainCloth.value.url} label="" showLabel={false} />
                ) : (
                  <AssetEmpty />
                )}
                <h3>主服装图</h3>
                <p>{mainCloth.value ? "已选用于本次生成" : "示例预览中使用的衣服"}</p>
              </article>
              <article>
                {bottom.value ? (
                  <PhotoTile className="pants-one" image={bottom.value.url} label="" showLabel={false} />
                ) : (
                  <AssetEmpty />
                )}
                <h3>下装图</h3>
                <p>{bottom.value ? "本次生成使用了这个可选槽位" : "示例预览未展示可选单品"}</p>
              </article>
            </div>
          </section>

          <aside className="settings-column">
            <h2>下一步调整</h2>
            <section className="settings-card">
              <h3>风格</h3>
              <div className="style-grid">
                {styleCards.map(([title, text, imageClass], index) => (
                  <button
                    className={index === styleIndex ? "selected" : ""}
                    key={title}
                    type="button"
                    onClick={() => setStyleIndex(index)}
                  >
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
                {["服装", "我"].map((option) => (
                  <button
                    className={focus === option ? "selected" : ""}
                    key={option}
                    type="button"
                    onClick={() => setFocus(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <p>比例</p>
              <div className="ratio-grid">
                {ratioOptions.map(({ label, w, h }) => (
                  <button
                    className={ratio === label ? "selected" : ""}
                    key={label}
                    type="button"
                    onClick={() => setRatio(label)}
                  >
                    {w ? <span className="ratio-shape" style={{ width: w, height: h }} /> : null}
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              <p>尺寸</p>
              <div className="size-grid">
                {sizeOptions.map(({ label, note, locked }) => (
                  <button
                    className={size === label ? "selected" : ""}
                    disabled={locked}
                    key={label}
                    type="button"
                    onClick={() => setSize(label)}
                  >
                    <strong>{label}</strong>
                    <small>{note}</small>
                  </button>
                ))}
              </div>
              <small>登录后解锁 2K，升级解锁 4K。</small>
              <button className="generate-button" type="button" disabled={!ready}>
                ⌁ 一键试衣
              </button>
            </section>
          </aside>
        </div>
      </section>

      <section className="decision-section">
        <div className="section-heading">
          <h2>先试穿，再决定穿什么</h2>
          <p>在购买、出门或分享穿搭前，用 光原TryOn 先确认衣服穿到人物身上的效果。</p>
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
            <span>使用 光原TryOn</span>
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
          <h2>如何用 光原TryOn 在线试穿衣服</h2>
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
            <h2>光原TryOn.</h2>
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
        <p className="copyright">© 2026 光原TryOn. 购买、搭配、上架前先看效果。</p>
      </footer>

      <div className="floating-tools" aria-label="快捷工具">
        <button type="button">⌘</button>
        <button type="button">文</button>
      </div>
    </main>
  );
}
