import { useRef, useState } from "react";

import { generateTryon } from "../shared/api.js";
import commerceAfterImage from "../assets/commerce-after.jpg";
import commerceBeforeImage from "../assets/commerce-before.jpg";
import dailyAfterImage from "../assets/daily-after.jpg";
import dailyBeforeImage from "../assets/daily-before.jpg";
import decisionBuyAfterImage from "../assets/decision-buy-after.jpg";
import decisionBuyBeforeImage from "../assets/decision-buy-before.jpg";
import decisionCompareAfterImage from "../assets/decision-compare-after.jpg";
import decisionCompareBeforeImage from "../assets/decision-compare-before.jpg";
import decisionShareAfterImage from "../assets/decision-share-after.jpg";
import decisionShareBeforeImage from "../assets/decision-share-before.jpg";
import fashionAfterImage from "../assets/fashion-after.jpg";
import fashionBeforeImage from "../assets/fashion-before.jpg";
import guideStep1Image from "../assets/guide-step-1.webp";
import guideStep2Image from "../assets/guide-step-2.webp";
import guideStep3Image from "../assets/guide-step-3.webp";
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

// 尺寸选项：2K -> nano-banana-2-2k，4K -> nano-banana-2-4k（后端按 size 关联模型）
const sizeOptions = [
  { label: "2K", note: "标准 2 积分" },
  { label: "4K", note: "高清 4 积分" },
];

const featureCards = [
  {
    title: "购买前预览",
    text: "把衣服预览到自己的照片上，下单、退换或比较款式前先看效果。",
    tag: "购买更安心",
    icon: <SparkleTagIcon />,
    beforeImage: decisionBuyBeforeImage,
    afterImage: decisionBuyAfterImage,
  },
  {
    title: "比较穿搭",
    text: "在同一张人物照上尝试不同服装和风格，再决定最终造型。",
    tag: "更多选择",
    icon: <StoreTagIcon />,
    beforeImage: decisionCompareBeforeImage,
    afterImage: decisionCompareAfterImage,
  },
  {
    title: "分享预览",
    text: "下载无水印结果，用来展示一套穿搭想法。",
    tag: "无水印下载",
    icon: <ToolsTagIcon />,
    beforeImage: decisionShareBeforeImage,
    afterImage: decisionShareAfterImage,
  },
];

const scenarioCards = [
  ["AI 换装工具", "当目标是直接给照片换衣服时，使用这个专门的换装页面。", "打开 AI 换装", "热门"],
  ["连衣裙在线试穿", "预览连衣裙廓形、长度和造型效果，进入专门的连衣裙页面。", "试穿连衣裙", "新"],
  ["AI Fashion Model 商品图", "从卖家服装图生成上身商品图，适合单个 SKU 验证。", "生成商品图", "卖家"],
  ["GPT Image 2 虚拟试穿", "当你关心 GPT Image 2 的比例和模型设置时，使用这个模型页面。", "体验 GPT IMAGE 2", "GPT IMAGE 2"],
];

const faqItems = [
  {
    question: "什么是虚拟试穿?",
    answer:
      "虚拟试穿可以在购买、搭配、上架或拍摄前，把服装预览到人物照片上。光原TryOn 使用 AI 根据你上传的人物照和服装图生成可下载的真实试穿预览。",
  },
  {
    question: "需要上传什么?",
    answer: "一张清晰的人物照 + 服装图。上衣必选，下装可选。光线干净、主体无遮挡，效果更稳定。",
  },
  {
    question: "“风格”和“关注点”是什么?",
    answer: "风格决定整体质感（原生风格 / 日常 / 电商 / 大片）。关注点决定优化方向：服装更清晰，或更像你本人。",
  },
  {
    question: "需要登录吗？积分和清晰度怎么算?",
    answer:
      "不登录也能免费试 1 次 1K。首次真实登录固定赠送 2 积分，并解锁 2K 与历史保存；升级 Pro 解锁 4K。登录后积分消耗：1K=2、2K=2、4K=4（生成失败会退回）。",
  },
  {
    question: "我的照片安全吗?",
    answer:
      "你的上传与结果都存放在私有存储里，只能通过短期签名链接访问。匿名生成用订单号查看，请把它当作私密链接。登录后结果会出现在历史里，你可以随时删除。",
  },
  {
    question: "可以下载并用于商用吗?",
    answer:
      "可以。下载结果无水印，可用于个人或商业项目；请确保你上传的人物照与衣服图具备合法授权/版权。",
  },
  {
    question: "光原TryOn 是免费的虚拟试穿工具吗?",
    answer: "是的，不登录也能免费试 1 次 1K。首次真实登录固定赠送 2 积分，可用更高清并保存更多历史。",
  },
  {
    question: "也可以用 光原TryOn 给照片换衣服吗?",
    answer:
      "可以。首页是更通用的虚拟试穿工作区；如果你的需求是明确给照片换装，AI 换装工具页面会更贴近这个意图。",
  },
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

function SparkleTagIcon() {
  return (
    <svg {...iconProps} width="20" height="20" viewBox="0 0 24 24">
      <path d="M11 4 9.7 8.3 6 10l3.7 1.7L11 16l1.3-4.3L16 10l-3.7-1.7Z" />
      <path d="M18 12.5 17.2 15 15 16l2.2 1 0.8 2.5 0.8-2.5 2.2-1-2.2-1Z" />
      <path d="M5 3v4" />
      <path d="M3 5h4" />
    </svg>
  );
}

function StoreTagIcon() {
  return (
    <svg {...iconProps} width="20" height="20" viewBox="0 0 24 24">
      <path d="M4 10h16" />
      <path d="M5 10l1-5h12l1 5" />
      <path d="M6 10v9h12v-9" />
      <path d="M9 19v-5h6v5" />
      <path d="M4 10a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
    </svg>
  );
}

function ToolsTagIcon() {
  return (
    <svg {...iconProps} width="20" height="20" viewBox="0 0 24 24">
      <path d="m14.7 6.3 3 3" />
      <path d="m7.5 14.5-3 3a2.1 2.1 0 0 0 3 3l3-3" />
      <path d="m16.5 4.5 3 3-12 12-3-3Z" />
      <path d="m4 8 3-3" />
      <path d="m5.5 3.5 3 3" />
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

// 把图片（blob: 或资源 URL）压到 maxSize 内并转成 jpeg data URI，再发给后端
async function toJpegDataUrl(src, maxSize = 1536, quality = 0.9) {
  const blob = await (await fetch(src)).blob();
  const bitmap = await createImageBitmap(blob);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
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

  const [focus, setFocus] = useState("服装");
  const [size, setSize] = useState("2K");

  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [genError, setGenError] = useState("");
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  const ready = Boolean(person.value && mainCloth.value);
  const hasAnyUpload = Boolean(person.value || mainCloth.value || bottom.value);
  const activeFeature = featureCards[activeFeatureIndex];

  async function handleGenerate() {
    if (!ready || generating) {
      return;
    }
    setGenerating(true);
    setGenError("");
    setResult(null);
    try {
      const [personImg, topImg, bottomImg] = await Promise.all([
        toJpegDataUrl(person.value.url),
        toJpegDataUrl(mainCloth.value.url),
        bottom.value ? toJpegDataUrl(bottom.value.url) : Promise.resolve(null),
      ]);
      const res = await generateTryon({
        person_image: personImg,
        top_image: topImg,
        bottom_image: bottomImg,
        focus,
        size,
      });
      setResult(res.image_url);
    } catch (e) {
      setGenError(e.message || "生成失败，请重试");
    } finally {
      setGenerating(false);
    }
  }

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
              {result ? (
                <>
                  <div className="before-after">
                    <article>
                      <span>试穿前</span>
                      <PhotoTile
                        className="portrait-dark"
                        image={person.value ? person.value.url : stageBeforeImage}
                        alt="试穿前"
                        showLabel={false}
                      />
                    </article>
                    <div className="stage-divider" />
                    <article>
                      <span>试穿后</span>
                      <PhotoTile className="portrait-light" image={result} alt="试穿后" showLabel={false} />
                    </article>
                  </div>
                  <a className="stage-download" href={result} target="_blank" rel="noreferrer">
                    下载 / 查看大图
                  </a>
                </>
              ) : generating ? (
                <div className="stage-loading">
                  <span className="spinner" />
                  <p>正在生成试衣效果，请稍候…</p>
                </div>
              ) : hasAnyUpload ? (
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
              <p>尺寸</p>
              <div className="size-grid">
                {sizeOptions.map(({ label, note }) => (
                  <button
                    className={size === label ? "selected" : ""}
                    key={label}
                    type="button"
                    onClick={() => setSize(label)}
                  >
                    <strong>{label}</strong>
                    <small>{note}</small>
                  </button>
                ))}
              </div>
              <small>2K 为香蕉 2K 模型，4K 为香蕉 4K 模型。</small>
              <button
                className="generate-button"
                type="button"
                disabled={!ready || generating}
                onClick={handleGenerate}
              >
                {generating ? "生成中…" : "⌁ 一键试衣"}
              </button>
              {!ready && <small className="gen-hint">请先放好人物照和主服装图。</small>}
              {genError && <small className="gen-error">{genError}</small>}
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
            {featureCards.map(({ title, text, tag, icon }, index) => (
              <article
                className={index === activeFeatureIndex ? "active" : ""}
                key={title}
                onFocus={() => setActiveFeatureIndex(index)}
                onMouseEnter={() => setActiveFeatureIndex(index)}
                tabIndex={0}
              >
                <span className="feature-tag">
                  {icon}
                  {tag}
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <div className="stacked-preview">
            <PhotoTile
              className="portrait-before"
              image={activeFeature.beforeImage}
              key={`${activeFeature.title}-before`}
              label="试穿前"
              alt={`${activeFeature.title}试穿前`}
            />
            <PhotoTile
              className="portrait-after"
              image={activeFeature.afterImage}
              key={`${activeFeature.title}-after`}
              label="试穿后"
              alt={`${activeFeature.title}试穿后`}
            />
            <span>{activeFeature.title}</span>
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
            <img className="step-card-image" src={guideStep1Image} alt="" aria-hidden="true" />
            <span>1</span>
            <h3>上传人物照</h3>
            <p>上传一张清晰的人物照片，可以是你自己、模特或商品主体，它会成为虚拟试穿的基础。</p>
          </article>
          <article>
            <img className="step-card-image" src={guideStep2Image} alt="" aria-hidden="true" />
            <span>2</span>
            <h3>上传衣服图</h3>
            <p>上传你想预览的服装。正面、干净、光线好的服装图，更容易得到自然效果。</p>
          </article>
          <article>
            <img className="step-card-image" src={guideStep3Image} alt="" aria-hidden="true" />
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
          {faqItems.map(({ question, answer }) => (
            <details key={question}>
              <summary>
                {question}
                <span>⌄</span>
              </summary>
              <p>{answer}</p>
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
