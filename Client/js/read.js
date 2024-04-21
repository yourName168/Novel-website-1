import { renderAllCategory } from './category.js';

const contentSelector = document.querySelector('.content');
const previousChapterSelector = document.querySelector('.previous-chapter');
const nextChapterSelector = document.querySelector('.next-chapter');
const listChapterSelector = document.querySelector('.list-chapter');
const heartSelector = document.querySelector('.heart');

const getQueryParameter = (name) => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(name);
}

let chapterId = getQueryParameter('chapterId');
let novelCode = getQueryParameter('novelCode');

const getChapter = async (chapterId, novelCode) => {
    const response = await fetch(`http://localhost:4000/novels/get-chapter?chapterId=${chapterId}&novelCode=${novelCode}`, {
        method: "GET"
    });
    return response.json();
}

const getPreviousChapter = async (chapterId, novelCode) => {
    const response = await fetch(`http://localhost:4000/novels/get-previous-chapter?chapterId=${chapterId}&novelCode=${novelCode}`, {
        method: "GET"
    });
    return response.json();
}

const getNextChapter = async (chapterId, novelCode) => {
    const response = await fetch(`http://localhost:4000/novels/get-next-chapter?chapterId=${chapterId}&novelCode=${novelCode}`, {
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

const loadChapter = async (chapterId, novelCode) => {
    console.log(1)
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

loadChapter(chapterId, novelCode).then(() => {
    console.log('Loaded chapter');
});
