import { renderAllCategory, renderTopCategoryView } from './category.js';
import { renderTopViewNovel } from './topViewNovel.js';

const access_token = localStorage.getItem("access_token");
const loginSelector = document.querySelector(".login")
const logoutSelector = document.querySelector(".logout-after")
const helloUserSelector = document.querySelector(".hello_user")
const bannerSelector = document.querySelector('.inner-banner');
const tableBodySelector = document.querySelector('.table-body');

const getQueryString = (name) => {
    const search = window.location.search;
    const searchParams = new URLSearchParams(search);
    return searchParams.get(name);
}
const novelId = getQueryString('id');
const getNovel = async (novelId) => {
    const response = await fetch(`http://193.203.160.126:3535/novels/get-list-novel-by-list-id?listNovelId=${novelId}`, {
        method: "GET"
    });
    return response.json(); // Assuming response is JSON
}

const getListChapterOfNovel = async (novelCode) => {
    const response = await fetch(`http://193.203.160.126:3535/novels/get-chapter-in-novel?novelCode=${novelCode}`, {
        method: "GET"
    });
    return response.json(); // Assuming response is JSON
}

const renderNovel = async () => {
    await renderAllCategory();
    await renderTopCategoryView();
    await renderTopViewNovel();


    const novel = (await getNovel(novelId))[0]
    const novelCode = novel.novelCode;
    const listChapter = await getListChapterOfNovel(novelCode);
    let status = ""
    if (novel.status === 0) {
        status = "sắp ra mắt"
    }
    if (novel.status === 1) {
        status = "đang phát hành"
    }
    if (novel.status === 2) {
        status = "đã hoàn thành"
    }
    let listCategory = ""
    novel.category.forEach(category => {
        listCategory += `<a href="#">${category}</a>`
    });

    const bannerHTML = `
    <div class="banner-child">
        <div class="banner-avt">
            <img src="${novel.descriptionImage}" alt="">
            <div class="banner-imp">
                <button class="share">
                    <i class="fa-brands fa-facebook-f"></i>
                    <span>Chia sẻ</span>
                </button>
                <button class="follow">
                    <i class="fa-solid fa-heart"></i>
                    <span>Theo dõi</span>
                </button>
                <button class="unfollow important" style="color: #9c1f66; display: none;">
                    <i class="fa-solid fa-heart"></i>
                    <span>Bỏ Theo dõi</span>
                </button>
            </div>
        </div>
        <div class="banner-desc">
            <h2>${novel.novelName}</h2>
            <div class="in4">
                <ul>
                    <li>Tác giả <a href="#">${novel.authorName}</a></li>
                    <li>Trạng thái <a href="#">${status}</a></li>
                    <li>Lượt xem <a href="#">${novel.view}</a></li>
                    <li>Theo dõi <a href="#">0</a></li>
                    <li>Thể loại ${listCategory}</li>
                </ul>
                <p class="desc">
                    <iframe src="${novel.descriptionURL}" frameborder="0" width="100%" height="100%"></iframe>
                </p>
            </div>
        </div>
    </div>`;
    bannerSelector.innerHTML += bannerHTML;

    listChapter.forEach(chapter => {
        const date = new Date(chapter.updateAt);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Thêm số 0 ở đầu nếu tháng chỉ có 1 chữ số
        const day = String(date.getDate()).padStart(2, '0'); // Thêm số 0 ở đầu nếu ngày chỉ có 1 chữ số
        const hours = String(date.getHours()).padStart(2, '0'); // Thêm số 0 ở đầu nếu giờ chỉ có 1 chữ số
        const minutes = String(date.getMinutes()).padStart(2, '0'); // Thêm số 0 ở đầu nếu phút chỉ có 1 chữ số
        const seconds = String(date.getSeconds()).padStart(2, '0'); // Thêm số 0 ở đầu nếu giây chỉ có 1 chữ số
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        const tableBodyHTML = `
        <tr>
            <td>${chapter.chapterName}</td>
            <td>${formattedDate}</td>
            <td>${chapter.view}</td>
            <td><a href="./read.html?chapterId=${chapter._id}&novelCode=${novelCode}">Đọc</a></td>
        </tr>`;
        tableBodySelector.innerHTML += tableBodyHTML;
    });
}

const getUserProfile = async (access_token) => {
    const user = await fetch("http://193.203.160.126:3535/users/get-me", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        }
    });
    return user.json()
}
const followNovel = async (novelId, access_token) => {
    const result = await fetch("http://193.203.160.126:3535/users/follow-novel", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify({
            novelId
        })
    });
    return result.json()
}
const unfollowNovel = async (novelId, access_token) => {
    const result = await fetch("http://193.203.160.126:3535/users/unfollow-novel", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify({
            novelId
        })
    });
    return result.json()
}
renderNovel().then(() => {

    getUserProfile(access_token)
        .then((res) => {
            console.log(res);
            const following = res.following;
            // Đặt biến check để kiểm tra xem novelId có trong danh sách following không
            const check = following.includes(novelId);
            if (check) {
                followButton.style.display = 'none';
                unfollowButton.style.display = 'block';
            }
            const userName = res.name;
            loginSelector.style.display = 'none';
            logoutSelector.style.display = 'flex';
            helloUserSelector.innerHTML = `Xin chào ${userName}`;
            console.log("get me successfully");
        })
        .catch(() => {
            // Xử lý lỗi nếu có
        });

    const followButton = document.querySelector(".follow");
    const unfollowButton = document.querySelector(".unfollow"); // Define unfollow button here
    followButton.addEventListener("click", async () => {
        followButton.style.display = 'none';
        unfollowButton.style.display = 'block';
        await followNovel(novelId, access_token)
    })
    unfollowButton.addEventListener("click", async () => {
        // Toggle the display of unfollow and follow buttons
        unfollowButton.style.display = 'none';
        followButton.style.display = 'block';
        await unfollowNovel(novelId, access_token)
    });
})
    .catch((e) => {
        console.log(e)
    })
