const loginSelector = document.querySelector('.login');
const registerSelector = document.querySelector('.register')

const loginHandler = async (email, password) => {
    try {
        const result = await fetch("http://localhost:3535/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });
        const data = await result.json();
        console.log(data);
        return data; // Trả về dữ liệu từ máy chủ
    } catch (error) {
        console.error('Error:', error);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Ngăn chặn việc gửi form mặc định
        const username = form.elements['username'].value;
        const password = form.elements['password'].value;

        // Gọi hàm loginHandler để gửi yêu cầu đăng nhập
        const result = await loginHandler(username, password);

        // Xử lý kết quả đăng nhập
        if (result && result.message==="login success!") {
            alert('Đăng nhập thành công!');
            localStorage.setItem("access_token",result.result)
            // Lưu token vào localStorage hoặc cookie
            // Chuyển hướng đến trang sau khi đăng nhập thành công
            window.location.href = "./home.html";
        } else {
            alert('Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin đăng nhập.');
        }
    });
});

const access_token = localStorage.getItem("access_token");

const getUserProfile=async(access_token)=>{
    const user = await fetch("http://localhost:3535/users/get-me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization":`Bearer ${access_token}`
            }
        });
        
        return user.json()
}
console.log(123)
getUserProfile(access_token)
.then((res)=>{
    // const 
    console.log(res)
    const userName=res.name
    // loginSelector.style.display='none'
    loginSelector.innerHTML=`Xin chào ${userName}`
    console.log("get me successfully")
})
.catch(()=>{
    console.log("abc")
})