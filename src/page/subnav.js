export default function subnav() {
    return `
    <div class="container">
        <nav class="button-grid">
            <a href="/financial-knowledge" class="button-item">
                <i class="fas fa-cog button-icon"></i>
                <div class="button-content">
                    <div class="button-title">금융상식</div>
                    <div class="button-description">Configure your preferences</div>
                </div>
            </a>
            <a href="/tax-calculation" class="button-item">
                <i class="fas fa-user button-icon"></i>
                <div class="button-content">
                    <div class="button-title">종합소득세 계산</div>
                    <div class="button-description">View and edit your profile</div>
                </div>
            </a>
            <a href="/login-signup" class="button-item">
                <i class="fas fa-user button-icon"></i>
                <div class="button-content">
                    <div class="button-title">접속 / 가입</div>
                    <div class="button-description">View and edit your profile</div>
                </div>
            </a>
            <a href="/library" class="button-item">
                <i class="fas fa-user button-icon"></i>
                <div class="button-content">
                    <div class="button-title">독서관</div>
                    <div class="button-description">View and edit your profile</div>
                </div>
            </a>
            <a href="/recommended-materials" class="button-item">
                <i class="fas fa-user button-icon"></i>
                <div class="button-content">
                    <div class="button-title">추천 자료</div>
                    <div class="button-description">View and edit your profile</div>
                </div>
            </a>
            <a href="/discussion-board" class="button-item">
                <i class="fas fa-user button-icon"></i>
                <div class="button-content">
                    <div class="button-title">이야기 마당</div>
                    <div class="button-description">View and edit your profile</div>
                </div>
            </a>
            <a href="/notices" class="button-item">
                <i class="fas fa-user button-icon"></i>
                <div class="button-content">
                    <div class="button-title">공지사항</div>
                    <div class="button-description">View and edit your profile</div>
                </div>
            </a>
        </nav>
    </div>
    `;
}
