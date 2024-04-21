
import { renderTopViewNovel } from './topViewNovel.js';
import { renderAllCategory,renderTopCategoryView } from './category.js';
const bannerSelector = document.querySelector('.inner-banner');
const tableBodySelector = document.querySelector('.table-body');

const getQUeryString = (name) => {
    const search = window.location.search;
    const searchParams = new URLSearchParams(search);
    return searchParams.get(name);
}

const getNovel = async (novelId) => {
    const response = await fetch(`http://localhost:4000/novels/get-list-novel-by-list-id?listNovelId=${novelId}`, {
        method: "GET"
    });
    return response.json(); // Assuming response is JSON
}

const getListChapterOfNovel = async (novelCode) => {
    const response = await fetch(`http://localhost:4000/novels/get-chapter-in-novel?novelCode=${novelCode}`, {
        method: "GET"
    });
    return response.json(); // Assuming response is JSON
}

const renderNovel = async () => {
    await renderAllCategory();
    await renderTopCategoryView();
    await renderTopViewNovel();
    const novelId = getQUeryString('id');
    const novel = (await getNovel(novelId))[0]
    console.log(novel)
    const novelCode = novel.novelCode;
    const listChapter = await getListChapterOfNovel(novelCode);
    console.log(listChapter)
    const novelStatus = novel.status;
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
        const tableBodyHTML = `
        <tr>
            <td>${chapter.chapterName}</td>
            <td>${chapter.updateTime}</td>
            <td>${chapter.view}</td>
            <td><a href="./read.html?chapterId=${chapter._id}&novelCode=${novelCode}
            ">Đọc</a></td>
        </tr>`;
        tableBodySelector.innerHTML += tableBodyHTML;
    });
}

renderNovel()
    .then(() => {
    console.log('Rendered')}
);
