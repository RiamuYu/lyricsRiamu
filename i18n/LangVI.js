// Vietnamese language file for Lyrics Plus
// Balanced version: Common UI terms in Vietnamese, specific technical terms in English.
window.LANG_VI = {
  "meta": {
    "language": "Tiếng Việt",
    "code": "vi",
    "author": "Lyrics Plus"
  },
  "ui": {
    "translating": "Đang dịch...",
    "providedBy": "Lời bài hát được cung cấp bởi {provider}",
    "reasoningTitle": "Quá trình suy nghĩ của AI",
    "reasoningPending": "Đang chờ model trả lời. Nếu API chỉ gửi reasoning sau khi xong, nội dung sẽ hiện ở đây.",
    "reasoningEmpty": "Không có đoạn reasoning riêng cho lần gọi này. Nhiều model không hiện thinking, hoặc prompt đang yêu cầu chỉ xuất kết quả.",
    "reasoningTabInsights": "Ý nghĩa bài hát",
    "reasoningTabTranslation": "Dịch",
    "reasoningTabPhonetic": "Phiên âm",
    "insightsLoading": "Đang dùng Google Search tra cứu ý nghĩa bài hát & từ lóng…",
    "insightsKeyMissing": "Vui lòng nhập Gemini API Key trong Settings để dùng tính năng tra cứu.",
    "insightsNoTrack": "Không lấy được thông tin bài hát từ Spotify.",
    "preTranslateChip": "Tiếp: {title}"
  },
  "tabs": {
    "general": "Chung",
    "translation": "Dịch thuật",
    "providers": "Nguồn nhạc",
    "background": "Hình nền",
    "appearance": "Giao diện",
    "advanced": "Nâng cao"
  },
  "sections": {
    "displayControls": "Hiển thị & Điều khiển",
    "syncedOptions": "Tùy chọn Lời bài hát (Synced)",
    "unsyncedOptions": "Tùy chọn Lời bài hát (Unsynced)",
    "geminiApi": "API dịch thuật (LLM)",
    "serviceOrder": "Thứ tự Dịch vụ",
    "corsProxy": "CORS Proxy Template",
    "videoBackground": "Video Background",
    "generalBackground": "Nền chung",
    "appearanceColors": "Màu sắc Giao diện",
    "appearanceButton": "Kiểu Nút",
    "aboutAndUpdates": "Thông tin & Cập nhật"
  },
  "settings": {
    "language": {
      "label": "Ngôn ngữ",
      "desc": "Chọn ngôn ngữ hiển thị (Reload Spotify để áp dụng hoàn toàn)."
    },
    "playbarButton": {
      "label": "Nút Playbar",
      "desc": "Thay thế nút Lyrics mặc định của Spotify bằng Lyrics Plus."
    },
    "miniLyrics": {
      "label": "Mini Lyrics Overlay",
      "desc": "Hiện panel lyrics nổi trên mọi trang (bật/tắt bằng Ctrl+Shift+M)."
    },
    "globalDelay": {
      "label": "Global Delay",
      "desc": "Chỉnh độ trễ (ms) cho tất cả bài hát."
    },
    "fontSize": {
      "label": "Cỡ chữ",
      "desc": "(Hoặc giữ Ctrl + lăn chuột trong màn hình lyrics)"
    },
    "fontFamily": {
      "label": "Phông chữ",
      "desc": "Tùy chỉnh phông chữ lời bài hát (để trống để dùng mặc định).",
      "placeholder": "Mặc định (Spotify)"
    },
    "alignment": {
      "label": "Căn chỉnh",
      "options": {
        "left": "Trái",
        "center": "Giữa",
        "right": "Phải"
      }
    },
    "fullscreenKey": {
      "label": "Phím tắt Toàn màn hình"
    },
    "linesBefore": {
      "label": "Compact Mode: Số dòng trên"
    },
    "linesAfter": {
      "label": "Compact Mode: Số dòng dưới"
    },
    "fadeBlur": {
      "label": "Compact Mode: Độ mờ (Blur)"
    },
    "unsyncedAutoScroll": {
      "label": "Unsynced: Tự động cuộn",
      "desc": "Tự động cuộn theo tiến trình bài hát. Tạm dừng 5s khi cuộn thủ công."
    },
    "apiEndpoint": {
      "label": "API Endpoint",
      "desc": "URL API tương thích OpenAI (<code>/v1/chat/completions</code>). Chọn preset từ dropdown hoặc dán URL tùy ý."
    },
    "modelName": {
      "label": "Model Dịch Thuật",
      "desc": "Model LLM dùng để dịch nghĩa lời nhạc (ví dụ: gemini-3.5-flash)."
    },
    "phoneticModelName": {
      "label": "Model Phiên Âm",
      "desc": "Model LLM dùng để tạo Romaji/Furigana. Nên chọn model nhẹ, nhanh (như gemini-3.5-flash-lite) để tiết kiệm quota của model dịch chính."
    },
    "apiKeys": {
      "label": "Danh sách Gemini API Keys",
      "desc": "Thêm nhiều key để tự động xoay vòng tránh lỗi giới hạn lượt dùng."
    },
    "responseMode": {
      "label": "Định dạng Response",
      "desc": "'Prompt Engineering' hoạt động với MỌI model. 'JSON Schema' cần model hỗ trợ nhưng cho kết quả ổn định hơn.",
      "options": {
        "prompt": "Prompt Engineering (Mọi model)",
        "json_schema": "JSON Schema"
      },
      "unsupportedToast": "Model này không hỗ trợ JSON Schema — đã tự chuyển sang Prompt Engineering."
    },
    "smartPreload": {
      "label": "Tải trước thông minh",
      "desc": "Tự động chuẩn bị và lưu sẵn lời dịch (Gemini) và video background (YouTube) ở nền cho bài tiếp theo."
    },
    "smartPreloadTime": {
      "label": "Thời gian chuẩn bị trước",
      "desc": "Bắt đầu chuẩn bị bài tiếp theo trước khi bài hát hiện tại kết thúc bao nhiêu giây."
    },
    "disableQueue": {
      "label": "Tắt hàng đợi (Parallel)",
      "desc": "Xử lý song song. Nhanh hơn nhưng dễ bị giới hạn (rate limit)."
    },
    "reasoningEffort": {
      "label": "Mức độ suy luận (Reasoning)",
      "desc": "Model suy nghĩ nhiều hay ít trước khi trả lời. Thấp = nhanh hơn. 'Thấp' là sweet spot cho dịch lyric. Không tác dụng với model không có thinking mode (vd. Gemma 4 26B A4B).",
      "options": {
        "off": "Tắt (nhanh nhất)",
        "low": "Thấp (khuyên dùng)",
        "medium": "Trung bình",
        "high": "Cao (chậm nhất, cho lyric phức tạp)"
      },
      "unsupportedToast": "Model này không thể tắt reasoning lúc chạy — nó vẫn sẽ suy nghĩ."
    },
    "transparentBackground": {
      "label": "Nền trong suốt",
      "desc": "BẬT: Hiện theme Spicetify. TẮT: Màu từ album art."
    },
    "noise": {
      "label": "Lớp phủ Noise"
    },
    "backgroundBrightness": {
      "label": "Độ sáng nền"
    },
    "videoBackground": {
      "label": "Video Background",
      "desc": "Bật hình nền bằng video."
    },
    "videoBackgroundLoop": {
      "label": "Lặp video khi kết thúc",
      "desc": "Tắt: chuyển sang ảnh bìa album khi video hết. Bật: lặp video đến hết bài nhạc."
    },
    "albumArtBackground": {
      "label": "Nền ảnh bìa album",
      "desc": "Dùng ảnh bìa album làm nền mờ khi không bật video. Khi bật video, ảnh bìa tự động thay thế video không tìm được hoặc đã hết."
    },
    "videoBackgroundScale": {
      "label": "Tỷ lệ Video",
      "desc": "Mức độ phóng to (mặc định 1.1x)"
    },
    "videoBackgroundDim": {
      "label": "Độ sáng Video",
      "desc": "Điều chỉnh độ sáng video (0-100)"
    },
    "videoBackgroundBlur": {
      "label": "Độ mờ Video"
    },
    "videoBackgroundFullscreen": {
      "label": "Bao phủ toàn bộ cửa sổ",
      "desc": "Cho phép video nền tràn ra toàn bộ cửa sổ Spotify thay vì chỉ ở khung lời nhạc."
    },
    "debugMode": {
      "label": "Chế độ Debug",
      "desc": "Hiện log chi tiết trong Console để sửa lỗi."
    },
    "jaDetectThreshold": {
      "label": "Ngưỡng phát hiện tiếng Nhật (Advanced)",
      "desc": "Độ nhạy khi phát hiện Kana."
    },
    "hansDetectThreshold": {
      "label": "Ngưỡng phát hiện Giản/Phồn thể (Advanced)",
      "desc": "Độ nhạy khi phân biệt chữ Hán."
    },
    "musixmatchLanguage": {
      "label": "Ngôn ngữ dịch Musixmatch",
      "desc": "Chọn ngôn ngữ đích cho Musixmatch."
    },
    "clearMemoryCache": {
      "label": "Xóa Cache bộ nhớ",
      "desc": "Xóa lời bài hát đang lưu trong RAM.",
      "button": "Xóa Cache"
    },
    "uiSwitchOnColor": {
      "label": "Màu công tắc khi bật",
      "desc": "Màu của nút công tắc tròn khi ở trạng thái kích hoạt."
    },
    "uiSwitchOffColor": {
      "label": "Màu công tắc khi tắt",
      "desc": "Màu của nút công tắc tròn khi ở trạng thái tắt/không kích hoạt."
    },
    "uiAccentColor": {
      "label": "Màu viền nổi bật (Hover)",
      "desc": "Màu viền và hiệu ứng phát sáng khi di chuột (hover) hoặc focus vào cấu hình."
    },
    "uiButtonBgColor": {
      "label": "Nền nút bấm cửa sổ",
      "desc": "Màu nền của các nút hành động trong cửa sổ modal."
    },
    "uiButtonTextColor": {
      "label": "Chữ trên nút bấm cửa sổ",
      "desc": "Màu chữ hoặc biểu tượng của các nút hành động trong cửa sổ modal."
    },
    "uiFabBgColor": {
      "label": "Nền nút thao tác nhanh",
      "desc": "Màu nền của các nút thao tác nhanh (nút nổi trong trình phát nhạc)."
    },
    "uiFabIconColor": {
      "label": "Biểu tượng nút thao tác nhanh",
      "desc": "Màu biểu tượng của các nút thao tác nhanh trong trình phát nhạc."
    },
    "providerTokenPlaceholder": "Dán token nguồn nhạc vào đây",
    "corsProxyDesc": "Dùng để vượt lỗi CORS. Thay URL bằng server proxy của bạn. <code>{url}</code> là link gốc.",
    "corsProxyDefault": "Spotify sẽ reload sau khi lưu. Để trống để về mặc định: <code>https://cors-proxy.spicetify.app/{url}</code>",
    "activeColor": {
      "label": "Màu lời nhạc đang phát",
      "desc": "Màu sắc của dòng lời nhạc hiện tại đang chạy."
    },
    "inactiveColor": {
      "label": "Màu lời nhạc chờ",
      "desc": "Màu sắc của các dòng lời nhạc chưa hoặc đã phát qua."
    },
    "highlightColor": {
      "label": "Màu sắc nổi bật (Accent)",
      "desc": "Màu sắc làm điểm nhấn cho các nút và thành phần UI chính."
    },
    "usingThemeColor": "Dùng màu mặc định của Theme",
    "checkForUpdates": "Kiểm tra cập nhật",
    "updateAppSubtitle": "Dịch lời bài hát AI & Video nền"
  },
  "buttons": {
    "clearCache": "Xóa Cache đã lưu",
    "noCache": "Không có cache",
    "refreshToken": "Làm mới Token",
    "refreshingToken": "Đang làm mới...",
    "tokenRefreshed": "Đã làm mới Token",
    "tooManyAttempts": "Quá nhiều lần thử",
    "failedRefreshToken": "Làm mới thất bại",
    "resetToTheme": "Đặt lại về Theme"
  },
  "notifications": {
    "translatedIn": "Dịch xong trong {duration}",
    "reTranslating": "Đang dịch lại…",
    "cacheClearedShort": "Đã xóa cache dịch",
    "settingsChanged": "Cài đặt thay đổi, đang tải lại...",
    "autoCached": "Đã cache ({lines} dòng)",
    "translationFailed": "Dịch thất bại",
    "geminiKeyMissing": "Thiếu LLM API Key. Vui lòng kiểm tra Settings.",
    "noLyricsToTranslate": "Không có lời để dịch.",
    "emptyResult": "AI trả về rỗng.",
    "lineCountMismatch": "Lỗi số dòng! Kì vọng: {expected}, Thực tế: {got}",
    "noTrack": "Không có bài hát đang phát",
    "invalidId": "Video ID không hợp lệ",
    "videoSet": "Đã chọn Video: {videoId}",
    "videoSynced": "Đã đồng bộ: {videoId} (offset: {offset}s)",
    "syncFailed": "Đồng bộ video thất bại",
    "syncError": "Lỗi khi đồng bộ video",
    "videoReset": "Video reset - đang tải lại...",
    "noLyricsCache": "Không có lời để lưu (Cache)",
    "cacheDeleted": "Đã xóa cache lời bài hát",
    "cacheSuccess": "Đã lưu cache lời bài hát thành công",
    "copied": "Đã sao chép: {text}",
    "neteaseNoSynced": "Không có synced lyrics cho bài này.",
    "neteaseLyricsLoaded": "Đã tải lyrics: {songName}",
    "lyricsCopied": "Đã sao chép lời bài hát vào clipboard",
    "lyricsCopyFailed": "Sao chép lời bài hát thất bại",
    "invalidClipboardUrl": "Clipboard không chứa liên kết hoặc ID YouTube hợp lệ",
    "failedReadClipboard": "Không thể đọc clipboard. Vui lòng dán thủ công.",
    "videoSetSaved": "Đã chọn Video: {videoId} (đã lưu)",
    "translationFailedWithReason": "{mode} thất bại: {reason}",
    "languageOverrideReset": "Ghi đè Ngôn ngữ được đặt lại thành 'Tắt' cho chế độ AI",
    "stillConverting": "Vẫn đang chuyển đổi...",
    "pinyinLibraryUnavailable": "Thư viện Pinyin không khả dụng. Đang hiển thị bản gốc. Cho phép jsDelivr hoặc unpkg.",
    "conversionSkippedAlreadySimplified": "Bỏ qua chuyển đổi: Đã ở dạng tiếng Trung giản thể",
    "conversionFailed": "Chuyển đổi thất bại: {error}",
    "fileTooLarge": "File quá lớn: Dung lượng tối đa là 1MB",
    "noLyricsInFile": "Không tìm thấy lời bài hát hợp lệ trong file",
    "loadedLyricsFromFile": "Đã tải lời bài hát {types} từ file",
    "failedLoadLyricsInvalidFormat": "Tải lời bài hát thất bại: Định dạng file không hợp lệ",
    "failedReadFileCorrupted": "Đọc file thất bại: File có thể bị hỏng",
    "installCommandCopied": "Đã sao chép lệnh cài đặt! Dán vào PowerShell",
    "updateSkipped": "Đã bỏ qua cập nhật",
    "updateAvailable": "Lyrics Plus v{version} đã có sẵn! Bấm để cập nhật",
    "upToDate": "Bạn đang sử dụng phiên bản mới nhất (v{version})!"
  },
  "contextMenu": {
    "provider": "Nguồn dịch",
    "display": "Kiểu hiển thị",
    "targetLanguage": "Ngôn ngữ dịch",
    "style": "Văn phong",
    "pronoun": "Xưng hô",
    "langOverride": "Ghi đè Ngôn ngữ",
    "displayMode": "Chế độ hiển thị",
    "displayMode2": "Chế độ hiển thị 2",
    "langInfo": "Tùy chọn theo ngôn ngữ",
    "langInfoText": "Chưa phát hiện ngôn ngữ",
    "langInfoHelp": "Các tùy chọn hiển thị sẽ xuất hiện khi phát hiện ngôn ngữ CJK (Nhật, Hàn, Trung). Bạn có thể dùng 'Language Override' ở trên để chọn thủ công.",
    "adjustments": "Tinh chỉnh",
    "fontSize": "Cỡ chữ",
    "lyricPos": "Vị trí lời",
    "trackDelay": "Chỉnh delay bài hát",
    "preTrans": "Dịch trước",
    "uAutoScroll": "Unsynced: Tự động cuộn",
    "conversions": "Chuyển đổi",
    "translationDisplay": {
      "replace": "Thay thế lời gốc",
      "below": "Dưới lời gốc"
    },
    "language": {
      "off": "Tắt",
      "zhHans": "Tiếng Trung (Giản thể)",
      "zhHant": "Tiếng Trung (Phồn thể)",
      "ja": "Tiếng Nhật",
      "ko": "Tiếng Hàn"
    },
    "modeBase": {
      "none": "Không"
    },
    "geminiModes": {
      "romaji": "Romaji, Romaja, Pinyin (AI)",
      "vi": "Tiếng Việt (AI)",
      "furigana": "Furigana (AI)"
    },
    "styles": {
      "smart_adaptive": "Tự động (Đề xuất)",
      "poetic_standard": "Thơ & Lãng mạn",
      "youth_story": "Tuổi trẻ & Tự sự (Anime/Indie)",
      "street_bold": "Mạnh mẽ & Bụi bặm (Rap/Rock)",
      "vintage_classic": "Cổ điển (Nhạc xưa)",
      "literal_study": "Dịch sát nghĩa (Học ngôn ngữ)"
    },
    "pronouns": {
      "default": "Tự động (Dựa theo nội dung)",
      "anh_em": "Anh - Em",
      "em_anh": "Em - Anh",
      "to_cau": "Tớ - Cậu",
      "minh_ban": "Tôi - Cậu",
      "toi_ban": "Tôi - Bạn",
      "toi_em": "Tôi - Em",
      "ta_nguoi": "Ta - Người",
      "tao_may": "Tao - Mày"
    }
  },
  "tooltips": {
    "conversion": "Chuyển đổi",
    "adjustments": "Tinh chỉnh",
    "videoSettings": "Cài đặt Video",
    "cacheLyrics": "Lưu Cache Lời",
    "lyricsCached": "Đã lưu Cache",
    "loadFile": "Nhập file local (.lrc)",
    "resetCache": "Làm mới lời dịch / phiên âm",
    "reloadMode": "Làm mới {mode}",
    "reloadAll": "Làm mới cả hai",
    "modeTranslation": "Bản dịch {lang}",
    "openSettings": "Mở Cài đặt",
    "preTransNext": "Bài tiếp theo đã được dịch trước",
    "preTranslateChip": "AI đang dịch sẵn bài tiếp theo (nền)",
    "copy": "Sao chép",
    "searchYoutube": "Tìm kiếm trên YouTube",
    "searchNetease": "Tìm Lyrics trên NetEase",
    "manualSearch": "Tìm kiếm lời thủ công",
    "viewReasoning": "Xem quá trình suy nghĩ"
  },
  "providers": {
    "local": { "name": "local", "desc": "Cung cấp lời bài hát từ cache/tệp cục bộ đã tải ở các phiên Spotify trước." },
    "musixmatch": { "name": "musixmatch", "desc": "Tương thích đầy đủ với Spotify. Cần token từ ứng dụng Musixmatch chính thức. Nếu lỗi tải lời, hãy bấm <code>Refresh token</code>. Có thể cần CORS proxy." },
    "lrclib": { "name": "lrclib", "desc": "Lời bài hát từ lrclib.net. Hỗ trợ cả synced và unsynced, miễn phí và mã nguồn mở." },
    "spotify": { "name": "spotify", "desc": "Lời bài hát từ Spotify API chính thức." },
    "netease": { "name": "NetEase", "desc": "Lời bài hát từ NetEase Cloud Music. Phủ sóng tốt cho các nghệ sĩ Indie JP/KR/CN. Tùy chọn: Cookie phiên bản web (music.163.com) có thể cải thiện kết quả." }
  },
  "videoModal": {
    "title": "Video Background",
    "topVideos": "Top Video Phù hợp",
    "searchQuery": "Từ khóa tìm kiếm:",
    "search": "Tìm kiếm",
    "inputId": "YouTube Video ID hoặc URL:",
    "placeholder": "Ví dụ: dQw4w9WgXcQ hoặc https://youtube.com/...",
    "totalOffset": "Điều chỉnh Offset:",
    "apply": "Áp dụng",
    "reset": "Reset/Reload",
    "manualVideo": "Video Thủ công",
    "score": "Độ khớp",
    "detectedId": "ID tìm thấy",
    "currentVideo": "Video hiện tại",
    "pasteCopied": "Dán liên kết đã sao chép:",
    "paste": "Dán từ clipboard",
    "noResults": "Không tìm thấy video phù hợp.",
    "change": "Thay đổi",
    "remove": "Xóa",
    "enterManual": "Nhập ID/URL thủ công",
    "save": "Lưu",
    "searchYoutubeLink": "← Tìm kiếm trên YouTube",
    "active": "Hoạt động",
    "done": "Xong",
    "backToSync": "← Quay lại đồng bộ",
    "unsynced": "chưa đồng bộ",
    "syncHint": "Kéo thanh trượt để đồng bộ: giá trị âm phát video sớm hơn, giá trị dương phát muộn hơn.",
    "searchPlaceholder": "Nhập tên video để tìm...",
    "aiSuggestions": "Gợi ý phiên âm CJK:"
  },
  "modal": {
    "title": "Cài đặt Lyrics Plus"
  },
  "neteaseModal": {
    "title": "Tìm kiếm NetEase",
    "placeholder": "Tìm theo tên gốc (kanji, hangul, romaji...)",
    "search": "Tìm",
    "failed": "Tìm kiếm thất bại",
    "noResults": "Không tìm thấy kết quả. Thử tìm bằng tên gốc hoặc romaji."
  },
  "manualSearchModal": {
    "title": "Tìm kiếm Lời bài hát Thủ công",
    "placeholder": "Tìm theo tên bài hát, nghệ sĩ hoặc romaji...",
    "search": "Tìm",
    "all": "Tất cả",
    "searching": "Đang tìm kiếm trên các nguồn…",
    "failed": "Tìm kiếm thất bại",
    "noResults": "Không tìm thấy kết quả nào từ các nguồn. Hãy thử tìm bằng tên gốc hoặc romaji.",
    "cjkSuggestions": "Gợi ý phiên âm CJK:",
    "lyricsLoaded": "Đã tải lời bài hát từ {provider}: {songName}"
  },
  "updateModal": {
    "title": "Cập Nhật Lyrics Plus Mới",
    "currentVersion": "Phiên bản hiện tại: v{version}",
    "quickUpdate": "Cập nhật nhanh (Khuyên dùng)",
    "quickUpdateDesc": "Chạy lệnh sau trong PowerShell để cập nhật tự động:",
    "copyCommand": "Sao chép lệnh cài đặt",
    "changelog": "Xem Chi Tiết",
    "skipVersion": "Bỏ Qua Bản Này",
    "later": "Để Sau"
  }
};

window.LANG_VI.fullscreen = {
  "nowPlaying": "Đang phát",
  "lyrics": "Hiện hoặc ẩn lời nhạc",
  "favorite": "Yêu thích",
  "settings": "Cài đặt",
  "exit": "Thoát toàn màn hình",
  "shuffle": "Phát ngẫu nhiên",
  "previous": "Bài trước",
  "next": "Bài tiếp theo",
  "repeat": "Lặp bài",
  "pause": "Tạm dừng",
  "play": "Phát",
  "volume": "Âm lượng Spotify",
  "seek": "Tua bài",
  "nothingPlaying": "Chưa có bài đang phát",
  "off": "Tắt"
};
window.LANG_VI.appearance = {
  "font-weight": "Độ đậm lời chính",
  "translation-font": "Font bản dịch",
  "translation-scale": "Cỡ bản dịch (%)",
  "translation-weight": "Độ đậm bản dịch",
  "phonetic-font": "Font phiên âm",
  "phonetic-scale": "Cỡ phiên âm (%)",
  "line-spacing": "Giãn dòng",
  "lyrics-width": "Chiều rộng lời nhạc (%)",
  "inactive-opacity": "Độ rõ dòng chưa hát",
  "motion-speed": "Thời gian chuyển động (%)",
  "active-scale": "Phóng dòng đang hát",
  "text-shadow": "Bóng chữ",
  "reduced-motion": "Giảm chuyển động",
  "word-highlight": "Sáng từng từ có timing",
  "album-art-blur": "Độ mờ ảnh bìa (px)",
  "album-art-brightness": "Độ sáng ảnh bìa (%)",
  "album-art-zoom": "Phóng ảnh bìa",
  "background-transition": "Thời gian chuyển nền (ms)",
  "localFont": "Dùng font đã cài trên máy. Để trống để theo font chính.",
  "preset": "Chọn preset",
  "presetName": "Tên preset của bạn",
  "save": "Lưu",
  "reset": "Mặc định giao diện",
  "calm": "Dịu",
  "cinema": "Điện ảnh",
  "karaoke": "Karaoke",
  "preview": "Xem trước trực tiếp",
  "previewBefore": "Dòng vừa hát lùi về phía sau",
  "previewAfter": "Dòng tiếp theo chờ đến lượt"
};
Object.assign(window.LANG_VI.settings, {
  "videoAdAlbumArt": {
    "label": "Dùng ảnh bìa khi video có quảng cáo",
    "desc": "Ẩn quảng cáo YouTube bằng ảnh bìa đến khi quảng cáo hết. Tắt để hiển thị quảng cáo. Video nền luôn tắt tiếng."
  },
  "videoAdNotice": {
    "label": "Thời gian thông báo quảng cáo"
  },
  "videoAdStall": {
    "label": "Thử lại khi quảng cáo kẹt (giây)",
    "desc": "Chỉ tải lại khi quảng cáo ngừng tiến triển hoặc lặp nhiều lần. Tối đa hai lần; quảng cáo dài bình thường vẫn chạy."
  }
});
Object.assign(window.LANG_VI.notifications, {
  "videoAdCover": "Video đang có quảng cáo. Tạm dùng ảnh bìa album đến khi quảng cáo hết.",
  "videoAdFailed": "Quảng cáo vẫn bị kẹt sau hai lần tải lại. Ảnh bìa tiếp tục hiển thị nếu đã bật."
});

window.LANG_VI.notifications.standaloneUpdates = "Bản standalone không hỗ trợ cập nhật tự động. Cài bản mới thủ công theo README.";
