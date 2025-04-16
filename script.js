// Inisialisasi data
let posts = JSON.parse(localStorage.getItem('posts')) || [];
let users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = localStorage.getItem('currentUser') || null;
let displayedPosts = 10;
let reports = JSON.parse(localStorage.getItem('reports')) || [];
let currentArticleId = null;

// Simulasi real-time dengan polling
setInterval(() => {
    try {
        const newPosts = JSON.parse(localStorage.getItem('posts')) || [];
        if (JSON.stringify(newPosts) !== JSON.stringify(posts)) {
            posts = newPosts;
            if (document.getElementById('homePage').style.display !== 'none') {
                renderPosts();
            }
        }
    } catch (e) {
        logError('Error polling posts: ' + e.message);
    }
}, 5000);

// Fungsi untuk menyimpan data
function savePosts() {
    try {
        localStorage.setItem('posts', JSON.stringify(posts));
    } catch (e) {
        logError('Error saving posts: ' + e.message);
    }
}

function saveUsers() {
    try {
        localStorage.setItem('users', JSON.stringify(users));
    } catch (e) {
        logError('Error saving users: ' + e.message);
    }
}

function saveReports() {
    try {
        localStorage.setItem('reports', JSON.stringify(reports));
    } catch (e) {
        logError('Error saving reports: ' + e.message);
    }
}

// Sanitasi input
function sanitizeInput(input) {
    try {
        return DOMPurify.sanitize(input);
    } catch (e) {
        logError('Error sanitizing input: ' + e.message);
        return input;
    }
}

// Fungsi untuk modal gambar
function openImageModal(src) {
    try {
        const modal = new bootstrap.Modal(document.getElementById('imageModal'));
        document.getElementById('modalImage').src = src;
        modal.show();
    } catch (e) {
        logError('Error opening image modal: ' + e.message);
    }
}

// Fungsi untuk menutup navbar setelah navigasi (Bootstrap)
function closeNavbar() {
    try {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
        }
    } catch (e) {
        logError('Error closing navbar: ' + e.message);
    }
}

// Navigasi halaman
function showHome() {
    try {
        document.getElementById('homePage').style.display = 'block';
        document.getElementById('articlePage').style.display = 'none';
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('profilePage').style.display = 'none';
        document.getElementById('logoutBtn').style.display = currentUser ? 'inline' : 'none';
        renderPosts();
        closeNavbar();
    } catch (e) {
        logError('Error showing home: ' + e.message);
    }
}

function showProfile() {
    if (!currentUser) {
        showLogin();
        return;
    }
    try {
        document.getElementById('homePage').style.display = 'none';
        document.getElementById('articlePage').style.display = 'none';
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('profilePage').style.display = 'block';
        document.getElementById('logoutBtn').style.display = 'inline';
        renderProfile();
        closeNavbar();
    } catch (e) {
        logError('Error showing profile: ' + e.message);
    }
}

function showLogin() {
    try {
        document.getElementById('homePage').style.display = 'none';
        document.getElementById('articlePage').style.display = 'none';
        document.getElementById('loginPage').style.display = 'block';
        document.getElementById('profilePage').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'none';
        closeNavbar();
    } catch (e) {
        logError('Error showing login: ' + e.message);
    }
}

function showArticle(postId) {
    try {
        currentArticleId = postId;
        document.getElementById('homePage').style.display = 'none';
        document.getElementById('articlePage').style.display = 'block';
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('profilePage').style.display = 'none';
        document.getElementById('logoutBtn').style.display = currentUser ? 'inline' : 'none';
        renderArticle(postId);
        closeNavbar();
    } catch (e) {
        logError('Error showing article: ' + e.message);
    }
}

// Fungsi login
function login() {
    try {
        const username = sanitizeInput(document.getElementById('username').value);
        const password = document.getElementById('password').value;

        if (!username || !password) {
            alert('Username dan password wajib diisi!');
            return;
        }

        if (users[username] && users[username].password === password) {
            currentUser = username;
            localStorage.setItem('currentUser', username);
            showHome();
            document.getElementById('logoutBtn').style.display = 'inline';
            document.body.className = users[currentUser]?.theme || 'neo-brutalism';
        } else {
            alert('Username atau password salah!');
            logError('Login failed for username: ' + username);
        }
    } catch (e) {
        logError('Error during login: ' + e.message);
        alert('Terjadi kesalahan saat login!');
    }
}

// Fungsi daftar
function register() {
    try {
        const username = sanitizeInput(document.getElementById('username').value);
        const password = document.getElementById('password').value;
        const avatarInput = document.getElementById('avatar');

        if (!username || !password) {
            alert('Username dan password wajib diisi!');
            return;
        }

        if (users[username]) {
            alert('Username sudah terdaftar!');
            return;
        }

        let avatarUrl = '';
        if (avatarInput.files && avatarInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                avatarUrl = e.target.result;
                users[username] = {
                    password,
                    avatar: avatarUrl,
                    bio: 'Penulis aktif di Neo Blog.',
                    joinDate: new Date().toISOString(),
                    postCount: 0,
                    followers: [],
                    following: [],
                    isAdmin: false,
                    drafts: [],
                    theme: 'neo-brutalism'
                };
                saveUsers();
                alert('Pendaftaran berhasil! Silakan login.');
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
                document.getElementById('avatar').value = '';
            };
            reader.readAsDataURL(avatarInput.files[0]);
        } else {
            users[username] = {
                password,
                avatar: '',
                bio: 'Penulis aktif di Neo Blog.',
                joinDate: new Date().toISOString(),
                postCount: 0,
                followers: [],
                following: [],
                isAdmin: false,
                drafts: [],
                theme: 'neo-brutalism'
            };
            saveUsers();
            alert('Pendaftaran berhasil! Silakan login.');
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('avatar').value = '';
        }
    } catch (e) {
        logError('Error during register: ' + e.message);
        alert('Terjadi kesalahan saat mendaftar!');
    }
}

// Fungsi logout
function logout() {
    try {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showLogin();
        closeNavbar();
    } catch (e) {
        logError('Error during logout: ' + e.message);
    }
}

// Fungsi untuk membuat postingan
function createPost() {
    if (!currentUser) {
        showLogin();
        return;
    }

    try {
        const title = sanitizeInput(document.getElementById('postTitle').value.trim());
        const content = sanitizeInput(document.getElementById('postContent').value.trim());
        const category = document.getElementById('postCategory').value;
        const imageInput = document.getElementById('postImage');

        if (!title || !content) {
            alert('Judul dan isi postingan wajib diisi!');
            return;
        }

        let post = {
            id: Date.now(),
            title,
            content,
            category,
            image: '',
            author: currentUser,
            date: new Date().toISOString(),
            reactions: { like: {}, love: {} },
            comments: []
        };

        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                post.image = e.target.result;
                posts.unshift(post);
                users[currentUser].postCount = (users[currentUser].postCount || 0) + 1;
                savePosts();
                saveUsers();
                alert('Postingan berhasil dibuat!');
                resetForm();
                showHome();
            };
            reader.onerror = function(e) {
                logError('Error reading image: ' + e.message);
                alert('Gagal mengunggah gambar!');
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            posts.unshift(post);
            users[currentUser].postCount = (users[currentUser].postCount || 0) + 1;
            savePosts();
            saveUsers();
            alert('Postingan berhasil dibuat!');
            resetForm();
            showHome();
        }
    } catch (e) {
        logError('Error creating post: ' + e.message);
        alert('Terjadi kesalahan saat membuat postingan!');
    }
}

// Fungsi untuk menyimpan draf
function saveDraft() {
    if (!currentUser) {
        showLogin();
        return;
    }

    try {
        const title = sanitizeInput(document.getElementById('postTitle').value.trim());
        const content = sanitizeInput(document.getElementById('postContent').value.trim());
        const category = document.getElementById('postCategory').value;

        users[currentUser].drafts = users[currentUser].drafts || [];
        users[currentUser].drafts.push({ id: Date.now(), title, content, category });
        saveUsers();
        alert('Draf disimpan!');
        resetForm();
    } catch (e) {
        logError('Error saving draft: ' + e.message);
        alert('Terjadi kesalahan saat menyimpan draf!');
    }
}

// Fungsi untuk mempublikasikan draf
function publishDraft(draftId) {
    try {
        const draft = users[currentUser].drafts.find(d => d.id === draftId);
        if (!draft) {
            alert('Draf tidak ditemukan!');
            return;
        }

        const post = {
            id: Date.now(),
            title: draft.title,
            content: draft.content,
            category: draft.category,
            image: '',
            author: currentUser,
            date: new Date().toISOString(),
            reactions: { like: {}, love: {} },
            comments: []
        };
        posts.unshift(post);
        users[currentUser].postCount = (users[currentUser].postCount || 0) + 1;
        users[currentUser].drafts = users[currentUser].drafts.filter(d => d.id !== draftId);
        savePosts();
        saveUsers();
        alert('Draf dipublikasikan!');
        renderProfile();
    } catch (e) {
        logError('Error publishing draft: ' + e.message);
        alert('Terjadi kesalahan saat mempublikasikan draf!');
    }
}

// Fungsi untuk mereset form
function resetForm() {
    try {
        document.getElementById('postTitle').value = '';
        document.getElementById('postContent').value = '';
        document.getElementById('postImage').value = '';
        document.getElementById('postCategory').value = 'Umum';
    } catch (e) {
        logError('Error resetting form: ' + e.message);
    }
}

// Fungsi untuk edit dan hapus postingan
function editPost(postId) {
    try {
        const post = posts.find(p => p.id === postId);
        if (!post) {
            alert('Postingan tidak ditemukan!');
            return;
        }
        if (post.author !== currentUser) {
            alert('Hanya pembuat postingan yang dapat mengedit!');
            return;
        }
        const newTitle = sanitizeInput(prompt('Masukkan judul baru:', post.title));
        const newContent = sanitizeInput(prompt('Masukkan isi baru:', post.content));
        if (newTitle && newContent) {
            post.title = newTitle;
            post.content = newContent;
            savePosts();
            if (currentArticleId === postId) {
                renderArticle(postId);
            } else {
                renderPosts();
            }
            alert('Postingan berhasil diedit!');
        }
    } catch (e) {
        logError('Error editing post: ' + e.message);
        alert('Terjadi kesalahan saat mengedit postingan!');
    }
}

function deletePost(postId) {
    try {
        const post = posts.find(p => p.id === postId);
        if (!post) {
            alert('Postingan tidak ditemukan!');
            return;
        }
        if (post.author !== currentUser && !users[currentUser].isAdmin) {
            alert('Hanya pembuat postingan atau admin yang dapat menghapus!');
            return;
        }
        if (confirm('Hapus postingan ini?')) {
            posts = posts.filter(p => p.id !== postId);
            users[post.author].postCount = (users[post.author].postCount || 1) - 1;
            savePosts();
            saveUsers();
            if (currentArticleId === postId) {
                showHome();
            } else {
                renderPosts();
            }
            alert('Postingan dihapus!');
        }
    } catch (e) {
        logError('Error deleting post: ' + e.message);
        alert('Terjadi kesalahan saat menghapus postingan!');
    }
}

// Fungsi untuk toggle reaksi
function toggleReaction(postId, type) {
    if (!currentUser) {
        showLogin();
        return;
    }
    try {
        const post = posts.find(p => p.id === postId);
        if (!post) {
            alert('Postingan tidak ditemukan!');
            return;
        }
        if (post.reactions[type][currentUser]) {
            delete post.reactions[type][currentUser];
        } else {
            post.reactions[type][currentUser] = true;
            if (type === 'like') delete post.reactions.love[currentUser];
            else if (type === 'love') delete post.reactions.like[currentUser];
        }
        savePosts();
        if (currentArticleId === postId) {
            renderArticle(postId);
        } else {
            renderPosts();
        }
    } catch (e) {
        logError('Error toggling reaction: ' + e.message);
        alert('Terjadi kesalahan saat memberikan reaksi!');
    }
}

// Fungsi untuk menambah komentar
function addComment() {
    if (!currentUser) {
        showLogin();
        return;
    }
    try {
        const content = sanitizeInput(document.getElementById('commentInput').value.trim());
        if (!content) {
            alert('Komentar tidak boleh kosong!');
            return;
        }

        const post = posts.find(p => p.id === currentArticleId);
        if (!post) {
            alert('Postingan tidak ditemukan!');
            return;
        }
        post.comments.push({
            id: Date.now(),
            content,
            author: currentUser,
            reactions: { like: {} },
            replies: []
        });
        savePosts();
        alert('Komentar ditambahkan!');
        renderArticle(currentArticleId);
        document.getElementById('commentInput').value = '';
    } catch (e) {
        logError('Error adding comment: ' + e.message);
        alert('Terjadi kesalahan saat menambahkan komentar!');
    }
}

// Fungsi untuk edit dan hapus komentar
function editComment(postId, commentId) {
    try {
        const post = posts.find(p => p.id === postId);
        if (!post) {
            alert('Postingan tidak ditemukan!');
            return;
        }
        const comment = post.comments.find(c => c.id === commentId);
        if (!comment) {
            alert('Komentar tidak ditemukan!');
            return;
        }
        if (comment.author !== currentUser) {
            alert('Hanya pembuat komentar yang dapat mengedit!');
            return;
        }
        const newContent = sanitizeInput(prompt('Masukkan komentar baru:', comment.content));
        if (newContent) {
            comment.content = newContent;
            savePosts();
            renderArticle(postId);
            alert('Komentar berhasil diedit!');
        }
    } catch (e) {
        logError('Error editing comment: ' + e.message);
        alert('Terjadi kesalahan saat mengedit komentar!');
    }
}

function deleteComment(postId, commentId) {
    try {
        const post = posts.find(p => p.id === postId);
        if (!post) {
            alert('Postingan tidak ditemukan!');
            return;
        }
        const comment = post.comments.find(c => c.id === commentId);
        if (!comment) {
            alert('Komentar tidak ditemukan!');
            return;
        }
        if (comment.author !== currentUser) {
            alert('Hanya pembuat komentar yang dapat menghapus!');
            return;
        }
        if (confirm('Hapus komentar ini?')) {
            post.comments = post.comments.filter(c => c.id !== commentId);
            savePosts();
            renderArticle(postId);
            alert('Komentar dihapus!');
        }
    } catch (e) {
        logError('Error deleting comment: ' + e.message);
        alert('Terjadi kesalahan saat menghapus komentar!');
    }
}

// Fungsi untuk toggle reaksi komentar
function toggleCommentReaction(postId, commentId) {
    if (!currentUser) {
        showLogin();
        return;
    }
    try {
        const post = posts.find(p => p.id === postId);
        if (!post) {
            alert('Postingan tidak ditemukan!');
            return;
        }
        const comment = post.comments.find(c => c.id === commentId);
        if (!comment) {
            alert('Komentar tidak ditemukan!');
            return;
        }
        if (comment.reactions.like[currentUser]) {
            delete comment.reactions.like[currentUser];
        } else {
            comment.reactions.like[currentUser] = true;
        }
        savePosts();
        renderArticle(postId);
    } catch (e) {
        logError('Error toggling comment reaction: ' + e.message);
        alert('Terjadi kesalahan saat memberikan reaksi komentar!');
    }
}

// Fungsi untuk menambah balasan
function addReply(postId, commentId) {
    if (!currentUser) {
        showLogin();
        return;
    }
    try {
        const replyInput = sanitizeInput(document.getElementById(`reply-${commentId}`).value.trim());
        if (!replyInput) {
            alert('Balasan tidak boleh kosong!');
            return;
        }

        const post = posts.find(p => p.id === postId);
        if (!post) {
            alert('Postingan tidak ditemukan!');
            return;
        }
        const comment = post.comments.find(c => c.id === commentId);
        if (!comment) {
            alert('Komentar tidak ditemukan!');
            return;
        }
        comment.replies.push({
            id: Date.now(),
            content: replyInput,
            author: currentUser
        });
        savePosts();
        alert('Balasan ditambahkan!');
        renderArticle(postId);
        document.getElementById(`reply-${commentId}`).value = '';
    } catch (e) {
        logError('Error adding reply: ' + e.message);
        alert('Terjadi kesalahan saat menambahkan balasan!');
    }
}

// Fungsi untuk mencari postingan
function searchPosts() {
    try {
        const query = sanitizeInput(document.getElementById('searchInput').value.toLowerCase().trim());
        displayedPosts = 10;
        renderPosts(query);
    } catch (e) {
        logError('Error searching posts: ' + e.message);
        alert('Terjadi kesalahan saat mencari postingan!');
    }
}

// Fungsi untuk lazy loading
function loadMorePosts() {
    try {
        displayedPosts += 10;
        renderPosts();
    } catch (e) {
        logError('Error loading more posts: ' + e.message);
        alert('Terjadi kesalahan saat memuat lebih banyak postingan!');
    }
}

function loadPrevArticle() {
    try {
        const currentIndex = posts.findIndex(p => p.id === currentArticleId);
        if (currentIndex < posts.length - 1) {
            showArticle(posts[currentIndex + 1].id);
        }
    } catch (e) {
        logError('Error loading previous article: ' + e.message);
    }
}

function loadNextArticle() {
    try {
        const currentIndex = posts.findIndex(p => p.id === currentArticleId);
        if (currentIndex > 0) {
            showArticle(posts[currentIndex - 1].id);
        }
    } catch (e) {
        logError('Error loading next article: ' + e.message);
    }
}

// Fungsi untuk profil
function renderProfile() {
    try {
        const user = users[currentUser];
        if (!user) {
            alert('Data pengguna tidak ditemukan!');
            showLogin();
            return;
        }
        document.getElementById('profileAvatar').src = user.avatar || 'default.jpg';
        document.getElementById('profileUsername').textContent = currentUser;
        document.getElementById('profileJoinDate').textContent = new Date(user.joinDate).toLocaleDateString();
        document.getElementById('profilePostCount').textContent = user.postCount || 0;
        document.getElementById('profileFollowing').textContent = user.following.length;
        document.getElementById('profileFollowers').textContent = user.followers.length;
        document.getElementById('themeSelect').value = user.theme || 'neo-brutalism';

        // Tampilkan draf
        const draftsDiv = document.getElementById('drafts');
        draftsDiv.innerHTML = '<h3>Draf</h3>' + (user.drafts?.length ? user.drafts.map(d => `
            <p>${d.title || 'Tanpa Judul'} 
               <button class="btn btn-custom btn-sm" onclick="publishDraft(${d.id})">Publikasikan</button>
               <button class="btn btn-custom btn-sm" onclick="deleteDraft(${d.id})">Hapus</button>
            </p>
        `).join('') : '<p>Tidak ada draf.</p>');

        // Tampilkan analitik
        const userPosts = posts.filter(p => p.author === currentUser);
        const totalLikes = userPosts.reduce((sum, p) => sum + Object.keys(p.reactions.like).length, 0);
        const totalLoves = userPosts.reduce((sum, p) => sum + Object.keys(p.reactions.love).length, 0);
        const totalComments = userPosts.reduce((sum, p) => sum + p.comments.length, 0);
        document.getElementById('analytics').innerHTML = `
            <h3>Analitik</h3>
            <p>Total Likes: ${totalLikes}</p>
            <p>Total Loves: ${totalLoves}</p>
            <p>Total Komentar: ${totalComments}</p>
        `;

        if (user.isAdmin) {
            document.getElementById('adminDashboard').style.display = 'block';
            const reportsDiv = document.getElementById('reports');
            reportsDiv.innerHTML = reports.map(r => `
                <p>Post ID: ${r.postId}, Reason: ${r.reason} 
                   <button class="btn btn-custom btn-sm" onclick="deletePost(${r.postId})">Hapus Post</button>
                </p>
            `).join('');
        } else {
            document.getElementById('adminDashboard').style.display = 'none';
        }
    } catch (e) {
        logError('Error rendering profile: ' + e.message);
        alert('Terjadi kesalahan saat memuat profil!');
    }
}

function deleteDraft(draftId) {
    try {
        users[currentUser].drafts = users[currentUser].drafts.filter(d => d.id !== draftId);
        saveUsers();
        renderProfile();
        alert('Draf dihapus!');
    } catch (e) {
        logError('Error deleting draft: ' + e.message);
        alert('Terjadi kesalahan saat menghapus draf!');
    }
}

// Fungsi untuk follow
function followUser(targetUser) {
    if (!currentUser || currentUser === targetUser) return;
    try {
        if (!users[currentUser].following.includes(targetUser)) {
            users[currentUser].following.push(targetUser);
            users[targetUser].followers.push(currentUser);
            saveUsers();
            renderPosts();
            if (currentArticleId) renderArticle(currentArticleId);
        }
    } catch (e) {
        logError('Error following user: ' + e.message);
        alert('Terjadi kesalahan saat mengikuti pengguna!');
    }
}

// Fungsi untuk berbagi
function sharePost(postId, platform) {
    try {
        const post = posts.find(p => p.id === postId);
        if (!post) {
            alert('Postingan tidak ditemukan!');
            return;
        }
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`${post.title}: ${post.content}`);
        if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
        } else if (platform === 'whatsapp') {
            window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`);
        }
    } catch (e) {
        logError('Error sharing post: ' + e.message);
        alert('Terjadi kesalahan saat membagikan postingan!');
    }
}

// Fungsi untuk report
function reportPost(postId) {
    if (!currentUser) {
        showLogin();
        return;
    }
    try {
        const reason = sanitizeInput(prompt('Alasan pelaporan:'));
        if (reason) {
            reports.push({ postId, reason, reportedBy: currentUser });
            saveReports();
            alert('Laporan dikirim!');
            if (users[currentUser].isAdmin) renderProfile();
        }
    } catch (e) {
        logError('Error reporting post: ' + e.message);
        alert('Terjadi kesalahan saat melaporkan postingan!');
    }
}

// Fungsi untuk dark mode
function toggleDarkMode() {
    try {
        document.body.classList.toggle('dark-mode');
        if (currentUser) {
            users[currentUser].theme = document.body.classList.contains('dark-mode') ? 'dark' : 'neo-brutalism';
            saveUsers();
        }
        closeNavbar();
    } catch (e) {
        logError('Error toggling dark mode: ' + e.message);
    }
}

// Fungsi untuk tema
function setTheme(theme) {
    try {
        document.body.className = theme;
        if (currentUser) {
            users[currentUser].theme = theme;
            saveUsers();
        }
    } catch (e) {
        logError('Error setting theme: ' + e.message);
    }
}

// Fungsi untuk notifikasi
function subscribeToNotifications() {
    if (!currentUser) {
        showLogin();
        return;
    }
    try {
        alert('Notifikasi diaktifkan! (Simulasi untuk demo)');
    } catch (e) {
        logError('Error subscribing to notifications: ' + e.message);
    }
}

// Fungsi untuk sidebar
function updateSidebar() {
    try {
        const user = users[currentUser] || { avatar: 'default.jpg', bio: 'Penulis aktif di Neo Blog.' };
        document.getElementById('sidebarAvatar').src = user.avatar || 'default.jpg';
        document.getElementById('sidebarBio').textContent = user.bio;

        const popularPosts = posts
            .sort((a, b) => Object.keys(b.reactions.like).length - Object.keys(a.reactions.like).length)
            .slice(0, 3);
        document.getElementById('popularPosts').innerHTML = popularPosts.map(p => `
            <li><a href="#" onclick="showArticle(${p.id})">${p.title}</a></li>
        `).join('');
    } catch (e) {
        logError('Error updating sidebar: ' + e.message);
    }
}

// Fungsi untuk merender postingan
function renderPosts(searchQuery = '') {
    try {
        const postsDiv = document.getElementById('posts');
        if (!postsDiv) {
            logError('Posts container not found!');
            return;
        }
        postsDiv.innerHTML = '';

        let filteredPosts = posts.slice();
        if (searchQuery) {
            filteredPosts = posts.filter(p => 
                (p.title || '').toLowerCase().includes(searchQuery) || 
                (p.content || '').toLowerCase().includes(searchQuery)
            );
        } else if (currentUser && users[currentUser]?.following.length) {
            filteredPosts = posts.filter(p => users[currentUser].following.includes(p.author) || p.author === currentUser);
        }

        if (filteredPosts.length === 0) {
            postsDiv.innerHTML = '<p>Tidak ada postingan untuk ditampilkan.</p>';
            document.getElementById('loadMore').classList.add('d-none');
            updateSidebar();
            return;
        }

        const postsToShow = filteredPosts.slice(0, displayedPosts);
        postsToShow.forEach(post => {
            const excerpt = (post.content || '').length > 100 ? post.content.slice(0, 100) + '...' : post.content;
            const postDiv = document.createElement('div');
            postDiv.className = 'col-md-6 post-card';
            postDiv.innerHTML = `
                ${post.image ? `<img src="${post.image}" alt="Post Image" class="img-fluid mb-3" onclick="openImageModal(this.src)">` : ''}
                <h3>${post.title || 'Tanpa Judul'}</h3>
                <p>${post.date ? new Date(post.date).toLocaleDateString() : 'Tanggal tidak tersedia'}</p>
                <p>${excerpt || 'Konten tidak tersedia'}</p>
                <button class="btn btn-custom" onclick="showArticle(${post.id})">Baca Selengkapnya</button>
            `;
            postsDiv.appendChild(postDiv);
        });

        document.getElementById('loadMore').classList.toggle('d-none', filteredPosts.length <= displayedPosts);
        updateSidebar();
    } catch (e) {
        logError('Error rendering posts: ' + e.message);
        alert('Terjadi kesalahan saat memuat postingan!');
    }
}

// Fungsi untuk merender artikel
function renderArticle(postId) {
    try {
        const post = posts.find(p => p.id === postId);
        if (!post) {
            alert('Postingan tidak ditemukan!');
            showHome();
            return;
        }

        const likeCount = Object.keys(post.reactions.like || {}).length;
        const loveCount = Object.keys(post.reactions.love || {}).length;
        const isFollowing = currentUser && users[currentUser]?.following.includes(post.author);
        document.getElementById('articleContent').innerHTML = `
            <h1>${post.title || 'Tanpa Judul'}</h1>
            <p>${post.date ? new Date(post.date).toLocaleDateString() : 'Tanggal tidak tersedia'}</p>
            <p>Oleh: <img src="${users[post.author]?.avatar || 'default.jpg'}" class="avatar" alt="Avatar ${post.author}" onclick="openImageModal(this.src)"> ${post.author}</p>
            ${post.image ? `<img src="${post.image}" alt="Post Image" class="img-fluid mb-3" onclick="openImageModal(this.src)">` : ''}
            <p>${post.content || 'Konten tidak tersedia'}</p>
            <p>Kategori: ${post.category || 'Umum'}</p>
            ${post.author === currentUser ? `
                <button class="btn btn-custom me-2" onclick="editPost(${post.id})">Edit</button>
                <button class="btn btn-custom" onclick="deletePost(${post.id})">Hapus</button>
            ` : ''}
            ${currentUser && post.author !== currentUser ? `
                <button class="btn btn-custom me-2" onclick="followUser('${post.author}')">${isFollowing ? 'Unfollow' : 'Follow'}</button>
                <button class="btn btn-custom" onclick="reportPost(${post.id})">Report</button>
            ` : ''}
            <div class="reactions mt-3">
                <button class="btn btn-custom me-2 ${currentUser && post.reactions.like[currentUser] ? 'liked' : ''}" 
                        onclick="toggleReaction(${post.id}, 'like')">👍 ${likeCount}</button>
                <button class="btn btn-custom me-2 ${currentUser && post.reactions.love[currentUser] ? 'liked' : ''}" 
                        onclick="toggleReaction(${post.id}, 'love')">❤️ ${loveCount}</button>
                <button class="btn btn-custom me-2" onclick="sharePost(${post.id}, 'twitter')">Share Twitter</button>
                <button class="btn btn-custom" onclick="sharePost(${post.id}, 'whatsapp')">Share WhatsApp</button>
            </div>
        `;

        document.getElementById('comments').innerHTML = (post.comments || []).map(comment => `
            <div class="comment">
                <p><img src="${users[comment.author]?.avatar || 'default.jpg'}" class="avatar" alt="Avatar ${comment.author}" onclick="openImageModal(this.src)"> 
                   <strong>${comment.author}</strong>: ${comment.content}</p>
                <button class="btn btn-custom me-2 ${currentUser && comment.reactions.like[currentUser] ? 'liked' : ''}" 
                        onclick="toggleCommentReaction(${post.id}, ${comment.id})">👍 ${Object.keys(comment.reactions.like).length}</button>
                ${comment.author === currentUser ? `
                    <button class="btn btn-custom me-2" onclick="editComment(${post.id}, ${comment.id})">Edit</button>
                    <button class="btn btn-custom" onclick="deleteComment(${post.id}, ${comment.id})">Hapus</button>
                ` : ''}
                <div class="reply-form mt-2">
                    <textarea id="reply-${comment.id}" class="form-control mb-2" placeholder="Balas komentar..." aria-label="Balas komentar"></textarea>
                    <button class="btn btn-custom" onclick="addReply(${post.id}, ${comment.id})">Balas</button>
                </div>
                <div class="replies">
                    ${(comment.replies || []).map(reply => `
                        <div class="reply">
                            <p><img src="${users[reply.author]?.avatar || 'default.jpg'}" class="avatar" alt="Avatar ${reply.author}" onclick="openImageModal(this.src)"> 
                               <strong>${reply.author}</strong>: ${reply.content}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    } catch (e) {
        logError('Error rendering article: ' + e.message);
        alert('Terjadi kesalahan saat memuat artikel!');
    }
}

// Fungsi untuk scroll ke postingan
function scrollToPosts() {
    document.getElementById('posts').scrollIntoView({ behavior: 'smooth' });
}

// Fungsi untuk log error
function logError(message) {
    console.error(message);
}

// Inisialisasi
// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    if (currentUser) {
        document.getElementById('logoutBtn').style.display = 'inline';
        document.body.className = users[currentUser]?.theme || 'neo-brutalism';
    } else {
        document.getElementById('logoutBtn').style.display = 'none';
    }

    // Setup event listeners
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        login();
    });

    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        register();
    });

    document.getElementById('postForm').addEventListener('submit', (e) => {
        e.preventDefault();
        createPost();
    });

    document.getElementById('searchForm').addEventListener('submit', (e) => {
        e.preventDefault();
        searchPosts();
    });

    document.getElementById('commentForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addComment();
    });

    document.getElementById('themeSelect').addEventListener('change', function() {
        setTheme(this.value);
    });

    // Initialize DOMPurify if available
    if (typeof DOMPurify === 'undefined') {
        console.warn('DOMPurify not loaded. Input sanitization may be limited.');
    }

    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post');
    if (postId) {
        showArticle(parseInt(postId));
    } else {
        showHome();
    }

    // Set up service worker for PWA support
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.error('Service Worker registration failed:', error);
            });
    }

    // Add admin account if not exists (for demo purposes)
    if (!users['admin']) {
        users['admin'] = {
            password: 'admin123',
            avatar: '',
            bio: 'Administrator Neo Blog',
            joinDate: new Date().toISOString(),
            postCount: 0,
            followers: [],
            following: [],
            isAdmin: true,
            drafts: [],
            theme: 'neo-brutalism'
        };
        saveUsers();
    }

    // Add demo posts if none exist
    if (posts.length === 0) {
        const demoPost = {
            id: Date.now(),
            title: 'Selamat Datang di Neo Blog',
            content: 'Blog platform dengan tampilan neo-brutalism untuk menciptakan konten menarik. Silakan daftar dan mulai berbagi ide Anda!',
            category: 'Umum',
            image: '',
            author: 'admin',
            date: new Date().toISOString(),
            reactions: { like: {}, love: {} },
            comments: []
        };
        posts.push(demoPost);
        users['admin'].postCount = 1;
        savePosts();
        saveUsers();
    }

    // Handle browser back button
    window.addEventListener('popstate', function(event) {
        if (currentArticleId) {
            showHome();
        }
    });

    // Update metadata for SEO
    document.querySelector('meta[name="description"]').content = 'Neo Blog - Platform blogging modern dengan tampilan neo-brutalism';

    // Setup offline detection
    window.addEventListener('online', function() {
        document.getElementById('offlineAlert').style.display = 'none';
    });
    
    window.addEventListener('offline', function() {
        document.getElementById('offlineAlert').style.display = 'block';
    });

    // Initialize tooltip and popover from Bootstrap if available
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
        
        const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
        const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
    }

    // Update last visit time
    localStorage.setItem('lastVisit', new Date().toISOString());
});

// Handle lazy loading for images
document.addEventListener('scroll', function() {
    const lazyImages = document.querySelectorAll('img.lazy');
    if (lazyImages.length) {
        lazyImages.forEach(img => {
            if (img.getBoundingClientRect().top <= window.innerHeight && img.getBoundingClientRect().bottom >= 0) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            }
        });
    }
});

// Auto-resize textarea
document.addEventListener('input', function(e) {
    if (e.target.tagName.toLowerCase() === 'textarea') {
        e.target.style.height = 'auto';
        e.target.style.height = (e.target.scrollHeight) + 'px';
    }
});

// Enable keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+Enter to submit forms
    if (e.ctrlKey && e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.form) {
            e.preventDefault();
            activeElement.form.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape' && document.querySelector('.modal.show')) {
        const modal = bootstrap.Modal.getInstance(document.querySelector('.modal.show'));
        if (modal) modal.hide();
    }
});

// Initialize analytics
function initAnalytics() {
    // This would normally connect to an analytics service
    // For demo purposes, we'll just log to console
    console.log('Analytics initialized');
    localStorage.setItem('analyticsId', 'UA-' + Math.floor(Math.random() * 1000000));
}

// Call analytics init
initAnalytics();

// Register custom events for analytics
function trackEvent(category, action, label) {
    console.log(`Analytics: ${category} - ${action} - ${label}`);
    // In a real app, this would send data to an analytics service
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createPost,
        addComment,
        toggleReaction,
        sanitizeInput
    };
}