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
        // Create HTML for each novel
        const novelHTML = `
            <div class="t01"> 
            <div class="item-novel-new col-xl-3 col-md-4 col-6">
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
    // console.log('Rendered');
    let thisPage = 1;
    let limit = 16;
    let list = document.querySelectorAll('.t01');
    console.log(list);

    function loadItem() {
        let beginGet = limit * (thisPage - 1);
        let endGet = limit * thisPage - 1;
        list.forEach((item, key) => {
            if (key >= beginGet && key <= endGet) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        })
        listPage();
    }
    loadItem();
    function listPage() {
        let count = Math.ceil(list.length / limit);
        console.log(count);
        document.querySelector('.listPage').innerHTML = '';

        if (thisPage != 1) {
            let prev = document.createElement('li');
            prev.innerText = '<';
            prev.setAttribute('onclick', "changePage(" + (thisPage - 1) + ")");
            document.querySelector('.listPage').appendChild(prev);
        }
        for (let i = 1; i <= count; i++) {
            let newPage = document.createElement('li');
            newPage.innerText = i;
            if (i == thisPage) {
                newPage.classList.add('active');
            }
            newPage.setAttribute('onclick', "changePage(" + i + ")");
            document.querySelector('.listPage').appendChild(newPage);
        }

        if (thisPage != count) {
            let next = document.createElement('li');
            next.innerText = '>';
            next.setAttribute('onclick', "changePage(" + (thisPage + 1) + ")");
            document.querySelector('.listPage').appendChild(next);

        }
    }
    window.changePage = function(i) {
        thisPage = i;
        console.log(thisPage);
        loadItem();
    }
});


