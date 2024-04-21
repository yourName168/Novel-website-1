// Selectors
const listCategorySelector = document.querySelector('#category-list');
const listCategoryOnHeader = document.querySelector('.list');
const maxCategoriesToShow = 8; // Maximum number of categories to show

const getListCategory = async () => {
    const response = await fetch("http://193.203.160.126:3535/novels/get-all-category", {
        method: "GET"
    });
    return response.json();
}
// Fetch categories data
const renderTopCategoryView = async () => {
    console.log(123)
    const data = await getListCategory();
    // Extract first maxCategoriesToShow categories
    const categoriesToShow = data.slice(0, maxCategoriesToShow);
    // Render categories in the category list
    categoriesToShow.forEach(category => {
        const queryRequest = category.novelId.map((id) => `${id}`).join(",");
        const categoryHTML = `
            <a href="./home.html?listNovelId=${queryRequest}">
                <div class="category-item">
                    <span>${category.categoryName}</span>
                </div>
            </a>
        `;
        listCategorySelector.innerHTML += categoryHTML;
    });
}
const renderAllCategory = async () => {
    const data = await getListCategory();
    // Render categories in the header
    data.forEach(category => {
        const queryRequest = category.novelId.map((id) => `${id}`).join(",");
        const categoryHTML = `
            <li>
                <a href="./home.html?listNovelId=${queryRequest}">
                ${category.categoryName}</a>
            </li>
        `;
        listCategoryOnHeader.innerHTML += categoryHTML;
    });
}
export { renderAllCategory, renderTopCategoryView };

