import { renderTopCategoryView,renderAllCategory } from './category.js';
import { renderTopViewNovel, slideAction } from './topViewNovel.js';
const listNovelSelector = document.querySelector('.list-novel-new');
const getQUeryString = (name) => {
    const search = window.location.search;
    const searchParams = new URLSearchParams(search);
    return searchParams.get(name);
}

const fetchData = async (listId) => {
    let queryRequest = "";
    if(listId !== null){
        queryRequest=listId.split(',').map((id) => `${id}`).join("&listNovelId=");
    }
    const response = await fetch(`http://localhost:4000/novels/get-list-novel-by-list-id?listNovelId=${queryRequest}`, {
        method: "GET"
    });
    return response.json();
};

const renderNovel = (data) => {
    // Iterate over each novel in the data
    data.forEach(novel => {
        // Create HTML for each novel
        const novelHTML = `
            <div class="item-novel-new">
                <a href="./detail.html?id=${novel._id}">
                    <div class="image-container">
                        <img src="${novel.descriptionImage}" alt="">
                        <div class="desc-in">
                            <div class="chap item">
                                <i class="fa-regular fa-heart"></i>
                                <span>1</span>
                            </div>
                            <div class="view item">
                                <i class="fa-regular fa-heart"></i>
                                <span>${novel.view}</span>
                            </div>
                        </div>
                    </div>
                    <div class="in4">
                        <h2 class="title">${novel.novelName}</h2>
                        <div class="desc">
                            <div class="chap item">
                                <i class="fa-regular fa-heart"></i>
                                <span>${novel.theLastChapter}</span>
                            </div>
                            <div class="view item">
                                <i class="fa-regular fa-heart"></i>
                                <span>${novel.updateTime}</span>
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
