import { renderAllCategory } from './category.js';

const contentSelector = document.querySelector('.content');
const previousChapterSelector = document.querySelector('.previous-chapter');
const nextChapterSelector = document.querySelector('.next-chapter');
const listChapterChildSelector = document.querySelector('.list-chapter-1');
const listChapterSelector = document.querySelector('.list-chapter');
const heartSelector = document.querySelector('.heart');
const access_token = localStorage.getItem("access_token");
const loginSelector = document.querySelector(".login")
const logoutSelector = document.querySelector(".logout-after")
const helloUserSelector = document.querySelector(".hello_user")
const getQueryParameter = (name) => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(name);
}

let chapterId = getQueryParameter('chapterId');
let novelCode = getQueryParameter('novelCode');

const getListChapterOfNovel = async (novelCode) => {
    const response = await fetch(`http://193.203.160.126:3535/novels/get-chapter-in-novel?novelCode=${novelCode}`, {
        method: "GET"
    });
    return response.json();
}
const getChapter = async (chapterId, novelCode) => {
    const response = await fetch(`http://193.203.160.126:3535/novels/get-chapter?chapterId=${chapterId}&novelCode=${novelCode}`, {
        method: "GET"
    });
    return response.json();
}

const getPreviousChapter = async (chapterId, novelCode) => {
    const response = await fetch(`http://193.203.160.126:3535/novels/get-previous-chapter?chapterId=${chapterId}&novelCode=${novelCode}`, {
        method: "GET"
    });
    return response.json();
}

const getNextChapter = async (chapterId, novelCode) => {
    const response = await fetch(`http://193.203.160.126:3535/novels/get-next-chapter?chapterId=${chapterId}&novelCode=${novelCode}`, {
        method: "GET"
    });
    return response.json();
}

const renderContent = async (chapter) => {
    document.title = chapter.chapterName;
    const chapterHTML = `
        <iframe src="${chapter.contentURL}" frameborder="0" width="100%" height="1000px"></iframe>
    `;
    contentSelector.innerHTML = chapterHTML;
}

const renderChapter = async (chapter) => {
    await renderAllCategory();
    await renderContent(chapter);
}
const increaseView = async (chapterId, novelCode) => {
    try {
        const response = await fetch(`http://193.203.160.126:3535/novels/increase-view`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chapterId: chapterId,
                novelCode: novelCode
            })
        });

        const data = await response.json();
        if (!data.success) {
            throw new Error("Failed to increase view count");
        }
    } catch (error) {
        console.error("Error in increaseView function:", error);
        // Handle error appropriately, like throwing it or returning an error object
        throw error;
    }
};

const loadChapter = async (chapterId, novelCode) => {
    console.log(chapterId, novelCode)
    await increaseView(chapterId, novelCode);
    const chapter = await getChapter(chapterId, novelCode);
    renderChapter(chapter);
}

previousChapterSelector.addEventListener('click', async () => {
    const previousChapter = await getPreviousChapter(chapterId, novelCode);
    if (previousChapter && previousChapter._id) {
        chapterId = previousChapter._id;
        await loadChapter(chapterId, novelCode);
    } else {
        console.log("No previous chapter available.");
    }
});
nextChapterSelector.addEventListener('click', async () => {
    console.log(1)
    const nextChapter = await getNextChapter(chapterId, novelCode);
    console.log(nextChapter)
    if (nextChapter && nextChapter._id) {
        chapterId = nextChapter._id;
        await loadChapter(chapterId, novelCode);
    } else {
        console.log("No next chapter available.");
    }
});
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
loadChapter(chapterId, novelCode).then(async () => {
    const listChapter = await getListChapterOfNovel(novelCode)
    listChapter.forEach((chapter) => {
        console.log(chapter)
        const chapterHTML = `
        <li> 
            <a href="./read.html?chapterId=${chapter._id}&novelCode=${chapter.novelCode}">${chapter.chapterName}</a>
        </li>
        `
        listChapterChildSelector.innerHTML += chapterHTML
    })
    listChapterSelector.addEventListener("click", () => {
        // Kiểm tra trạng thái hiện tại của listChapterChildSelector
        if (listChapterChildSelector.style.display === "block") {
            // Nếu đang hiển thị, ẩn đi
            listChapterChildSelector.style.display = "none";
        } else {
            // Nếu đang ẩn, hiển thị lên
            listChapterChildSelector.style.display = "block";
        }
    });

    getUserProfile(access_token)
        .then((res) => {
            // const 
            console.log(res)
            const userName = res.name
            loginSelector.style.display = 'none'
            // logoutSelector.style.display=''
            logoutSelector.style.display = 'flex'
            helloUserSelector.innerHTML = `Xin chào ${userName}`
            console.log("get me successfully")
        })
        .catch(() => {
            // console.log("abc")
        })
    console.log('Loaded chapter');
});
