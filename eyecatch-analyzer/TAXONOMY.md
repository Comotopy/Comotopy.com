# 画像分類(タクソノミー)設計メモ

## 調べた先行事例と、そこから採用した考え方
| 事例 | 内容 | 採用した点 |
|---|---|---|
| [Azimi et al. 2012 (WWW)](https://arxiv.org/pdf/1202.2158) | 配信実績のあるディスプレイ広告から43の視覚特徴を抽出し、CTR予測に利用。全体特徴・局所特徴・顔数や文字数などの高度特徴に分類 | 「全体(色・明度)」「局所(要素)」「高度(人物・文字)」の3層で特徴を持つ |
| [Exploring Online Ad Images (arXiv 1509.00568)](https://ar5iv.labs.arxiv.org/html/1509.00568) | バナー26万枚を物体認識+クラスタリングで型に分類 | 将来、枚数が増えたら手動分類ではなくクラスタで「型」を発見する余地 |
| [Pitt Ads Dataset](https://arxiv.org/pdf/1707.03067) | 広告6.5万枚に、トピック38種・感情30種・象徴などを付与 | 「トーン(印象)」を別軸で持つ |
| [PKU PosterLayout](https://arxiv.org/pdf/2303.15937) / CGL-Dataset | ポスター要素を text / logo / underlay(+embellishment)に分類 | 要素の語彙(logo, underlay_band, decoration_effect)を採用 |
| [Orphex Creative AI](https://intercom.help/orphex/en/articles/14838902-creative-ai-find-the-visual-patterns-that-drive-performance) | 顔・文字オーバーレイ・色などを複数ラベルで付与し、独自タクソノミーも可能 | 複数ラベル+独自語彙の考え方 |

注意:
- 広告バナー向けの**標準的な固定分類は確認できませんでした**。上記は参考であり、下の語彙は実画像6枚に合わせた**たたき台**です。
- 求人バナーのCTR傾向を示す公開調査は今回の検索では見つかりませんでした(マーベリック社の2016年調査レポートが存在するようですが、本文は未確認)。

## 設計方針: 単一の「画像タイプ」をやめ、複数の軸に分解
| 軸 | フィールド | 語彙 |
|---|---|---|
| 全体の構成 | `image_style` | photo_dominant / illustration_dominant / graphic_dominant / mixed |
| 写真の被写体 | `photo_subject` | person / vehicle / workplace / product / scenery |
| 実写人物 | `people_count`, `genders`, `person_framing`, `person_expression`, `person_gaze` | framing: face_closeup / upper_body / full_body / circle_cutout |
| イラスト人物 | `illustration_people_count` | 実写とは別集計 |
| 構成要素 | `elements` | photo_cutout, photo_frame, icon, illustration_person, chart, logo, badge, speech_bubble, underlay_band, checklist, decoration_effect |
| レイアウト型 | `layout_pattern` | text_left_person_right, text_top_object_below, center_object_radial, photo_left_text_right, full_photo_overlay, other |
| 文字の強調 | `text_emphasis` | number_highlight, outline_stroke, underlay_band, checklist, color_split_headline, speech_bubble |
| 訴求 | `appeals` | salary, no_experience, flexible_shift, license_only, vehicle_support, side_job, no_fee, direct_commute ほか |
| 印象 | `tone` | trust, friendly, pop, impact, serious, clean |
| 数値 | 色・明度・彩度・縦横比・文字面積比 | 画像処理で算出(文字面積比のみ概算) |

## 改訂(実画像11枚の確認後)
- `purpose`(画像の目的)を追加: direct_recruit(応募を直接促す) / explainer(仕事内容・制度の解説) / caution(注意喚起)。11枚中3枚が求人ではなく解説・注意喚起だった。
- `appeals` に employment_type(業務委託・雇用形態) / stable_income(安定・保証) / rewarding(やりがい・地域密着) を追加。11枚で `other` が82%を占めたため。
- `layout_pattern` に object_top_text_bottom を追加。
- 色は主要色(最頻色)より強調色(accent_colors)を主に使う。写真の背景に最頻色が引っ張られるため。

## 未解決
- 語彙は6枚から作ったもの。枚数が増えたら頻出する `other` を昇格させ、使われない語彙を削る。
- `tone` は主観を含む。判定者(人/AI)による揺れを、同じ画像を複数回判定して測る必要がある。
