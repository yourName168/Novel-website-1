import { renderAllCategory, renderTopCategoryView } from './category.js';
import { renderTopViewNovel, slideAction } from './topViewNovel.js';
const listNovelSelector = document.querySelector('.list-novel-new');

const getQUeryString = (name) => {
    const search = window.location.search;
    const searchParams = new URLSearchParams(search);
    return searchParams.get(name);
}

const fetchData = async (listId) => {
    let queryRequest = "";
    if (listId !== null) {
        queryRequest = listId.split(',').map((id) => `${id}`).join("&listNovelId=");
    }
    const response = await fetch(`http://193.203.160.126:3535/novels/get-list-novel-by-list-id?listNovelId=${queryRequest}`, {
        method: "GET"
    });
    return response.json();
};

const renderNovel = (data) => {
    // Iterate over each novel in the data
    data.forEach(novel => {
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
        console.log(novel)
        // Create HTML for each novel
        const novelHTML = `
            <div class="item-novel-new">
                <a href="./detail.html?id=${novel._id}">
                    <div class="image-container">
                        <img src="${novel.descriptionImage}" alt="">
                        <div class="desc-in">
                            <div class="chap item">
                                <i class="fa-regular fa-heart"></i>
                                <span>${novel.episodes} chapter</span>
                            </div>
                            <div class="view item">
                                <i class="fa-regular fa-heart"></i>
                                <span>${novel.view} lượt xem</span>
                            </div>
                        </div>
                    </div>
                    <div class="in4">
                        <h2 class="title">${novel.novelName}</h2>
                        <div class="desc">
                            <div class="chap item">
                                <i class="fa-regular fa-heart"></i>
                                <span>${novel.followed} người theo dõi</span>
                            </div>
                            <div class="view item">
                                <i class="fa-regular fa-heart"></i>
                                <span>${status}</span>
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
        // Append the novel HTML to the list
        listNovelSelector.innerHTML += novelHTML;
    });
}
const render = async () => {
    const listNovelId = getQUeryString('listNovelId');
    const data = await fetchData(listNovelId);
    renderNovel(data);
    await slideAction();
    await renderTopViewNovel();
    await renderTopCategoryView();
    await renderAllCategory();
}
render().then(() => {
    console.log('Rendered');
});
