> [!WARNING]
> **⚠️ ĐÂY LÀ PHIÊN BẢN CUSTOM ĐỘC LẬP.** Không chạy lệnh cập nhật từ bản gốc để tránh mất code cấu hình AI. Cài đặt, gỡ cài đặt và cập nhật tự động đều bị vô hiệu hóa.

![Lyric Plus Translate — Standalone 1.10.0](assets/readme-banner.svg)

<p align="center"><a href="README.md">English</a> · <a href="CUSTOMIZATION.md">Tùy chỉnh</a> · <a href="CHANGELOG.md">Lịch sử thay đổi</a> · <a href="LICENSE">Giấy phép</a></p>

Bản tùy chỉnh độc lập của **lyrics-plus** cho Spicetify, do **Hoàng Đức Mạnh** duy trì. Đọc lời nhạc, dịch qua API AI bạn chọn và điều chỉnh không gian nghe theo sở thích.

## Trải nghiệm nghe nhạc

| Tính năng | Bạn có thể làm gì? |
| :-- | :-- |
| **Toàn màn hình · F12** | Bìa và điều khiển cạnh lyrics; bìa ở giữa khi không có lời hoặc bạn ẩn lời. Thanh Spotify hiện khi rê gần mép màn hình; công cụ lyrics hiện khi rê gần góc dưới phải. |
| **Dịch lời nhạc** | Chọn endpoint, model khả dụng, ngôn ngữ, phong cách và đại từ tiếng Việt. Hiện lời gốc, bản dịch và phiên âm được hỗ trợ. |
| **Giao diện** | Font chính/bản dịch/phiên âm, cỡ, độ đậm, giãn dòng, độ mờ và chuyển động. Xem trước, preset Dịu/Điện ảnh/Karaoke và preset cá nhân. |
| **Nền** | Video luôn tắt tiếng hoặc ảnh bìa mờ. Chọn video thủ công; dùng bìa hoặc loop khi video ngắn hơn bài. |
| **Quảng cáo** | Tùy chọn dùng bìa suốt quảng cáo nhận diện được. Thông báo có thời gian riêng; quảng cáo kẹt thử reload tối đa hai lần. |
| **Timing từng từ** | Sáng từng từ khi nguồn có timing thật; nếu không thì đồng bộ theo dòng. |

> [!NOTE]
> Bộ tìm video xét metadata, không xác minh hình ảnh MV chính thức. YouTube có thể không cung cấp tín hiệu quảng cáo. Spotify thật vẫn cần xác nhận; xem [phạm vi kiểm tra và giới hạn](CUSTOMIZATION.md#validation-and-limits).

## Cài đặt thủ công

Hướng dẫn đầy đủ dưới đây dành cho **Windows**. Nếu đã có Spotify và Spicetify chạy tốt, chuyển thẳng tới **Bước 3**. Không cần Node.js, npm hoặc bước build để sử dụng app.

### Bước 1 — Tải và mở Spotify

1. Vào [trang tải Spotify cho Windows](https://www.spotify.com/download/windows/), chọn **Download directly from Spotify** để lấy bản cài desktop từ website.
2. Mở file cài đặt và hoàn tất cài Spotify. Dùng bản desktop; app này không chạy trong Spotify Web Player hoặc điện thoại.
3. Mở Spotify, đăng nhập tài khoản và để chạy **ít nhất 60 giây** để tạo các file cần thiết.
4. Đóng Spotify trước khi chỉnh sửa bằng Spicetify.

Nếu đang dùng bản Microsoft Store và Spicetify báo thiếu prefs, chuyển sang bản desktop từ website theo [FAQ chính thức](https://spicetify.app/docs/faq#cannot-find-pref_file). Không xóa dữ liệu Spotify chỉ để thử sửa lỗi.

### Bước 2 — Cài Spicetify CLI

1. Mở Start, tìm **PowerShell** hoặc **Windows Terminal**, mở cửa sổ bình thường.
2. Chọn **một** trong hai cách cài dưới đây.

**Cách A — Windows Package Manager:**

```powershell
winget install Spicetify.Spicetify
```

**Cách B — Script CLI chính thức**, nếu máy không có winget:

```powershell
iwr -useb https://raw.githubusercontent.com/spicetify/cli/main/install.ps1 | iex
```

Đây là installer của **Spicetify CLI**, không phải installer của app lyrics-plus gốc. Chỉ chạy script từ nguồn chính thức sau khi xem nội dung. Marketplace không cần cho bản standalone này; nếu installer hỏi cài Marketplace, bạn có thể chọn **N**.

3. Đóng rồi mở lại PowerShell để cập nhật PATH, sau đó kiểm tra:

   ```powershell
   spicetify --version
   ```

4. Với lần thiết lập đầu tiên trên Spotify chưa được tùy chỉnh, tạo backup và áp dụng Spicetify:

   ```powershell
   spicetify backup apply
   ```

Nếu có lỗi, xử lý ở bảng cuối hướng dẫn rồi mới tiếp tục. Các lệnh này được đối chiếu với [hướng dẫn Spicetify chính thức](https://spicetify.app/docs/getting-started).

### Bước 3 — Tải đúng source standalone

1. Tại repository **lyricsRiamu**, chọn **Code → Download ZIP**. Khi tải nhánh main, file ZIP có tên `lyricsRiamu-main.zip`; giải nén được thư mục **lyricsRiamu-main**. Repo chưa có URL cố định trong tài liệu này.
2. **lyricsRiamu-main chính là thư mục gốc của app**, trực tiếp chứa `index.js`, `manifest.json`, các file CSS và thư mục code. Không có và không cần tìm thư mục `lyrics-plus` bên trong.
3. Giữ cả `components`, `utils`, `services`, `providers`, `parsers`, `i18n`, `assets` và các file CSS. Không chỉ chép mỗi `index.js`.
4. Sao lưu riêng source custom đang có. Không tải lại bản stock/upstream để thay bản standalone.

Cấu trúc ngay sau khi giải nén:

```text
lyricsRiamu-main/
├── index.js
├── manifest.json
├── style.css
├── variables.css
├── components/
├── utils/
├── services/
└── ... các thư mục và file còn lại
```

### Bước 4 — Chép vào CustomApps và nạp app

Xem thư mục dữ liệu của Spicetify:

```powershell
spicetify path userdata
```

Trong thư mục được in ra, mở hoặc tạo **CustomApps**. Chép nguyên thư mục **lyricsRiamu-main** vào đó, rồi đổi tên **bản chép** thành **lyrics-plus** để dùng các lệnh đăng ký bên dưới. Đây là bước đổi tên khi cài đặt, không phải một thư mục có sẵn trong ZIP. Nếu CustomApps đã có `lyrics-plus`, sao lưu thư mục cũ trước khi thay thế.

Trên Windows, vị trí có thể là `%AppData%\spicetify\CustomApps`; một số cài đặt còn có app đi kèm tại `%LocalAppData%\spicetify\CustomApps`. Không mặc định rằng hai vị trí này là một.

```text
CustomApps/
└── lyrics-plus/
    ├── index.js
    ├── manifest.json
    ├── style.css
    ├── variables.css
    ├── components/
    ├── utils/
    ├── services/
    └── ... các thư mục và file còn lại
```

Đúng: `CustomApps/lyrics-plus/manifest.json`. Sai: `CustomApps/lyrics-plus/lyricsRiamu-main/manifest.json` hoặc `CustomApps/lyrics-plus/lyrics-plus/manifest.json`.

Đăng ký app và nạp file:

```powershell
spicetify config custom_apps lyrics-plus
spicetify apply
```

Kiểm tra thư mục app thực sự được chọn:

```powershell
spicetify path -a lyrics-plus
```

Nếu đường dẫn không trỏ tới source vừa chép, kiểm tra các bản trùng tên trước khi thay file. Lệnh đăng ký thêm app vào danh sách hiện có, không cần xóa các app khác. Xem [hướng dẫn Custom Apps](https://spicetify.app/docs/customization/custom-apps).

Mở lại Spotify, chọn Lyrics Plus ở thanh điều hướng. Thư mục cài đặt phải giữ tên **lyrics-plus** dù tên hiển thị là Lyric Plus Translate.

<details>
<summary>macOS / Linux</summary>

Tải Spotify từ [website chính thức](https://www.spotify.com/download/) và làm theo [thiết lập theo hệ điều hành của Spicetify](https://spicetify.app/docs/getting-started). Linux cần xem riêng cách cài Spotify và quyền truy cập; không dùng nguyên lệnh PowerShell của Windows.

Sau khi CLI hoạt động, xem `spicetify path userdata`, chép source vào `CustomApps/lyrics-plus`, rồi dùng cùng lệnh đăng ký/apply ở trên. Vị trí thường gặp là `~/.config/spicetify/CustomApps`. Đăng nhập Spotify và để chạy ít nhất 60 giây trước lần thiết lập đầu tiên.

</details>

**Nâng phiên bản:** sao lưu source custom, kiểm tra file standalone mới rồi thay thủ công. Hai script không tải cập nhật và không xóa file.

**Gỡ app:** sao lưu source, rồi tự bỏ đăng ký và áp dụng cấu hình:

```powershell
spicetify config custom_apps lyrics-plus-
spicetify apply
```

Chỉ xóa đúng thư mục app nếu muốn bỏ source. Xóa source không tự xóa key, cài đặt hoặc cache lưu cục bộ; xem xét dữ liệu đó riêng trong Spotify/Spicetify.

## Tùy chỉnh theo cách bạn nghe

### Bước 5 — Mở cài đặt và chọn nguồn lyrics

Mở menu hồ sơ Spotify → **Lyrics Plus config**, hoặc nhấn F12 rồi rê lên bìa để thấy nút cài đặt. Trong **General**, chọn ngôn ngữ giao diện. Trong **Providers**, bật nguồn lời muốn dùng. Lyrics gốc có thể dùng mà không cần key AI; bài không có lời sẽ hiển thị bìa ở fullscreen.

Nếu dùng Musixmatch, dùng nút **Refresh Token** hoặc nhập token của bạn khi cần. Không dùng token của người khác; không chia sẻ token trong ảnh chụp hoặc issue.

### Bước 6 — Thiết lập dịch AI

1. Nếu dùng Gemini, đăng nhập [Google AI Studio](https://aistudio.google.com/api-keys), tạo/chọn project và tạo API key theo [hướng dẫn của Google](https://ai.google.dev/gemini-api/docs/api-key). Nếu dùng dịch vụ khác, lấy key từ chính dịch vụ đó.
2. Trong **Translation**, điền:

   | Mục | Cách chọn |
   | :-- | :-- |
   | API Endpoint | Endpoint tương thích do nhà cung cấp chỉ định. Với Gemini, app đã có endpoint mặc định. |
   | Model Name | Model thực sự có trong tài khoản/provider; không mặc định rằng mọi tên preset đều dùng được. |
   | API Keys | Thêm key riêng vào ô key. Có thể thêm nhiều key nếu cần, không sửa source hay tạo file `.env`. |
   | Response Format | Giữ mặc định trước; nếu provider không hỗ trợ JSON Schema, thử Prompt. |
   | Reasoning Effort | Chọn mức provider/model hỗ trợ; không phải model nào cũng trả reasoning. |
   | Pre-translation | Tùy chọn dịch bài tiếp theo trước khi phát; có thể phát sinh thêm request. |

3. Mở **Conversions** từ công cụ lyrics: chọn ngôn ngữ đích, chế độ AI phù hợp và vị trí bản dịch. Muốn lời gốc kèm bản dịch phía dưới, chọn **Below original**. Phong cách dịch và đại từ nằm trong menu này.
4. Phát một bài có lời và chờ request hoàn thành. Key AI không cấp quyền Spotify Premium; hạn mức/chi phí phụ thuộc provider.

### Bước 7 — Chỉnh giao diện và nền

**Bản dịch chưa đúng ý?** Bấm nút làm mới bản dịch AI (nếu menu hiện nhiều chế độ, chọn mục bản dịch AI). Chọn **Rà soát và dịch lại** để AI đọc lại lời gốc và bản dịch hiện có, hoặc **Dịch lại theo góp ý** để nhập ngữ cảnh/yêu cầu sửa. Giữ setting hiện tại: Auto được xem xét lại, lựa chọn cố định được giữ nguyên. Góp ý lưu cục bộ theo bài, chỉ gửi khi chọn chế độ góp ý. Bản cũ chỉ được thay khi kết quả mới hợp lệ; không có bước tra cứu Internet. Làm mới phiên âm hoặc cả hai chế độ vẫn dùng luồng reset cũ.

Trong **Appearance**, chọn font, cỡ chữ, giãn dòng hoặc preset, rồi xem mẫu trước khi lưu preset riêng. Font bản dịch/phiên âm phải có trên máy.

Trong **Background**, bật nền ảnh bìa hoặc video. Video luôn mute; mặc định video hết chuyển sang bìa. Bật **Loop video when it ends** nếu muốn lặp. Nền quảng cáo giữ suốt quảng cáo nhận diện được; 5/7/10 giây chỉ là thời gian thông báo. Nếu tự tìm sai video, mở cài đặt video trong công cụ lyrics để chọn thủ công.

Nhấn **F12** để vào/thoát fullscreen. Rê chuột gần mép trên/dưới hoặc góc dưới phải để gọi công cụ.

Khôi phục giao diện chỉ đổi các trường giao diện, không reset key AI hoặc prompt.

[Xem hướng dẫn tùy chỉnh →](CUSTOMIZATION.md)

## Credential và dữ liệu cá nhân

**Gemini/AI key mặc định rỗng.** Bạn nhập trong Settings. Key được lưu trên máy bằng Spicetify.LocalStorage/localStorage và gửi tới endpoint API bạn chọn khi request. Repository không nhận cài đặt của bạn. Local storage **không được mã hóa**: không đưa bản xuất dữ liệu trình duyệt, key hoặc token cá nhân lên Git.

YouTube InnerTube giữ key client giao thức đóng sẵn; mã phía client không thể giấu key này. Musixmatch user token mặc định đã được bỏ: tự nhập hoặc dùng luồng refresh hiện có. Log refresh thành công không in giá trị. Kiểm tra endpoint và proxy trước khi gửi credential tới dịch vụ.

## Khi gặp lỗi

| Hiện tượng | Kiểm tra trước |
| :-- | :-- |
| Không nhận lệnh spicetify | Mở lại terminal sau khi cài; kiểm tra CLI/PATH theo tài liệu chính thức. |
| Thiếu prefs / không tìm được Spotify | Đã mở, đăng nhập và đợi 60 giây chưa? Kiểm tra bản desktop và [FAQ](https://spicetify.app/docs/faq#cannot-find-pref_file). |
| App không xuất hiện hoặc vẫn là giao diện cũ | Xem `spicetify path -a lyrics-plus`; kiểm tra folder không lồng thêm một cấp, manifest đúng và đã apply/mở lại Spotify. |
| Không có lyrics | Thử bài khác và nguồn khác trong Providers; không phải bài nào cũng có dữ liệu. |
| AI báo 401/403 | Kiểm tra key, quyền của project và endpoint; không đăng key đầy đủ lên issue. |
| AI báo 404/model not found | Chọn model hiện có từ provider, thay vì chỉ dựa vào tên preset. |
| AI báo 429 | Chờ hạn mức phục hồi, xem quota của provider và giảm pre-translation nếu cần. |
| Video lỗi hoặc không tìm thấy | Dùng ảnh bìa hoặc chọn video thủ công; kiểm tra mạng/proxy. |
| Spotify vừa cập nhật, mod bị mất | Sao lưu source custom; đối chiếu [hướng dẫn khôi phục Spicetify](https://spicetify.app/docs/getting-started#updating). Phân biệt cập nhật CLI với cập nhật app standalone. |

## Phát triển và kiểm tra

JavaScript/CSS nạp trực tiếp theo thứ tự manifest. Giữ **assets/libs**, mã runtime và tài liệu; không cần package manager.

```powershell
node tests/video-background.test.cjs
```

Kiểm tra mô phỏng offline này bao gồm chọn video, cache, request đến muộn, ảnh bìa và loop/tua. Cú pháp và JSON đúng không chứng minh app chạy tốt trên Spotify thật hay nhận diện mọi quảng cáo.

## Credit và giấy phép

Bản custom kế thừa mã có sẵn, không nhận toàn bộ source gốc là do tác giả bản custom viết.

- **Nhóm Spicetify:** [lyrics-plus gốc](https://github.com/spicetify/cli/tree/main/CustomApps/lyrics-plus) và runtime.
- **Tuna285:** bản tùy chỉnh dịch/video trước đó mà standalone này kế thừa. Chủ động bỏ link cài đặt/cập nhật upstream khỏi tài liệu.
- **Công cụ ngôn ngữ đi kèm:** Kuroshiro và Kuromoji analyzer, Aromanize, OpenCC, pinyin-pro. Credit và giấy phép gốc vẫn áp dụng.

Phân phối theo [GNU LGPL-2.1](LICENSE). Giữ credit và thông báo giấy phép khi phân phối lại.
