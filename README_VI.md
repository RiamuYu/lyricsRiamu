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

Trước tiên cài Spotify và thiết lập [Spicetify](https://spicetify.app/docs/getting-started/). App không có bước build, npm install hay bundler.

1. Tải source standalone và giải nén. **Sao lưu source custom trước khi thay file.**
2. Chép toàn bộ thư mục tên **lyrics-plus** vào CustomApps, giữ manifest và các thư mục con.

   | Hệ điều hành | Đường dẫn CustomApps thường dùng |
   | :-- | :-- |
   | Windows | `%LocalAppData%\spicetify\CustomApps` |
   | macOS / Linux | `~/.config/spicetify/CustomApps` |

   Nếu cài ở vị trí khác, dùng thư mục Spicetify đã cấu hình.

3. Đăng ký và nạp app:

   ```powershell
   spicetify config custom_apps lyrics-plus
   spicetify apply
   ```

4. Mở Spotify, chọn Lyrics Plus. Mở **Lyrics Plus config** từ menu hồ sơ hoặc nút cài đặt fullscreen.

**Nâng phiên bản:** sao lưu source custom, kiểm tra file standalone mới rồi thay thủ công. Hai script không tải cập nhật và không xóa file.

**Gỡ app:** sao lưu source, rồi tự bỏ đăng ký và áp dụng cấu hình:

```powershell
spicetify config custom_apps lyrics-plus-
spicetify apply
```

Chỉ xóa đúng thư mục app nếu muốn bỏ source. Xóa source không tự xóa key, cài đặt hoặc cache lưu cục bộ; xem xét dữ liệu đó riêng trong Spotify/Spicetify.

## Tùy chỉnh theo cách bạn nghe

- **Translation / Conversions:** nhập key và endpoint tương thích; chọn model thực sự khả dụng. Chỉnh lời gốc/bản dịch/phiên âm, vị trí, phong cách và đại từ. Tên preset không đảm bảo model còn khả dụng.
- **Appearance:** chỉnh chữ và hiệu ứng, xem mẫu, lưu preset. Khôi phục giao diện không reset key AI hoặc prompt.
- **Background:** chỉnh độ mờ, sáng, zoom; chọn loop, nền quảng cáo, thời gian thông báo và ngưỡng quảng cáo kẹt.

[Xem hướng dẫn tùy chỉnh →](CUSTOMIZATION.md)

## Credential và dữ liệu cá nhân

**Gemini/AI key mặc định rỗng.** Bạn nhập trong Settings. Key được lưu trên máy bằng Spicetify.LocalStorage/localStorage và gửi tới endpoint API bạn chọn khi request. Repository không nhận cài đặt của bạn. Local storage **không được mã hóa**: không đưa bản xuất dữ liệu trình duyệt, key hoặc token cá nhân lên Git.

YouTube InnerTube giữ key client giao thức đóng sẵn; mã phía client không thể giấu key này. Musixmatch user token mặc định đã được bỏ: tự nhập hoặc dùng luồng refresh hiện có. Log refresh thành công không in giá trị. Kiểm tra endpoint và proxy trước khi gửi credential tới dịch vụ.

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
