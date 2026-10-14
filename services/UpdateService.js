// Standalone release: retain the public interface without any update requests.
const UpdateService = {
    REPO_URL: "",
    VERSION_URL: "",
    RAW_BASE_URL: "",
    INSTALL_COMMAND: "",
    CURRENT_VERSION: "1.10.0",
    CHECK_INTERVAL: 1800000,
    async checkForUpdates(silent = false) {
        if (!silent && typeof Spicetify !== "undefined" && Spicetify.showNotification) {
            const message = typeof getText === "function" ? getText("notifications.standaloneUpdates") : "Bản standalone không hỗ trợ cập nhật tự động. Cài bản mới thủ công theo README.";
            Spicetify.showNotification(message, false, 5000);
        }
        return null;
    },
    compareVersions(v1, v2) {
        const parts1 = String(v1 || "0").split('.').map(Number);
        const parts2 = String(v2 || "0").split('.').map(Number);

        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const num1 = parts1[i] || 0;
            const num2 = parts2[i] || 0;
            if (num1 > num2) return 1;
            if (num1 < num2) return -1;
        }
        return 0;
    },

    async copyInstallCommand() {
        await this.checkForUpdates(false);
        return false;
    },
    showUpdateNotification() {
        this.checkForUpdates(false);
    }
};
window.UpdateService = UpdateService;
if (window.LyricsPlus) window.LyricsPlus.UpdateService = UpdateService;
